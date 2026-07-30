import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createApp } from "./app.js";
import { MemoryTrackingStore } from "./repository.js";
import type { AppConfig } from "./types.js";

/**
 * Builds a static bundle shaped like the prerenderer's output.
 *
 * Note the layout: only the homepage sits at a route-shaped path. Every other
 * document lives under `__prerendered__/` so Firebase Hosting's static matcher
 * cannot intercept the route and bypass the Cloud Run rewrite.
 */
async function createPrerenderedBundle(options: { withManifest: boolean }) {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "jls-route-test-"));

  await fs.writeFile(path.join(dir, "index.html"), "<!doctype html><html><body>HOME DOCUMENT</body></html>", "utf8");

  await fs.mkdir(path.join(dir, "__prerendered__"));
  await fs.writeFile(
    path.join(dir, "__prerendered__", "work.html"),
    "<!doctype html><html><body>WORK DOCUMENT</body></html>",
    "utf8",
  );
  await fs.writeFile(
    path.join(dir, "__prerendered__", "not-found.html"),
    "<!doctype html><html><body>NOT FOUND DOCUMENT</body></html>",
    "utf8",
  );

  if (options.withManifest) {
    await fs.writeFile(
      path.join(dir, "route-manifest.json"),
      JSON.stringify({
        generatedAt: "2026-07-30",
        prerenderDir: "__prerendered__",
        notFoundDocument: "/__prerendered__/not-found.html",
        documents: {
          "/": "/index.html",
          "/work": "/__prerendered__/work.html",
          // Intentionally points at a document this fixture never writes, to
          // exercise the fallback path.
          "/about": "/__prerendered__/about.html",
        },
      }),
      "utf8",
    );
  }

  return dir;
}

function buildConfig(staticDir: string): AppConfig {
  return {
    nodeEnv: "production",
    port: 8080,
    baseUrl: "https://jonathanlynshue.com",
    staticDir,
    cookieDomain: "jonathanlynshue.com",
    discoveryCallUrl: "https://cal.com/jonathanlynshue/discovery-call",
    leadMagnetUrl: "https://tally.so/r/workflow-audit",
    trackingSecret: "tracking-secret",
    internalApiToken: "internal-token",
    calcomWebhookSecret: "calcom-secret",
    tallyWebhookSecret: "tally-secret",
    posthogHost: null,
    posthogApiKey: null,
    hubspotToken: null,
    hubspotStageEventMap: {},
    serviceUrl: null,
    cloudTasksProject: null,
    cloudTasksLocation: null,
    cloudTasksQueue: null,
    linkedinAccessToken: null,
    linkedinPersonUrn: null,
  };
}

function buildApp(staticDir: string) {
  return createApp(buildConfig(staticDir), {
    store: new MemoryTrackingStore(),
    dispatcher: { dispatch: vi.fn().mockResolvedValue(false) } as any,
    posthog: { capture: vi.fn().mockResolvedValue(undefined) },
    hubspot: {
      upsertContact: vi.fn().mockResolvedValue(null),
      searchDealsUpdatedSince: vi.fn().mockResolvedValue([]),
    },
    now: () => new Date("2026-07-30T04:00:00.000Z"),
  });
}

function htmlRequest(pathname: string) {
  return new Request(`https://jonathanlynshue.com${pathname}`, {
    headers: { accept: "text/html" },
  });
}

