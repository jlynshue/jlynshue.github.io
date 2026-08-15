import fs from "node:fs/promises";
import path from "node:path";

const [templatePath = "firebase.template.json", outputPath = "firebase.generated.json"] =
  process.argv.slice(2);

const serviceId = process.env.FIREBASE_CLOUD_RUN_SERVICE_ID;
const region = process.env.FIREBASE_CLOUD_RUN_REGION;

/**
 * Abort without writing anything.
 *
 * Every validation in this file must end here rather than degrading to a
 * partial config. A config that renders successfully but omits routes deploys
 * cleanly and 404s real pages — the build looks green and only a visitor finds
 * out. Refusing to write is the whole point.
 */
function fail(message) {
  console.error(message);
  process.exit(1);
}

if (!serviceId || !region) {
  fail("FIREBASE_CLOUD_RUN_SERVICE_ID and FIREBASE_CLOUD_RUN_REGION are required.");
}

/**
 * Static-fallback mode.
 *
 * Every page route used to fall through to the Cloud Run server via a `**`
 * catch-all. That makes the whole site — not just one page — unreachable
 * whenever the service cannot run, which is exactly what happened when billing
 * was disabled on the GCP project: every non-file path returned 503 while the
 * prerendered HTML for those same routes sat unused in `dist/__prerendered__`.
 *
 * In static-fallback mode Firebase Hosting serves that prerendered HTML itself,
 * which needs no compute and no billing. Only genuinely dynamic paths (`/r/**`
 * tracking redirects, `/webhooks/**`, `/internal/**`) still require Cloud Run.
 *
 * It defaults to ON so that the failure mode is a working site. Set
 * FIREBASE_STATIC_FALLBACK=0 to restore the Cloud Run catch-all once the
 * backend is reliably serving again.
 */
const staticFallback = process.env.FIREBASE_STATIC_FALLBACK !== "0";

const manifestPath = process.env.ROUTE_MANIFEST_PATH ?? "dist/route-manifest.json";

const template = await fs.readFile(templatePath, "utf8");
const config = JSON.parse(
  template.replaceAll("__CLOUD_RUN_SERVICE_ID__", serviceId).replaceAll("__CLOUD_RUN_REGION__", region),
);

/**
 * The directory Hosting actually publishes. Read it from the config rather than
 * hardcoding "dist": the existence check below and the deployed `public` root
 * must be the same directory, and stating that fact twice is how they drift.
 * Renaming `public` while a literal "dist" stayed here would validate one
 * directory and deploy another — the check would pass against files nobody
 * serves.
 */
const publicRoot = config.hosting?.public;
if (typeof publicRoot !== "string" || publicRoot.trim().length === 0) {
  fail(`${templatePath} must declare a non-empty hosting.public directory; got ${JSON.stringify(publicRoot)}.`);
}
// A non-empty string is not enough. ".", "/", "../.." and backslash paths are
// all non-empty, and each would point the existence check at a directory
// Firebase will not publish — so the check would pass against files nobody
// serves, which is the exact failure this validation exists to prevent.
if (
  path.posix.isAbsolute(publicRoot) ||
  publicRoot.includes("\\") ||
  publicRoot.split("/").some((segment) => segment === "." || segment === "..")
) {
  fail(
    `hosting.public must be a relative path below the project root with no "." or ".." segments; ` +
      `got ${JSON.stringify(publicRoot)}.`,
  );
}

/**
 * Build one static rewrite per prerendered route, read from the build's own
 * route manifest. Deriving them here rather than hardcoding a second list is
 * deliberate: a hand-maintained copy silently goes stale the moment someone
 * adds a route, and the symptom would be a 404 on a page that exists.
 */
