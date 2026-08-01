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
  /**
   * Singular noun for ONE entry in `families.groups[].items`, as the sample
   * eyebrow prints it — "trap", "step", "check".
   *
   * This exists because `sampleLabel()` used to hardcode the word "trap". That
   * was true of product #1, a guide to fifteen traps, so it read as generic
   * when it was written. It is not generic: an audit workbook shipped against
   * the old code rendered "Sample — trap 06" over a step in a workflow audit,
   * and `npm test` stayed green because every assertion about the label was
   * about product #1 and every one of them was still correct.
   *
   * Same family as the misnumbered "trap 03" that made `sampleLabel()` derived
   * in the first place, one level up: that fix derived the NUMBER from the list
   * and left the NOUN written by hand. A word that has to agree with the
   * product should belong to the product.
   */
  itemNoun: string;
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
    /**
     * Which item the sample illustrates — 1-based family, then 1-based item
     * within that family.
     *
     * The displayed label is computed from these by `sampleLabel()` rather than
     * written by hand. The hand-written version read "Sample — trap 03" while
     * the sample was Family 01's *first* item, so the one worked example on a
     * page about verification was misnumbered against its own list. A number
     * that has to agree with a list should be derived from the list.
     *
     * Named `family`/`item`, not `trapFamily`/`trapItem`. These are positions in
     * a list; naming them after product #1's subject matter is what made the
     * hardcoded noun feel correct.
     */
    family: number;
    item: number;
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
  itemNoun: "trap",

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
    // Family 01, item 1 — "Tests pass, feature unreachable". Renders as trap 01.
    family: 1,
    item: 1,
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

/**
 * Toolkit #2 — the runner-up from the candidate analysis, held back deliberately.
 *
 * The 2026-07-29 decision record reads "B is not discarded — it is product #2, and
 * it remains the better ladder rung". Copy of record:
 * `10.00-Projects/10.11-jonathanlynshue.com/2026-07-31-Workflow-Bottleneck-Audit-PRD-and-Launch-Plan.md` §4.
 *
 * THE CANNIBALISATION LINE, and why it is drawn where it is. `/diagnostic` is a
 * live $2,500 offer whose page lists six deliverables (`Diagnostic.tsx:37-44`).
 * A naive version of this product would ship all six for $199 and undercut it by
 * ~92% using the diagnostic's own deliverable list. So: **this ships the
 * diagnosis, the diagnostic keeps the prescription.** Target workflow design and
 * the scoped implementation recommendation are withheld on purpose, and the first
 * FAQ says so in the buyer's own terms rather than hiding it.
 *
 * The buyer overlaps the fractional-engagement buyer exactly, by construction —
 * that is the point of a ladder rung, and it is also the risk: this is the one
 * product on the board that can lose money by succeeding.
 */
