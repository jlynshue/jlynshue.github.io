/**
 * Build-time prerenderer.
 *
 * Runs after `vite build`. For every route in the manifest it renders the real
 * component tree to HTML, rewrites the document head with route-specific
 * metadata, and writes a standalone document to `dist/`.
 *
 * Why this exists: every route used to be served the same 3,015-byte shell
 * carrying 86 characters of crawler-visible text (the `<title>`), sharing one
 * title/description, with no canonical tags and no sitemap.
 *
 * Outputs:
 *   dist/index.html            homepage, head rewritten, #root prefilled
 *   dist/<route>/index.html    one document per route
 *   dist/not-found.html        prerendered NotFound body, served with a 404
 *   dist/route-manifest.json   consumed by the server to tell 200 from 404
 *   dist/sitemap.xml           generated from the indexable routes
 *
 * Usage: node scripts/prerender.mjs
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");
const SSR_DIST = path.join(ROOT, "dist-ssr");

/** Minimum crawler-visible characters before a route is considered a failure. */
const MIN_TEXT_CHARS = 400;

/**
 * Escapes the five XML metacharacters.
 * @param {string} value - Raw text.
 * @returns {string} XML-safe text.
 */
function escapeXml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Escapes text for use inside an HTML attribute value.
 * @param {string} value - Raw text.
 * @returns {string} Attribute-safe text.
 */