async function prerenderedRewrites() {
  let manifest;
  try {
    manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
  } catch (error) {
    // Fail loudly. Falling back to "no static routes" would emit a config that
    // deploys cleanly and 404s every page — a broken site that looks like a
    // successful build.
    fail(
      `Static fallback is enabled but the route manifest could not be read at ${manifestPath}.\n` +
        `Run \`npm run build\` before rendering the Firebase config, or set FIREBASE_STATIC_FALLBACK=0.\n` +
        `Cause: ${error.message}`,
    );
  }

  // Client-side dynamic routes (e.g. "/post/:slug") cannot be satisfied by a
  // per-route static rewrite, and with the catch-all removed a direct deep link
  // to one would 404. That config would DEPLOY CLEANLY — the build succeeds,
  // every prerendered route resolves, and only a visitor following a real link
  // discovers the hole. Refuse to emit it.
  //
  // Empty today. This guard exists so that adding the first dynamic route
  // fails the build instead of silently shipping broken deep links.
  // Check the TYPE, not just the length. `{}.length` is undefined and
  // `undefined > 0` is false, so a malformed manifest whose dynamicPatterns is
  // an object — or a number, or null-ish garbage — sailed straight through a
  // length-only test. A guard that silently accepts the malformed case is worse
  // than no guard, because it reads as protection.
  const dynamicPatterns = manifest.dynamicPatterns ?? [];
  if (!Array.isArray(dynamicPatterns)) {
    fail(
      `${manifestPath} has a dynamicPatterns field that is not an array ` +
        `(${JSON.stringify(dynamicPatterns)}). Refusing to guess whether it declares dynamic routes.`,
    );
  }
  if (dynamicPatterns.length > 0) {
    fail(
      `Static fallback cannot serve the ${dynamicPatterns.length} dynamic route pattern(s) in ` +
        `${manifestPath}: ${dynamicPatterns.map((p) => JSON.stringify(p)).join(", ")}.\n` +
        `With no catch-all rewrite, deep links matching these would 404. Either emit explicit ` +
        `rewrites for them here, or set FIREBASE_STATIC_FALLBACK=0 to restore the catch-all.`,
    );
  }

  // Same reasoning: a string or an array here would survive `Object.entries`
  // and produce nonsense route pairs rather than an error.
  const documents = manifest.documents ?? {};
  if (typeof documents !== "object" || documents === null || Array.isArray(documents)) {
    fail(`${manifestPath} has a documents field that is not an object (${JSON.stringify(documents)}).`);
  }

  const rewrites = [];
  const publicRootResolved = path.resolve(publicRoot);

  for (const [route, document] of Object.entries(documents)) {
    if (typeof route !== "string" || typeof document !== "string" || document.length === 0) {
      fail(`${manifestPath} maps ${JSON.stringify(route)} to ${JSON.stringify(document)}; both must be strings.`);
    }
    // The route becomes a Hosting rewrite `source`. Keys like "__proto__" or
    // "constructor" are own enumerable properties here, so they do not pollute
    // anything — but they would emit a meaningless rewrite, and a source that
    // is not a rooted path is never what the manifest meant.
    if (!route.startsWith("/")) {
      fail(`${manifestPath} declares route ${JSON.stringify(route)}, which must start with "/".`);
    }

    // "/" is served by <publicRoot>/index.html as a real file, so Hosting
    // already resolves it without a rewrite.
    if (route === "/") continue;

    // A document must be a rooted, CANONICAL path inside the published
    // directory.
    //
    // Requiring canonical form rather than blacklisting traversal spellings is
    // deliberate. The bug this replaces was "validate one string, emit a
    // different one": the check ran against the joined filesystem `target`
    // while the rewrite emitted the raw `document`, so any path that normalised
    // onto a real file shipped verbatim. Measured before this guard —
    // "//evil" and "/./probe/x" both passed and were emitted unchanged, and
    // "//evil" is a protocol-relative URL, not a site path.
    //
    // path.posix.normalize collapses "//", "/./" and "/../" alike, so one
    // equality test closes the whole class instead of a list of spellings that
    // will always be missing an entry.
    if (
      !document.startsWith("/") ||
      document.endsWith("/") ||
      document.includes("\\") ||
      document !== path.posix.normalize(document)
    ) {
      fail(
        `Route ${route} points at ${JSON.stringify(document)}, which must be a canonical absolute ` +
          `path to a file inside ${publicRoot} — no "//", "/./", ".." segments, backslashes, or ` +
          `trailing slash. Canonical form would be ${JSON.stringify(path.posix.normalize(document))}.`,
      );
    }

    const target = path.posix.join(publicRoot, document.replace(/^\//, ""));
    // Belt and braces: confirm the resolved file really is under the published
    // root, so any escape this misses still cannot produce a rewrite.
    const targetResolved = path.resolve(target);
    if (targetResolved !== publicRootResolved && !targetResolved.startsWith(publicRootResolved + path.sep)) {
      fail(`Route ${route} resolves to ${targetResolved}, which is outside the published directory ${publicRoot}.`);
    }

    try {
      await fs.access(target);
    } catch {
      fail(`Route ${route} points at ${document}, which is missing from the build.`);
    }

    rewrites.push({ source: route, destination: document });
  }

  if (rewrites.length === 0) {
    fail(`Route manifest at ${manifestPath} declared no routes to serve.`);
  }

  return rewrites;
}

/**
 * `/sheila` always serves the static landing page in public/sheila/, in BOTH
 * fallback modes.
 *
 * This used to branch to a Cloud Run `sheila-api` rewrite when static fallback
 * was off. That branch was both dead and unreachable:
 *
 *   - Dead: the Sheila app no longer runs on Cloud Run at all. It moved to
 *     Render (sheila-api.onrender.com) when billing was disabled on the GCP
 *     project, so the rewrite pointed at a service that cannot serve it.
 *   - Unreachable: public/sheila/index.html is copied into the published
 *     directory unconditionally, and Hosting resolves static files BEFORE
 *     rewrites — so the rewrite could never have fired anyway. Observed
 *     directly: with a `/sheila -> /sheila/index.html` rewrite configured,
 *     /sheila still answered 301 to /sheila/, a directory-index redirect. A
 *     rewrite would have returned 200 without redirecting.
 *
 * Keeping the branch meant FIREBASE_STATIC_FALLBACK=0 silently did not do what
 * it said. The landing page is the correct destination now: it links out to
 * wherever the app is hosted, so moving the app again touches one HTML file
 * rather than this config.
 */
const sheilaRewrites = [
  { source: "/sheila", destination: "/sheila/index.html" },
  { source: "/sheila/**", destination: "/sheila/index.html" },
];

const expanded = [];
for (const rewrite of config.hosting.rewrites) {
  switch (rewrite.source) {
    case "__PRERENDERED_ROUTES__":
      if (staticFallback) expanded.push(...(await prerenderedRewrites()));
      break;
    case "__SHEILA_ROUTES__":
      expanded.push(...sheilaRewrites);
      break;
    case "__CATCH_ALL__":
      // With static fallback on there is no catch-all: anything unmatched falls
      // to Hosting's own 404 handling (dist/404.html), so a missing page reads
      // as an honest 404 rather than a 503 server error.
      if (!staticFallback) expanded.push({ ...rewrite, source: "**" });
      break;
    default:
      expanded.push(rewrite);
  }
}
config.hosting.rewrites = expanded;

await fs.writeFile(outputPath, `${JSON.stringify(config, null, 2)}\n`, "utf8");

console.log(
  `Wrote ${outputPath} — static fallback ${staticFallback ? "ON" : "OFF"}, ${expanded.length} rewrites.`,
);
