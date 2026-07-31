import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import {
  ALL_ROUTES,
  SITE_ROUTES,
  DYNAMIC_ROUTE_PATTERNS,
  allKnownPaths,
  canonicalUrl,
  routePatternToRegexSource,
  SITE_ORIGIN,
} from "./site-routes";

/**
 * Extracts every concrete `path="…"` from the `<Route>` elements in App.tsx.
 *
 * Reads the source rather than importing it, so this guard does not need to
 * render the app (which would pull in three.js and the whole provider stack).
 * Wildcard and index routes are excluded — they are not addressable URLs.
 */
function routePathsDeclaredInApp(): string[] {
  const source = fs.readFileSync(path.resolve(__dirname, "..", "App.tsx"), "utf8");
  const matches = source.matchAll(/<Route\s+path="([^"]+)"/g);
  return [...matches].map((match) => match[1]).filter((routePath) => routePath !== "*");
}

describe("site route manifest", () => {
  it("covers every addressable route declared in App.tsx", () => {
    // This is the guard against the defect that made this work necessary: a
    // route can be added to the router and silently never be indexed, never
    // appear in the sitemap, and — because the server reads this manifest to
    // tell a real route from a typo — start returning 404.
    const declared = routePathsDeclaredInApp()
      .filter((routePath) => !routePath.includes(":"))
      .sort();
    const manifested = allKnownPaths().sort();

    expect(manifested).toEqual(declared);
  });

  it("declares every parameterised route so the server does not 404 it", () => {
    // A `:param` route cannot be prerendered from a fixed list, so it must be
    // registered as a pattern instead. Miss this and the route 404s in
    // production while the suite stays green.
    const declaredDynamic = routePathsDeclaredInApp()
      .filter((routePath) => routePath.includes(":"))
      .sort();

    expect([...DYNAMIC_ROUTE_PATTERNS].sort()).toEqual(declaredDynamic);
  });

  it("compiles route patterns to single-segment matchers", () => {
    const regex = new RegExp(routePatternToRegexSource("/toolkit/:slug"));

    expect(regex.test("/toolkit/executive-briefing")).toBe(true);
    expect(regex.test("/toolkit")).toBe(false);
    expect(regex.test("/toolkit/a/b")).toBe(false);
    expect(regex.test("/toolkitx/a")).toBe(false);
  });

  it("escapes regex metacharacters in literal segments", () => {
    const regex = new RegExp(routePatternToRegexSource("/a.b/:id"));

    expect(regex.test("/a.b/1")).toBe(true);
    expect(regex.test("/axb/1")).toBe(false);
  });

  it("gives every route a distinct title and description", () => {
    // Sharing one title across routes was the original defect: every URL
    // served the homepage's metadata, so no interior page could rank.
    const titles = ALL_ROUTES.map((route) => route.title);
    const descriptions = ALL_ROUTES.map((route) => route.description);

    expect(new Set(titles).size).toBe(titles.length);
    expect(new Set(descriptions).size).toBe(descriptions.length);
  });

  it("keeps descriptions within the length search engines display", () => {
    for (const route of ALL_ROUTES) {
      expect(route.description.length, `${route.path} description`).toBeGreaterThanOrEqual(70);
      expect(route.description.length, `${route.path} description`).toBeLessThanOrEqual(320);
    }
  });

  it("uses leading-slash paths with no trailing slash", () => {
    for (const route of ALL_ROUTES) {
      expect(route.path.startsWith("/"), `${route.path} must start with /`).toBe(true);
      if (route.path !== "/") {
        expect(route.path.endsWith("/"), `${route.path} must not end with /`).toBe(false);
      }
    }
  });

  it("marks the indexable routes and excludes the legacy ones", () => {
    const indexable = SITE_ROUTES.filter((route) => route.indexable).map((route) => route.path);

    expect(indexable).toContain("/");
    expect(indexable).toContain("/work");
    // /v1 is a superseded homepage; promoting it would compete with / for the
    // same query.
    expect(indexable).not.toContain("/v1");
  });

  it("builds absolute canonical URLs", () => {
    expect(canonicalUrl("/")).toBe(`${SITE_ORIGIN}/`);
    expect(canonicalUrl("/work")).toBe(`${SITE_ORIGIN}/work`);
  });
});

describe("deploy build graph", () => {
  const scripts = JSON.parse(fs.readFileSync(path.resolve(__dirname, "..", "..", "package.json"), "utf8"))
    .scripts as Record<string, string>;

  /**
   * Expands an npm script one level, inlining any `npm run <name>` it calls.
   */
  function expand(scriptName: string, depth = 0): string {
    const body = scripts[scriptName] ?? "";
    if (depth > 4) {
      return body;
    }
    return body.replace(/npm run ([\w:.-]+)/g, (_match, name: string) => expand(name, depth + 1));
  }

  it("runs the prerenderer in every build path that ships to production", () => {
    // The defect this guards, found on a real preview deploy: `build:all` was
    // `build:client && build:server` — no prerender. The Dockerfile runs
    // build:all via gcp-build, so the Cloud Run image shipped a dist with no
    // prerendered documents and no route manifest. Firebase Hosting served a
    // correctly prerendered homepage while every other route fell back to the
    // 90-character shell and unknown paths returned 200 again. Both halves of
    // the fix were live and it still did not work end to end.
    for (const entry of ["build", "build:all", "gcp-build"]) {
      expect(expand(entry), `${entry} must run the prerenderer`).toContain("scripts/prerender.mjs");
    }
  });

  it("still builds the server in the container build path", () => {
    expect(expand("gcp-build")).toContain("tsconfig.server.json");
  });
});
