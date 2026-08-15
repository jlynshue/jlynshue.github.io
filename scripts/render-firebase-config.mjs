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

const publicRootResolved = path.resolve(publicRoot);

/**
 * A rewrite source or destination must be a canonical, rooted path.
 *
 * Canonical form rather than a blacklist of traversal spellings: normalize
 * collapses "//", "/./" and "/../" alike, so one equality test closes the class
 * instead of a list that is always one entry short.
 */
function assertCanonicalPath(what, value, { allowTrailingSlash = false } = {}) {
  if (typeof value !== "string" || value.length === 0) {
    fail(`${what} must be a non-empty string; got ${JSON.stringify(value)}.`);
  }
  if (
    !value.startsWith("/") ||
    value.includes("\\") ||
    (!allowTrailingSlash && value.length > 1 && value.endsWith("/")) ||
    value !== path.posix.normalize(value)
  ) {
    fail(
      `${what} must be a canonical absolute path — no "//", "/./", ".." segments, backslashes or ` +
        `trailing slash. Got ${JSON.stringify(value)}; canonical form is ` +
        `${JSON.stringify(path.posix.normalize(value))}.`,
    );
  }
}

/**
 * Validate a static rewrite destination and confirm the file is really in the
 * published directory.
 *
 * EVERY static destination goes through here, whether it came from the route
 * manifest or is hardcoded in this file. The hardcoded /sheila destination was
 * previously exempt, so if the build stopped copying dist/sheila/index.html the
 * generator still wrote a config that deployed cleanly and rewrote every Sheila
 * route to a missing document. A validator that only covers the inputs you
 * remembered is the same blind spot in a new place.
 */
async function assertPublishedFile(what, destination) {
  assertCanonicalPath(what, destination);

  const target = path.posix.join(publicRoot, destination.replace(/^\//, ""));
  const targetResolved = path.resolve(target);
  if (targetResolved !== publicRootResolved && !targetResolved.startsWith(publicRootResolved + path.sep)) {
    fail(`${what} resolves to ${targetResolved}, which is outside the published directory ${publicRoot}.`);
  }

  try {
    await fs.access(target);
  } catch {
    fail(`${what} points at ${destination}, which is missing from the build (looked for ${target}).`);
  }
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

  for (const [route, document] of Object.entries(documents)) {
    // The route becomes a Hosting rewrite `source`, so it gets the same
    // canonical treatment as a destination — it was previously only checked for
    // a leading slash and then emitted raw, which let "//evil" and "/./work"
    // through. Keys like "__proto__" are own enumerable properties here and do
    // not pollute anything, but they are not routes either.
    assertCanonicalPath(`${manifestPath} route ${JSON.stringify(route)}`, route, { allowTrailingSlash: false });

    // "/" is served by <publicRoot>/index.html as a real file, so Hosting
    // already resolves it without a rewrite.
    if (route === "/") continue;

    await assertPublishedFile(`Route ${route} destination`, document);

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
const SHEILA_DESTINATION = "/sheila/index.html";
const sheilaRewrites = [
  { source: "/sheila", destination: SHEILA_DESTINATION },
  { source: "/sheila/**", destination: SHEILA_DESTINATION },
];
// Hardcoded here, but NOT exempt from validation — see assertPublishedFile.
await assertPublishedFile("Sheila rewrite destination", SHEILA_DESTINATION);

/**
 * Every marker this script knows how to expand, and whether the template is
 * required to contain it.
 *
 * Markers are validated BEFORE expansion because expansion is driven by finding
 * them: `prerenderedRewrites()` only ran when a rewrite whose source equalled
 * "__PRERENDERED_ROUTES__" was found, so deleting or misspelling that one line
 * in the template produced a config with ZERO prerendered rewrites that still
 * rendered, still deployed, and 404'd every page on the site. Measured: 0
 * rewrites emitted where 10 were expected.
 *
 * That is the original outage reachable through a typo, so the template's shape
 * is now an assertion rather than an assumption.
 */
const MARKERS = ["__PRERENDERED_ROUTES__", "__SHEILA_ROUTES__", "__CATCH_ALL__"];

if (typeof config.hosting !== "object" || config.hosting === null || !Array.isArray(config.hosting.rewrites)) {
  fail(`${templatePath} must declare hosting.rewrites as an array.`);
}

/**
 * Validate a rewrite that came from the template rather than being generated
 * here.
 *
 * These used to pass straight through the switch's `default:` branch. That left
 * one last instance of the defect this whole file guards against: a template
 * entry like `{ "source": "/about", "destination": "/missing.html" }` was
 * emitted verbatim, and the config deployed cleanly with /about serving a
 * rewrite to a file that does not exist. Measured before this guard.
 *
 * Generated rewrites are validated at the point they are built; this closes the
 * other door.
 */
async function assertTemplateRewrite(rewrite) {
  const where = `${templatePath} rewrite ${JSON.stringify(rewrite.source)}`;
  if (typeof rewrite !== "object" || rewrite === null) {
    fail(`${templatePath} contains a rewrite that is not an object: ${JSON.stringify(rewrite)}.`);
  }
  // Firebase source globs ("/r/**") are already canonical under normalize, so
  // the same check applies to them.
  assertCanonicalPath(`${where} source`, rewrite.source);

  const hasDestination = "destination" in rewrite;
  const hasRun = "run" in rewrite;
  if (hasDestination === hasRun) {
    fail(`${where} must have exactly one of "destination" or "run"; got ${JSON.stringify(Object.keys(rewrite))}.`);
  }

  if (hasDestination) {
    await assertPublishedFile(`${where} destination`, rewrite.destination);
    return;
  }

  const run = rewrite.run;
  if (typeof run !== "object" || run === null) {
    fail(`${where} has a run target that is not an object: ${JSON.stringify(run)}.`);
  }
  for (const field of ["serviceId", "region"]) {
    if (typeof run[field] !== "string" || run[field].trim().length === 0) {
      fail(`${where} run.${field} must be a non-empty string; got ${JSON.stringify(run[field])}.`);
    }
  }
}

const templateSources = config.hosting.rewrites.map((rewrite) => rewrite.source);
for (const marker of MARKERS) {
  const seen = templateSources.filter((source) => source === marker).length;
  if (seen !== 1) {
    fail(
      `${templatePath} must contain exactly one ${marker} rewrite; found ${seen}. ` +
        `Without it the generated config silently omits the routes it stands for.`,
    );
  }
}
// An unknown __MARKER__ is a typo that would otherwise be emitted verbatim as a
// literal rewrite source and match nothing.
for (const source of templateSources) {
  if (typeof source === "string" && /^__.*__$/.test(source) && !MARKERS.includes(source)) {
    fail(`${templatePath} contains an unrecognised marker rewrite source ${JSON.stringify(source)}.`);
  }
}

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
      //
      // The marker object carries the run block that will be emitted, so it is
      // validated with the same rules as any other template rewrite — the
      // source is replaced afterwards, and "**" is not a canonical path.
      if (!staticFallback) {
        await assertTemplateRewrite({ ...rewrite, source: "/__catch_all__" });
        expanded.push({ ...rewrite, source: "**" });
      }
      break;
    default:
      await assertTemplateRewrite(rewrite);
      expanded.push(rewrite);
  }
}
config.hosting.rewrites = expanded;

await fs.writeFile(outputPath, `${JSON.stringify(config, null, 2)}\n`, "utf8");

console.log(
  `Wrote ${outputPath} — static fallback ${staticFallback ? "ON" : "OFF"}, ${expanded.length} rewrites.`,
);