describe("route-aware HTML serving", () => {
  let staticDir: string;

  afterEach(async () => {
    if (staticDir) {
      await fs.rm(staticDir, { recursive: true, force: true });
    }
  });

  describe("with a route manifest present", () => {
    beforeEach(async () => {
      staticDir = await createPrerenderedBundle({ withManifest: true });
    });

    it("serves the route-specific prerendered document, not the homepage shell", async () => {
      const response = await buildApp(staticDir).handleRequest(htmlRequest("/work"));

      expect(response.status).toBe(200);
      await expect(response.text()).resolves.toContain("WORK DOCUMENT");
    });

    it("serves the homepage document at /", async () => {
      const response = await buildApp(staticDir).handleRequest(htmlRequest("/"));

      expect(response.status).toBe(200);
      await expect(response.text()).resolves.toContain("HOME DOCUMENT");
    });

    it("returns 404 for an unknown path instead of a soft 200", async () => {
      const response = await buildApp(staticDir).handleRequest(htmlRequest("/services"));

      expect(response.status).toBe(404);
      await expect(response.text()).resolves.toContain("NOT FOUND DOCUMENT");
    });

    it("treats a trailing slash as the same route", async () => {
      const response = await buildApp(staticDir).handleRequest(htmlRequest("/work/"));

      expect(response.status).toBe(200);
      await expect(response.text()).resolves.toContain("WORK DOCUMENT");
    });

    it("does not treat a differently-cased path as a known route", async () => {
      // URL paths are case-sensitive; lowercasing during lookup would make
      // /Work resolve as real and reintroduce unbounded soft 404s.
      const response = await buildApp(staticDir).handleRequest(htmlRequest("/Work"));

      expect(response.status).toBe(404);
    });

    it("falls back to the shell for a known route that has no prerendered document", async () => {
      // /about is in the manifest but this fixture has no dist/about/index.html.
      const response = await buildApp(staticDir).handleRequest(htmlRequest("/about"));

      expect(response.status).toBe(200);
      await expect(response.text()).resolves.toContain("HOME DOCUMENT");
    });

    it("still records a page_viewed event for a 404", async () => {
      const store = new MemoryTrackingStore();
      const app = createApp(buildConfig(staticDir), {
        store,
        dispatcher: { dispatch: vi.fn().mockResolvedValue(false) } as any,
        posthog: { capture: vi.fn().mockResolvedValue(undefined) },
        hubspot: {
          upsertContact: vi.fn().mockResolvedValue(null),
          searchDealsUpdatedSince: vi.fn().mockResolvedValue([]),
        },
        now: () => new Date("2026-07-30T04:00:00.000Z"),
      });

      await app.handleRequest(htmlRequest("/nope"));

      expect(Array.from(store.events.values()).map((event) => event.eventName)).toContain("page_viewed");
    });
  });

  describe("parameterised routes", () => {
    beforeEach(async () => {
      staticDir = await fs.mkdtemp(path.join(os.tmpdir(), "jls-route-dyn-"));
      await fs.writeFile(
        path.join(staticDir, "index.html"),
        "<!doctype html><html><body>HOME DOCUMENT</body></html>",
        "utf8",
      );
      await fs.mkdir(path.join(staticDir, "__prerendered__"));
      await fs.writeFile(
        path.join(staticDir, "__prerendered__", "not-found.html"),
        "<!doctype html><html><body>NOT FOUND DOCUMENT</body></html>",
        "utf8",
      );
      await fs.writeFile(
        path.join(staticDir, "route-manifest.json"),
        JSON.stringify({
          notFoundDocument: "/__prerendered__/not-found.html",
          documents: { "/": "/index.html" },
          dynamicPatterns: [{ pattern: "/toolkit/:slug", regex: "^/toolkit/([^/]+)$" }],
        }),
        "utf8",
      );
    });

    it("answers a parameterised route with 200 and the shell", async () => {
      // Without this, a dynamic route has no manifest document, falls through to
      // the 404 branch, and the whole feature disappears in production while
      // every test stays green — there is no dynamic route to test against.
      const response = await buildApp(staticDir).handleRequest(htmlRequest("/toolkit/executive-briefing"));

      expect(response.status).toBe(200);
      await expect(response.text()).resolves.toContain("HOME DOCUMENT");
    });

    it("does not let a pattern swallow paths outside it", async () => {
      // ":slug" is exactly one segment, so neither a missing nor an extra
      // segment may match.
      for (const badPath of ["/toolkit", "/toolkit/a/b", "/toolkitx/a"]) {
        const response = await buildApp(staticDir).handleRequest(htmlRequest(badPath));
        expect(response.status, badPath).toBe(404);
      }
    });
  });

  describe("sitemap content type", () => {
    beforeEach(async () => {
      staticDir = await createPrerenderedBundle({ withManifest: true });
    });

    it("serves .xml as application/xml, not application/octet-stream", async () => {
      await fs.writeFile(path.join(staticDir, "sitemap.xml"), '<?xml version="1.0"?><urlset/>', "utf8");

      const response = await buildApp(staticDir).handleRequest(new Request("https://jonathanlynshue.com/sitemap.xml"));

      expect(response.status).toBe(200);
      expect(response.headers.get("content-type")).toContain("application/xml");
    });

    it("404s a missing .xml file instead of serving the HTML shell", async () => {
      // The original defect: GET /sitemap.xml returned 200 text/html because
      // the catch-all served the SPA, making an absent sitemap indistinguishable
      // from a real one by status code alone.
      const response = await buildApp(staticDir).handleRequest(
        new Request("https://jonathanlynshue.com/sitemap.xml", { headers: { accept: "text/html" } }),
      );

      expect(response.status).toBe(404);
      expect(response.headers.get("content-type") ?? "").not.toContain("text/html");
    });
  });

  describe("with no route manifest", () => {
    beforeEach(async () => {
      staticDir = await createPrerenderedBundle({ withManifest: false });
    });

    it("fails open with a 200 rather than 404-ing the whole site", async () => {
      // Documented degradation: without a manifest the server cannot tell a
      // real route from a typo, so soft-404 protection is disabled by design.
      const response = await buildApp(staticDir).handleRequest(htmlRequest("/services"));

      expect(response.status).toBe(200);
      await expect(response.text()).resolves.toContain("HOME DOCUMENT");
    });
  });
});
