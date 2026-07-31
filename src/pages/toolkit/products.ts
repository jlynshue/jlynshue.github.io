/**
 * Toolkit product registry.
 *
 * `/toolkit/<slug>` renders from this data via a single stub template, rather than
 * one hand-built page per product. Arc 1 of the product-launch loop produces stubs,
 * and a later arc generates them — so the page has to be a template from the start.
 *
 * Copy here is the copy of record for content-factory#28. It is a **stub**: this
 * milestone measures demand, so the primary action is a waitlist join, NOT a
 * purchase. There is no checkout on the site (commerce is a separate milestone) and
 * the artifacts are not written yet. Do not add download or buy language until both
 * of those are true.
 *
 * Price band is a positioning control, not a revenue one: floor $99, ceiling $499.
 * Below the floor, ship as a free lead magnet instead of a paid product.
 */

export const PRICE_FLOOR_USD = 99;
export const PRICE_CEILING_USD = 499;

export interface ToolkitFaqEntry {
  question: string;
  answer: string;
}

/** A themed grouping of what the artifact covers. */
export interface ToolkitFamily {
  label: string;
  title: string;
  items: string[];
}

export interface ToolkitProduct {
  slug: string;
  /** Short name for internal reference and analytics placements. */
  name: string;
  headline: string;
  subhead: string;
  priceUsd: number;
  /** Renders beside the price. Must stay forward-looking while this is a stub. */
  priceNote: string;
  /** One-line reinforcement under the price, in gold. */
  priceKicker: string;
  problem: {
    heading: string;
    paragraphs: string[];
  };
  families: {
    heading: string;
    groups: ToolkitFamily[];
  };
  included: {
    heading: string;
    items: string[];
  };
  sample: {
    label: string;
    title: string;
    body: string;
  };
  faq: ToolkitFaqEntry[];
  closing: {
    heading: string;
    body: string;
  };
}

const agentOpsFieldGuide: ToolkitProduct = {
  slug: "agent-ops-field-guide",
  name: "Agent Ops Field Guide",
  headline: "Your agent said it shipped. It didn’t.",
  subhead:
    "Fifteen ways an AI coding agent looks successful while being wrong — and the check that catches each one.",
  priceUsd: 149,
  priceNote: "when it ships · ~48 pages",
  priceKicker:
    "Every trap dated, first-person, and measured on production work.",

  problem: {
    heading: "The problem this solves",
    paragraphs: [
      "Your test suite is green. The PR is merged. The issue is closed. And the feature is not there — because the mechanism was unit-tested directly and reachable from no production route. Nothing in your pipeline is built to notice that.",
      "Every trap in this guide was found the expensive way: on a real repository, mid-loop, after the dashboard already said the work was done. Each one comes with the specific check that would have caught it, and what that check costs to run.",
    ],
  },

  families: {
    heading: "Three families of failure",
    groups: [
      {
        label: "Family 01",
        title: "The green signal",
        items: [
          "Tests pass, feature unreachable",
          "Two guards in series — red proves only the first",
          "A verifier that cannot fail",
          "CI’s environment is not the developer’s",
          "Row count is not coverage",
        ],
      },
      {
        label: "Family 02",
        title: "The absent integration",
        items: [
          "A best-effort fan-out still returns 200",
          "Config asserts infrastructure into existence",
          "A guard only covers what it gates",
          "Idempotent is not monotonic",
          "The build ships the working tree, not the commit",
        ],
      },
      {
        label: "Family 03",
        title: "The stale record",
        items: [
          "The how-to page still teaches the bug",
          "A cross-review is a snapshot",
          "The primary checkout went stale",
          "Verify what the human reads",
          "Splitting a quote at the defect hides it",
        ],
      },
    ],
  },

  included: {
    heading: "What you get",
    items: [
      "15 traps, each with the symptom, the mechanism, and the check",
      "The one-minute reachability trace, written as a runnable procedure",
      "A pre-merge checklist for agent-authored PRs",
      "The prompt language that made agents self-report reachability",
      "Worked examples from 15 merged PRs and 15 closed issues",
    ],
  },

  sample: {
    label: "Sample — trap 03",
    title: "Green tests do not mean the feature is reachable.",
    body: "Three of four PRs in one batch shipped a mechanism that was unit-tested directly and reachable from no production route. The helper was byte-for-byte correct. Every test called it directly, so the suite could not see the gap. One grep for the symbol across the source tree returned only its own definition.",
  },

  faq: [
    {
      question: "Is this tied to a specific agent or tool?",
      answer:
        "No. The traps are properties of how agents are supervised, not of one vendor. Examples come from Claude Code and Codex runs; the checks apply to any agent that opens PRs.",
    },
    {
      question: "I already have code review and CI. Isn’t that this?",
      answer:
        "Those catch code that is wrong. Most of these traps produce code that is right and unreachable, or a check that passes because it asserts the wrong thing. Review and CI are structurally blind to that class.",
    },
    {
      question: "How long is it, honestly?",
      answer:
        "Around 48 pages. Each trap runs two to four pages: symptom, mechanism, the check, and a worked example with dates.",
    },
    {
      question: "It isn’t written yet — what am I joining?",
      answer:
        "A list that gets told once, when it ships, at the price above. No drip sequence, no launch runway. If it never ships you never hear from me about it again.",
    },
  ],

  closing: {
    heading: "Running agents on work that matters?",
    body: "If any of this names a problem you’re living in, the next step is a conversation, not a PDF.",
  },
};

