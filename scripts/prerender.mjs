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
 * Resolves the on-disk output path for a route document.
 * @param {string} routePath - Route path such as "/" or "/work".
 * @returns {string} Absolute file path under dist/.
 */
function outputPathFor(routePath) {
  return routePath === "/" ? path.join(DIST, "index.html") : path.join(DIST, routePath.slice(1), "index.html");
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

    const outPath = outputPathFor(route.path);
    await fs.mkdir(path.dirname(outPath), { recursive: true });
    await fs.writeFile(outPath, document, "utf8");
    report.push({ path: route.path, chars, bytes: document.length, indexable: route.indexable });
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
  await fs.writeFile(path.join(DIST, "not-found.html"), notFoundHtml, "utf8");

  const indexable = SITE_ROUTES.filter((route) => route.indexable);
  await fs.writeFile(path.join(DIST, "sitemap.xml"), buildSitemap(indexable, canonicalUrl, lastmod), "utf8");

  await fs.writeFile(
    path.join(DIST, "route-manifest.json"),
    `${JSON.stringify({ generatedAt: lastmod, paths: ALL_ROUTES.map((r) => r.path) }, null, 2)}\n`,
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