const workflowBottleneckAudit: ToolkitProduct = {
  slug: "workflow-bottleneck-audit",
  name: "Workflow Bottleneck Audit",
  headline: "You know the workflow is broken. You cannot name where.",
  subhead:
    "The instrument behind a paid workflow diagnostic — the interview script, the maps, and the waste math — so you can run the diagnosis yourself and finish with a named constraint.",
  priceUsd: 199,
  priceNote: "when it ships · workbook + 4 worksheets",
  priceKicker: "The same instrument I bill $2,500 to run. Minus me.",
  // NOT "trap". This is the field board #42 exists for: product #1's noun over a
  // workflow step reads as a different product's page.
  itemNoun: "step",

  problem: {
    heading: "The problem this solves",
    paragraphs: [
      "Everyone in the room agrees the process is a mess. Ask where exactly and you get five different answers, all of them true and none of them fundable. You cannot pay to fix a problem nobody can locate.",
      "This is the diagnostic half of a paid engagement, written down as something you can run yourself: who to interview and in what order, how to draw the current state so the handoffs are visible, and how to price idle time so the waste stops being a feeling and becomes a number on a page.",
    ],
  },

  families: {
    heading: "Three passes over one workflow",
    groups: [
      {
        label: "Pass 01",
        title: "Map what actually happens",
        items: [
          "Pick one workflow narrow enough to finish",
          "Interview script for the people who run it",
          "Draw the current state, including rework loops",
          "Inventory every system the work touches",
          "Mark each handoff and who owns it",
        ],
      },
      {
        label: "Pass 02",
        title: "Price the waste",
        items: [
          "Log touch time against wait time",
          "Count the rework and where it re-enters",
          "Cost the idle hours at loaded rates",
          "Find the work done twice in two systems",
          "Separate the waste you own from the waste you inherit",
        ],
      },
      {
        label: "Pass 03",
        title: "Name the constraint",
        items: [
          "Rank bottlenecks by cost, not by annoyance",
          "Test each candidate against the queue in front of it",
          "Trust and risk review — what breaks if this is automated",
          "State the one constraint in a single sentence",
          "Write the brief a fixer would need",
        ],
      },
    ],
  },

  included: {
    heading: "What you get",
    items: [
      "A 4-worksheet workbook you fill in as you go",
      "The interview script, with the follow-up questions that matter",
      "The waste math, worked on a real example end to end",
      "A one-page constraint brief you can hand to a team or a vendor",
      "The stop rule — how to know the audit is finished",
    ],
  },

  sample: {
    // Pass 02, item 1 — "Log touch time against wait time". Five items in Pass 01
    // precede it, so this renders as step 06. Under the old hardcoded noun this
    // was the exact string that would have read "Sample — trap 06".
    family: 2,
    item: 1,
    title: "Wait time is the number, not touch time.",
    body: "A three-day approval that consumes eleven minutes of anyone’s attention is not a three-day staffing problem. Log both columns separately from the first interview and the Pass 03 ranking usually rearranges itself — the step everybody complains about is rarely the one holding the queue.",
  },

  faq: [
    {
      question: "How is this different from the $2,500 diagnostic?",
      answer:
        "Two things. This is the diagnosis; the diagnostic is the diagnosis plus the prescription — you do not finish this with a target workflow design, a scoped implementation plan, or my judgment on what to do about it. And you run this yourself: the workbook is the method, so the map and the numbers are ones you produce, not ones I hand you. If you run it and get stuck at the prescription, you are exactly who the diagnostic is for.",
    },
    {
      question: "It isn’t written yet — what am I joining?",
      answer:
        "A list that gets told once, when it ships, at the price above. No drip sequence, no launch runway. If it never ships you never hear from me about it again.",
    },
    {
      question: "Will this work on a workflow that crosses three departments?",
      answer:
        "It is built for that case; the handoff map is the point, and single-team workflows rarely need an instrument. What it will not survive is being pointed at your whole company at once. One workflow, start to finish.",
    },
    {
      question: "Do I need any tooling to run it?",
      answer:
        "Paper works. The worksheets are a workbook because spreadsheets are convenient for the waste math, not because the method needs software. Nothing to install, nothing to connect.",
    },
  ],

  closing: {
    heading: "Bottleneck already named and still stuck?",
    body: "If you know where the constraint is and the problem is what to do about it, that is a conversation, not a workbook.",
  },
};