export const TOOLKIT_PRODUCTS: Record<string, ToolkitProduct> = {
  [agentOpsFieldGuide.slug]: agentOpsFieldGuide,
};

/**
 * Copy the stub template supplies itself, with no product behind it.
 *
 * It lives here, in the data module, for two reasons. The copy-compliance scan
 * walks this module, and a registry walk can never see a string that sits in
 * JSX — so while the hero button was a literal in ToolkitStub.tsx it was the
 * one piece of copy on the page that no rule applied to. That button is also
 * the exact string whose first draft read "Get the field guide, instant
 * download", which is why the stub-claim rule exists at all: the rule was
 * gating everything except the sentence that caused it to be written.
 *
 * Second, the spec cannot import ToolkitStub.tsx to reach these — that pulls in
 * Header, Footer and NotFound, and through them the whole provider stack.
 * `site-routes.spec.ts` avoids the same weight by reading App.tsx as text.
 */
export const TEMPLATE_COPY = {
  heroCta: "Join the waitlist",
  faqHeading: "Questions",
  ladderCta: "Schedule a Discovery Call",
} as const;

/**
 * The price numeral as the page prints it, currency symbol attached.
 *
 * The template calls this rather than interpolating `product.priceUsd` itself,
 * so the characters a reader sees exist as a string somewhere a scanner can
 * find them.
 *
 * @param {ToolkitProduct} product - The product being rendered.
 * @returns {string} e.g. "$149".
 */
export function priceAmount(product: ToolkitProduct): string {
  return `$${product.priceUsd}`;
}

/**
 * The full price line as rendered: numeral immediately followed by the note.
 *
 * This exists for the copy scan. `priceUsd` is a number, the scan walks string
 * leaves only, and the money-claim pattern needs a "$149"-shaped token next to
 * a time window — so with the numeral invisible that pattern could not match
 * anything the page actually shows, and was dead code asserting nothing.
 *
 * The template renders the two parts in separate styled spans; this joins them
 * in reading order. That is a reconstruction, so it is only as good as the two
 * staying adjacent — worth re-checking if the hero price block is restyled.
 *
 * @param {ToolkitProduct} product - The product being rendered.
 * @returns {string} e.g. "$149 when it ships · ~48 pages".
 */
export function renderedPriceLine(product: ToolkitProduct): string {
  return `${priceAmount(product)} ${product.priceNote}`;
}

/**
 * Resolves a URL slug to a product.
 *
 * The own-property check is load-bearing, not defensive style. `slug` comes
 * straight from the URL, and a bare `TOOLKIT_PRODUCTS[slug]` also reads the
 * object prototype — so `/toolkit/constructor`, `/toolkit/toString`,
 * `/toolkit/valueOf`, `/toolkit/__proto__` and `/toolkit/hasOwnProperty` all
 * returned a truthy non-product. That passed the caller's `!product` guard and
 * rendered a product page from `undefined` fields instead of the 404.
 *
 * Spelled `Object.prototype.hasOwnProperty.call` rather than `Object.hasOwn`
 * because this project compiles against `lib: ES2020` and `Object.hasOwn` is
 * ES2022. Vitest strips types without checking them, so the tests here pass
 * either way and only `npm run typecheck` catches the difference.
 *
 * @param {string | undefined} slug - The `:slug` route param.
 * @returns {ToolkitProduct | undefined} The product, or undefined for an unknown slug.
 */
export function getToolkitProduct(
  slug: string | undefined,
): ToolkitProduct | undefined {
  if (!slug || !Object.prototype.hasOwnProperty.call(TOOLKIT_PRODUCTS, slug)) {
    return undefined;
  }
  return TOOLKIT_PRODUCTS[slug];
}
