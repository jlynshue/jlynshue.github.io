import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { ALL_ROUTES, SITE_ROUTES, allKnownPaths, canonicalUrl, SITE_ORIGIN } from "./site-routes";

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
    const declared = routePathsDeclaredInApp().sort();
    const manifested = allKnownPaths().sort();

    expect(manifested).toEqual(declared);
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