function escapeAttr(value) {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 * Escapes text for use in HTML element content.
 * @param {string} value - Raw text.
 * @returns {string} Content-safe text.
 */
function escapeHtml(value) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 * Strips tags and script bodies to approximate what a non-JS crawler reads.
 * @param {string} html - Full HTML document or fragment.
 * @returns {string} Collapsed visible text.
 */
function visibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Rewrites the head of the built shell with route-specific metadata.
 *
 * Replaces existing tags in place rather than appending duplicates, so the
 * document ends up with exactly one of each. `og:image` and the Twitter card
 * type are left untouched — the audit found them correct.
 *
 * @param {string} template - The `dist/index.html` produced by vite build.
 * @param {{title: string, description: string, canonical: string, indexable: boolean}} meta - Route metadata.
 * @returns {string} Head-rewritten HTML.
 */
function applyMeta(template, meta) {
  let html = template;
  const title = escapeHtml(meta.title);
  const description = escapeAttr(meta.description);
  const canonical = escapeAttr(meta.canonical);

  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`);
  html = html.replace(
    /<meta name="description" content="[\s\S]*?"\s*\/>/,
    `<meta name="description" content="${description}" />`,
  );
  html = html.replace(
    /<meta property="og:title" content="[\s\S]*?"\s*\/>/,
    `<meta property="og:title" content="${title}" />`,
  );
  html = html.replace(
    /<meta property="og:description" content="[\s\S]*?"\s*\/>/,
    `<meta property="og:description" content="${description}" />`,
  );
  html = html.replace(
    /<meta property="og:url" content="[\s\S]*?"\s*\/>/,
    `<meta property="og:url" content="${canonical}" />`,
  );
  html = html.replace(
    /<meta name="twitter:title" content="[\s\S]*?"\s*\/>/,
    `<meta name="twitter:title" content="${title}" />`,
  );
  html = html.replace(
    /<meta name="twitter:description" content="[\s\S]*?"\s*\/>/,
    `<meta name="twitter:description" content="${description}" />`,
  );

  // Canonical did not exist in the source template; insert one per document.
  const canonicalTag = `<link rel="canonical" href="${canonical}" />`;
  html = html.replace("</head>", `  ${canonicalTag}\n  </head>`);

  return html;
}

/**
 * Injects prerendered markup into the empty root container.
 *
 * `main.tsx` calls `createRoot().render()` rather than `hydrateRoot()`, so React
 * discards this markup on mount instead of attempting hydration. That means a
 * mismatch cannot throw — the prerendered body is purely for consumers that
 * never execute JS.
 *
 * @param {string} html - Head-rewritten document.
 * @param {string} appHtml - Server-rendered app markup.
 * @returns {string} Document with a populated `#root`.
 */
function injectBody(html, appHtml) {
  const emptyRoot = '<div id="root"></div>';
  if (!html.includes(emptyRoot)) {
    throw new Error("Could not find an empty <div id=\"root\"></div> in the built shell");
  }
  return html.replace(emptyRoot, `<div id="root">${appHtml}</div>`);
}

/**
 * Builds sitemap.xml from the indexable routes.
 * @param {Array<{path: string, priority: number}>} routes - Indexable routes.
 * @param {(p: string) => string} toCanonical - Path-to-URL helper.
 * @param {string} lastmod - ISO date (YYYY-MM-DD).
 * @returns {string} Sitemap XML.
 */
function buildSitemap(routes, toCanonical, lastmod) {
  const entries = routes
    .map((route) =>
      [
        "  <url>",
        `    <loc>${escapeXml(toCanonical(route.path))}</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        `    <priority>${route.priority.toFixed(1)}</priority>`,
        "  </url>",
      ].join("\n"),
    )
    .join("\n");

  const ns = "http://www.sitemaps.org/schemas/sitemap/0.9";
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="${ns}">\n${entries}\n</urlset>\n`;
}

/**
 * Directory holding every prerendered document except the homepage.
 *
 * Firebase Hosting resolves exact-match static content BEFORE it applies
 * rewrites, and it resolves `/work` to `dist/work/index.html`. Writing the
 * documents at their route paths would therefore make the CDN answer those
 * routes directly and the `**` rewrite to Cloud Run would stop firing — which
 * silently kills the server-side `page_viewed` event and the `jls_aid`/`jls_sid`
 * first-party cookies for those routes. A visitor landing on `/work` would then
 * reach `/r/discovery-call` with no cookie and be minted a fresh anonymous id,
 * losing first-touch attribution.
 *
 * Parking the documents here keeps `/work` a rewrite (so Cloud Run still tracks
 * it) while the server reads the prerendered body from disk. `cleanUrls` is not
 * enabled, so nothing here is reachable at a route-shaped URL.
 *
 * The homepage is the exception: `dist/index.html` is the Firebase entry point
 * and is already served statically today, so prerendering it in place changes
 * nothing about tracking and simply gives the CDN real content.
 */
const PRERENDER_DIR = "__prerendered__";

/**
 * Resolves where a route's document is written and how the server addresses it.
 * @param {string} routePath - Route path such as "/" or "/work".
 * @returns {{absolutePath: string, servedPath: string}} Disk path and the
 *   static-bundle-relative path the server requests.
 */
function outputPathFor(routePath) {
  if (routePath === "/") {
    return { absolutePath: path.join(DIST, "index.html"), servedPath: "/index.html" };
  }
  const servedPath = `/${PRERENDER_DIR}${routePath}.html`;
  return { absolutePath: path.join(DIST, `${PRERENDER_DIR}${routePath}.html`), servedPath };
}

async function main() {
  const template = await fs.readFile(path.join(DIST, "index.html"), "utf8");
  if (template.includes('<div id="root">\n') || !template.includes('<div id="root"></div>')) {
    throw new Error("dist/index.html is not a fresh vite shell — run `vite build` before prerendering");
  }

  console.log("[prerender] building SSR bundle…");
  execFileSync(
    "npx",
    [
      "vite",
      "build",
      "--ssr",
      "src/entry-server.tsx",
      "--outDir",
      "dist-ssr",
      "--emptyOutDir",
      "--logLevel",
      "warn",
    ],
    { cwd: ROOT, stdio: "inherit" },
  );

  const server = await import(path.join(SSR_DIST, "entry-server.js"));
  const { ALL_ROUTES, SITE_ROUTES, canonicalUrl, render, NOT_FOUND_RENDER_PATH } = server;

  const lastmod = new Date().toISOString().slice(0, 10);
  const failures = [];
  const report = [];
  /** route path -> static-bundle-relative document path, written to the manifest. */
  const documents = {};

  for (const route of ALL_ROUTES) {
    const appHtml = render(route.path);
    const document = injectBody(
      applyMeta(template, {
        title: route.title,
        description: route.description,
        canonical: canonicalUrl(route.path),
        indexable: route.indexable,
      }),
      appHtml,
    );

    const chars = visibleText(appHtml).length;
    if (chars < MIN_TEXT_CHARS) {
      failures.push(`${route.path} rendered only ${chars} chars of visible text (min ${MIN_TEXT_CHARS})`);
    }

    const { absolutePath, servedPath } = outputPathFor(route.path);
    await fs.mkdir(path.dirname(absolutePath), { recursive: true });
    await fs.writeFile(absolutePath, document, "utf8");
    documents[route.path] = servedPath;
    report.push({ path: route.path, chars, bytes: document.length, indexable: route.indexable, servedPath });
  }

  // A real document for genuine 404s, so an unknown URL returns content and a
  // 404 status rather than the homepage shell with a 200.
  const notFoundHtml = injectBody(
    applyMeta(template, {
      title: "Page not found | Jonathan Lyn-Shue",
      description: "That page does not exist. Browse the work, writing, and lab instead.",
      canonical: canonicalUrl("/"),
      indexable: false,
    }).replace("</head>", '  <meta name="robots" content="noindex" />\n  </head>'),
    render(NOT_FOUND_RENDER_PATH),
  );
  // Invariant that protects the tracking pipeline. Firebase Hosting resolves
  // exact-match static content before rewrites, and resolves "/work" to
  // "dist/work/index.html". If a document ever lands at a route-shaped path the
  // CDN answers that route directly, the `**` rewrite stops firing, and the
  // server-side page_viewed event plus the jls_aid/jls_sid cookies silently
  // vanish for it. Nothing about the page would look broken, so fail the build.
  for (const route of ALL_ROUTES) {
    if (route.path === "/") {
      continue;
    }
    for (const staticMatch of [route.path.slice(1), path.join(route.path.slice(1), "index.html")]) {
      const collision = path.join(DIST, staticMatch);
      const exists = await fs
        .access(collision)
        .then(() => true)
        .catch(() => false);
      if (exists) {
        failures.push(
          `${route.path} is statically matchable at dist/${staticMatch} — Firebase Hosting would serve it directly and bypass Cloud Run, losing server-side tracking for that route`,
        );
      }
    }
  }

  const notFoundServedPath = `/${PRERENDER_DIR}/not-found.html`;
  await fs.mkdir(path.join(DIST, PRERENDER_DIR), { recursive: true });
  await fs.writeFile(path.join(DIST, PRERENDER_DIR, "not-found.html"), notFoundHtml, "utf8");

  const indexable = SITE_ROUTES.filter((route) => route.indexable);
  await fs.writeFile(path.join(DIST, "sitemap.xml"), buildSitemap(indexable, canonicalUrl, lastmod), "utf8");

  // The manifest is the single authority the server reads: which paths are real
  // routes, and which document to serve for each. Keeping the document paths in
  // here rather than recomputing them server-side means the two cannot drift.
  await fs.writeFile(
    path.join(DIST, "route-manifest.json"),
    `${JSON.stringify(
      { generatedAt: lastmod, prerenderDir: PRERENDER_DIR, notFoundDocument: notFoundServedPath, documents },
      null,
      2,
    )}\n`,
    "utf8",
  );

  console.log("[prerender] wrote:");
  for (const row of report) {
    console.log(
      `  ${row.path.padEnd(14)} ${String(row.chars).padStart(5)} chars text  ${String(row.bytes).padStart(6)} bytes${row.indexable ? "" : "  (not in sitemap)"}`,
    );
  }
  console.log(`[prerender] sitemap.xml: ${indexable.length} indexable routes`);

  if (failures.length > 0) {
    console.error("\n[prerender] FAILED — routes below the visible-text floor:");
    for (const failure of failures) console.error(`  - ${failure}`);
    process.exit(1);
  }
}

await main();
