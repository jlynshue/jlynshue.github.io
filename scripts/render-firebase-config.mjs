import fs from "node:fs/promises";
import path from "node:path";

const [templatePath = "firebase.template.json", outputPath = "firebase.generated.json"] =
  process.argv.slice(2);

const serviceId = process.env.FIREBASE_CLOUD_RUN_SERVICE_ID;
const region = process.env.FIREBASE_CLOUD_RUN_REGION;

if (!serviceId || !region) {
  console.error("FIREBASE_CLOUD_RUN_SERVICE_ID and FIREBASE_CLOUD_RUN_REGION are required.");
  process.exit(1);
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
    console.error(
      `Static fallback is enabled but the route manifest could not be read at ${manifestPath}.\n` +
        `Run \`npm run build\` before rendering the Firebase config, or set FIREBASE_STATIC_FALLBACK=0.\n` +
        `Cause: ${error.message}`,
    );
    process.exit(1);
  }

  const documents = manifest.documents ?? {};
  const rewrites = [];

  for (const [route, document] of Object.entries(documents)) {
    // "/" is served by dist/index.html as a real file, so Hosting already
    // resolves it without a rewrite.
    if (route === "/") continue;

    const target = path.posix.join("dist", document.replace(/^\//, ""));
    try {
      await fs.access(target);
    } catch {
      console.error(`Route ${route} points at ${document}, which is missing from the build.`);
      process.exit(1);
    }

    rewrites.push({ source: route, destination: document });
  }

  if (rewrites.length === 0) {
    console.error(`Route manifest at ${manifestPath} declared no routes to serve.`);
    process.exit(1);
  }

  return rewrites;
}

// `/sheila` is the Sheila RE-Forms app on its own Cloud Run service. While that
// service is down, serve the static stand-in in public/sheila/ instead.
const sheilaRewrites = staticFallback
  ? [
      { source: "/sheila", destination: "/sheila/index.html" },
      { source: "/sheila/**", destination: "/sheila/index.html" },
    ]
  : [
      { source: "/sheila", run: { serviceId: "sheila-api", region } },
      { source: "/sheila/**", run: { serviceId: "sheila-api", region } },
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
