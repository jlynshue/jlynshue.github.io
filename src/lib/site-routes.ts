/**
 * The single source of truth for every publicly indexable route.
 *
 * Three consumers read this list, which is why it lives in one place:
 *   1. `scripts/prerender.mjs` — renders one HTML document per entry
 *   2. the same script's sitemap writer — so a route cannot ship without
 *      appearing in `sitemap.xml`
 *   3. `dist/route-manifest.json`, which the Cloud Run server reads to decide
 *      whether an HTML request is a real route (200) or a soft 404 (404)
 *
 * Adding a `<Route>` in `App.tsx` without adding it here means the route is
 * served but not indexed. `src/lib/site-routes.spec.ts` fails the build in that
 * case rather than letting it pass silently.
 */

export const SITE_ORIGIN = "https://jonathanlynshue.com";

/** Shared social-preview image; every route reuses it unless it sets its own. */
export const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/og-image.png`;

export interface SiteRoute {
  /** URL path, always leading-slash and never trailing-slash (except "/"). */
  path: string;
  /** Route-specific `<title>`. */
  title: string;
  /** Route-specific `<meta name="description">`. */
  description: string;
  /**
   * `<priority>` in sitemap.xml. Relative weight only — search engines treat
   * it as a hint, so these are deliberately coarse.
   */
  priority: number;
  /** Whether the route belongs in sitemap.xml. Legacy routes do not. */
  indexable: boolean;
}

export const SITE_ROUTES: SiteRoute[] = [
  {
    path: "/",
    title:
      "Jonathan Lyn-Shue — Fractional CIO/CTO | Data & AI Strategy for Growth-Stage Companies",
    description:
      "Fractional CIO/CTO for growth-stage companies ($10M-$100M). Enterprise data strategy, AI infrastructure, and technology leadership — at a fraction of the full-time cost. Miami-based, remote-flexible.",
    priority: 1.0,
    indexable: true,
  },
  {
    path: "/work",
    title: "Work — Engagements & Outcomes | Jonathan Lyn-Shue",
    description:
      "Selected engagements and measurable outcomes: enterprise data platform strategy across 16 automotive brands, a B2B commerce platform scaled from $100M to $1.4B+, and edge-AI infrastructure for physical operations.",
    priority: 0.9,
    indexable: true,
  },
  {
    path: "/about",
    title: "About — 15+ Years in Enterprise Data & AI | Jonathan Lyn-Shue",
    description:
      "Data & AI executive and co-founder. Fifteen years spanning Fortune 500 global programs — Stellantis, Southern Glazer's, Razorfish/Publicis — through to founding an NVIDIA Inception edge-AI startup.",
    priority: 0.8,
    indexable: true,
  },
  {
    path: "/writing",
    title: "Writing — Notes on Data Strategy & AI | Jonathan Lyn-Shue",
    description:
      "Essays on data strategy, AI infrastructure, and the operating reality of technology leadership — written from inside the engagements rather than about them.",
    priority: 0.7,
    indexable: true,
  },
  {
    path: "/lab",
    title: "Lab — Open-Source Tools & Experiments | Jonathan Lyn-Shue",
    description:
      "Working software, not slideware: open-source tooling for privacy-preserving AI agents, multi-model orchestration, and local-first developer workflows.",
    priority: 0.6,
    indexable: true,
  },
  {
    path: "/chat",
    title: "Chat — Start a Conversation | Jonathan Lyn-Shue",
    description:
      "Considering fractional technology leadership? Start here to scope the problem before booking time — a short conversation about where your data and AI stack actually hurts.",
    priority: 0.6,
    indexable: true,
  },
];

/**
 * Routes reachable in the SPA but deliberately excluded from the sitemap.
 *
 * They still resolve with a 200 — they are real routes, not soft 404s — and
 * they are still prerendered, so a crawler that follows a campaign link gets
 * real text. They are simply not promoted in the sitemap: `/v1` is a
 * superseded homepage that would compete with `/` for the same query, and
 * `/sprint` and `/diagnostic` are offer-specific landing pages reached from
 * campaigns rather than from search.
 *
 * Titles below are the pages' own on-screen headings, not new copy.
 */
export const LEGACY_ROUTES: SiteRoute[] = [
  {
    path: "/v1",
    title: "Jonathan Lyn-Shue — Fractional CIO/CTO",
    description:
      "Previous edition of the homepage, kept for inbound links. Fractional CIO/CTO for growth-stage companies: enterprise data strategy, AI infrastructure, and technology leadership.",
    priority: 0.1,
    indexable: false,
  },
  {
    path: "/sprint",
    title: "The Executive Sprint | Jonathan Lyn-Shue",
    description:
      "A time-boxed diagnostic engagement for growth-stage leadership teams — scope the data and AI bottleneck, leave with a costed plan.",
    priority: 0.1,
    indexable: false,
  },
  {
    path: "/diagnostic",
    title: "Workflow Diagnostic | Jonathan Lyn-Shue",
    description:
      "A structured teardown of executive reporting and coordination workflows across your existing tool stack.",
    priority: 0.1,
    indexable: false,
  },
];

/** Every route the app prerenders — indexable and legacy alike. */
export const ALL_ROUTES: SiteRoute[] = [...SITE_ROUTES, ...LEGACY_ROUTES];

/** Every path the SPA answers with a 200. Anything else is a genuine 404. */
export function allKnownPaths(): string[] {
  return ALL_ROUTES.map((route) => route.path);
}

/** Absolute canonical URL for a route path. */
export function canonicalUrl(path: string): string {
  return path === "/" ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${path}`;
}
