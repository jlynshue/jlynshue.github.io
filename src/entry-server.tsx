/**
 * Build-time render entry. Consumed only by `scripts/prerender.mjs`.
 *
 * This exists so each route can ship real HTML instead of an empty
 * `<div id="root">`. Before this, every route returned the same 3,015-byte
 * shell carrying 86 characters of crawler-visible text.
 *
 * The markup produced here is rendered from the same components and the same
 * provider stack the browser uses (`AppProviders` + `AppRoutes` from App.tsx).
 * That is deliberate: it makes the crawler-visible text identical to what a
 * visitor sees by construction, so it cannot drift into cloaking the way a
 * hand-maintained copy of the page text would.
 */
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";

import { AppProviders, AppRoutes } from "./App";

export {
  SITE_ROUTES,
  LEGACY_ROUTES,
  ALL_ROUTES,
  TOOLKIT_ROUTES,
  allKnownPaths,
  DYNAMIC_ROUTE_PATTERNS,
  ENUMERATED_DYNAMIC_ROUTE_PATTERNS,
  routePatternToRegexSource,
  canonicalUrl,
  SITE_ORIGIN,
  DEFAULT_OG_IMAGE,
} from "./lib/site-routes";

/**
 * Path used to render the client-side NotFound component to disk.
 *
 * Deliberately not a real route: it matches the `*` route, so rendering it
 * produces the same NotFound markup a visitor sees on any unknown URL.
 */
export const NOT_FOUND_RENDER_PATH = "/__not_found__";

/**
 * Renders one route to a static HTML string.
 *
 * `useEffect` never runs during server rendering, which is what keeps this
 * safe for this app: `WallpaperLayout` only touches three.js inside an effect,
 * so the WebGL wallpaper is skipped here and emitted as a bare `<canvas>`.
 *
 * @param {string} path - Route path to render, e.g. "/work".
 * @returns {string} Serialized HTML for the app tree.
 */
export function render(path: string): string {
  return renderToString(
    <AppProviders>
      <StaticRouter location={path}>
        <AppRoutes />
      </StaticRouter>
    </AppProviders>,
  );
}