export const TOOLKIT_PRODUCTS: Record<string, ToolkitProduct> = {
  [agentOpsFieldGuide.slug]: agentOpsFieldGuide,
  [workflowBottleneckAudit.slug]: workflowBottleneckAudit,
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
 * Analytics placement for the hero waitlist CTA.
 *
 * This was the constant "toolkit-hero". It is the CTA S1 measures demand on,
 * and `handleCTAClick` sends only (ctaName, placement) to GA4 — the slug
 * reaches the server event through the `asset` query param but never the client
 * event. With one product the number was fine; with two, every waitlist click
 * would have been indistinguishable in GA4, which is the data S3 calibrates a
 * threshold against.
 *
 * Lives here rather than in the template so it can be asserted without
 * importing ToolkitStub, which would pull in the whole provider stack.
 *
 * @param {ToolkitProduct} product - The product being rendered.
 * @returns {string} e.g. "toolkit-agent-ops-field-guide-hero".
 */
export function heroPlacement(product: ToolkitProduct): string {
  return `toolkit-${product.slug}-hero`;
}

/**
 * Analytics placement for the closing discovery-call CTA.
 *
 * Slot suffixes on both placements follow the existing `<page>-<slot>` shape
 * (`sprint-page`, `diagnostic-page`). Those pages carry a single CTA each, so
 * this template is the first that has to tell two apart.
 *
 * @param {ToolkitProduct} product - The product being rendered.
 * @returns {string} e.g. "toolkit-agent-ops-field-guide-footer".
 */
export function ladderPlacement(product: ToolkitProduct): string {
  return `toolkit-${product.slug}-footer`;
}

/**
 * The item the sample illustrates, resolved out of the families list.
 *
 * Renamed from `sampleTrap`. "Trap" is product #1's subject, not this
 * function's job — carrying it in the name is what made the hardcoded noun in
 * `sampleLabel` look correct for as long as it did.
 *
 * @param {ToolkitProduct} product - The product being rendered.
 * @returns {{ position: number; text: string } | undefined} Flat 1-based
 *   position across all families and the item's own text, or undefined if the
 *   sample's indices do not point at a real item.
 */
export function sampleItem(
  product: ToolkitProduct,
): { position: number; text: string } | undefined {
  const { family: familyIndex, item: itemIndex } = product.sample;
  const groups = product.families.groups;
  const family = groups[familyIndex - 1];
  const text = family?.items[itemIndex - 1];
  if (!family || text === undefined) {
    return undefined;
  }
  const preceding = groups
    .slice(0, familyIndex - 1)
    .reduce((total, group) => total + group.items.length, 0);
  return { position: preceding + itemIndex, text };
}

/**
 * The sample card's eyebrow label — noun from the product, number from the list.
 *
 * BOTH halves are now derived. The number was already computed (a hand-written
 * "trap 03" once sat over Family 01's first item). The noun was not: it was the
 * literal string "trap", which is correct for a guide to fifteen traps and
 * wrong for everything else. An audit workbook rendered "Sample — trap 06" over
 * a workflow step while every test stayed green, because the only assertions
 * about this label were about product #1 and both were still true.
 *
 * Falls back to an unnumbered "Sample" when the indices do not resolve, so a
 * bad reference degrades to saying less rather than to asserting a wrong
 * number. `products.spec.ts` fails on that case rather than shipping it.
 *
 * @param {ToolkitProduct} product - The product being rendered.
 * @returns {string} e.g. "Sample — trap 01", or "Sample — step 06".
 */
export function sampleLabel(product: ToolkitProduct): string {
  const sample = sampleItem(product);
  if (!sample) {
    return "Sample";
  }
  return `Sample — ${product.itemNoun} ${String(sample.position).padStart(2, "0")}`;
}

/**
 * Tailwind column classes for the families grid, sized to the group count.
 *
 * Was a hardcoded `md:grid-cols-3`, which silently constrained the registry:
 * any product with two or four families laid out wrong, and the copy of record
 * for product #2 had to carry a note telling its author to write exactly three
 * groups so the template would not wrap one card onto a lonely second row. A
 * data-driven template should not impose a shape on the data.
 *
 * Capped at three columns because the cards carry five-item lists and a fourth
 * column makes them unreadable on a 13-inch screen; a fourth group wraps to a
 * balanced 2x2 rather than 3+1.
 *
 * @param {ToolkitProduct} product - The product being rendered.
 * @returns {string} Tailwind classes for the grid container.
 */
export function familiesGridClass(product: ToolkitProduct): string {
  const count = product.families.groups.length;
  if (count <= 1) {
    return "grid grid-cols-1 gap-8";
  }
  if (count === 2) {
    return "grid grid-cols-1 md:grid-cols-2 gap-8";
  }
  if (count === 4) {
    return "grid grid-cols-1 md:grid-cols-2 gap-8";
  }
  return "grid grid-cols-1 md:grid-cols-3 gap-8";
}

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
