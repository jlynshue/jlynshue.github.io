import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";
import {
  PRICE_CEILING_USD,
  PRICE_FLOOR_USD,
  TEMPLATE_COPY,
  TOOLKIT_PRODUCTS,
  getToolkitProduct,
  heroPlacement,
  ladderPlacement,
  renderedPriceLine,
  sampleLabel,
  sampleTrap,
  type ToolkitProduct,
} from "./products";

/**
 * Claim patterns copied verbatim from content-factory `config.yaml:138-143`.
 *
 * They are duplicated here on purpose: the gate lives in the content-factory repo
 * while the shipped copy lives here, so nothing otherwise connects the two. If the
 * upstream list changes, change it here too.
 */
const BANNED_CLAIM_PATTERNS: RegExp[] = [
  /\b(guarantee[ds]?|guaranteed)\b/i,
  /\$\s?[\d,]+\s*(k)?\s*(in|within|per)\s*\d+\s*(day|week|month)/i,
  /\b(get rich|passive income on autopilot|risk[- ]free)\b/i,
  /\b\d+\s*%\s*(roi|return|increase)\b/i,
  /\b(cure|proven to (double|triple|10x))\b/i,
];

/**
 * While a product is a stub there is no checkout on the site and the artifact is
 * not written, so the page must not imply either. This exists because the first
 * draft of the hero read "Get the field guide - instant download", which promised
 * a deliverable that cannot be produced.
 */
const UNSHIPPABLE_STUB_CLAIMS: RegExp[] = [
  /instant download/i,
  /\bdownload now\b/i,
  /\bbuy now\b/i,
  /\badd to cart\b/i,
  // Commerce intent, NOT the bare word "checkout". This product's own subject
  // matter includes the trap "The primary checkout went stale" — a git checkout.
  // A bare /\bcheckout\b/ flagged it, the same way the upstream banned-claim
  // pattern /\bguarantee[ds]?\b/ flags the trap "A guard guarantees only what it
  // gates". An engineering guide shares vocabulary with a storefront, so these
  // rules have to match the phrase a storefront would use, not the noun.
  /\b(proceed to|complete|secure) checkout\b/i,
  /\brefund\b/i,
];

/** Recursively collects every string leaf, so no copy field can escape the scan. */
function collectStrings(value: unknown, into: string[] = []): string[] {
  if (typeof value === "string") {
    into.push(value);
  } else if (Array.isArray(value)) {
    value.forEach((entry) => collectStrings(entry, into));
  } else if (value && typeof value === "object") {
    Object.values(value).forEach((entry) => collectStrings(entry, into));
  }
  return into;
}

function copyOf(product: ToolkitProduct): string {
  // Both derived strings are appended because collectStrings only walks string
  // leaves of the registry. priceUsd is a number, so "$149" appeared nowhere in
  // the scanned text despite being the largest thing in the hero; and the sample
  // label is now computed by sampleLabel rather than stored, so it left the
  // registry when it stopped being hand-written. Anything the page renders but
  // does not store has to be added here explicitly.
  return [
    ...collectStrings(product),
    renderedPriceLine(product),
    sampleLabel(product),
  ].join("\n");
}

/**
 * ToolkitStub.tsx with comments removed.
 *
 * Read as text rather than imported, following the precedent in
 * `site-routes.spec.ts` — importing the component pulls in the provider stack.
 * Comments have to go first because the comments in these files legitimately
 * quote the banned wording in order to explain the rules, and a raw scan would
 * flag the explanation instead of a violation.
 */
function templateSourceWithoutComments(): string {
  const source = fs.readFileSync(
    path.resolve(__dirname, "ToolkitStub.tsx"),
    "utf8",
  );
  return source
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/(^|[^:])\/\/.*$/gm, "$1");
}

const products = Object.entries(TOOLKIT_PRODUCTS);

describe("toolkit product registry", () => {
  it("has at least one product", () => {
    expect(products.length).toBeGreaterThan(0);
  });

  it("keys the registry by each product's own slug", () => {
    for (const [key, product] of products) {
      expect(product.slug).toBe(key);
    }
  });

  it("uses URL-safe slugs", () => {
    for (const [, product] of products) {
      expect(product.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });

  it("prices every product inside the positioning band", () => {
    for (const [, product] of products) {
      expect(product.priceUsd).toBeGreaterThanOrEqual(PRICE_FLOOR_USD);
      expect(product.priceUsd).toBeLessThanOrEqual(PRICE_CEILING_USD);
    }
  });

  it("carries enough copy to be a landing page", () => {
    for (const [, product] of products) {
      expect(product.headline.length).toBeGreaterThan(0);
      expect(product.subhead.length).toBeGreaterThan(0);
      expect(product.problem.paragraphs.length).toBeGreaterThan(0);
      expect(product.included.items.length).toBeGreaterThan(0);
      // content-factory#28 asks for three or more.
      expect(product.faq.length).toBeGreaterThanOrEqual(3);
    }
  });
});

describe("sample trap numbering", () => {
  it("points every sample at a trap that exists", () => {
    for (const [slug, product] of products) {
      const trap = sampleTrap(product);
      expect(trap, `${slug} sample does not resolve to a trap`).toBeDefined();
      expect(trap?.text.length).toBeGreaterThan(0);
    }
  });

  it("numbers the sample from its position across all families", () => {
    // The specific pin for the shipped product. The label previously read
    // "trap 03" while the sample was Family 01's FIRST item — a number written
    // by hand that disagreed with the list on the same page.
    const product = TOOLKIT_PRODUCTS["agent-ops-field-guide"];
    const trap = sampleTrap(product);

    expect(trap?.position).toBe(1);
    expect(trap?.text).toBe("Tests pass, feature unreachable");
    expect(sampleLabel(product)).toBe("Sample — trap 01");
  });

  it("counts preceding families when the sample is not in the first", () => {
    // Proves the flat numbering is actually computed rather than echoing
    // trapItem. Families here are 5 long, so family 3 item 2 must be trap 12.
    const product = TOOLKIT_PRODUCTS["agent-ops-field-guide"];
    const thirdFamily: ToolkitProduct = {
      ...product,
      sample: { ...product.sample, trapFamily: 3, trapItem: 2 },
    };

    expect(sampleTrap(thirdFamily)?.position).toBe(12);
    expect(sampleTrap(thirdFamily)?.text).toBe("A cross-review is a snapshot");
    expect(sampleLabel(thirdFamily)).toBe("Sample — trap 12");
  });

  it("declines to number a reference that does not resolve", () => {
    // The discriminating case: an out-of-range reference must degrade to saying
    // less, never to asserting a wrong number. The first test above is what
    // fails if a real product ever lands in this state.
    const product = TOOLKIT_PRODUCTS["agent-ops-field-guide"];
    for (const bad of [
      { trapFamily: 9, trapItem: 1 },
      { trapFamily: 1, trapItem: 99 },
      { trapFamily: 0, trapItem: 1 },
    ]) {
      const broken: ToolkitProduct = {
        ...product,
        sample: { ...product.sample, ...bad },
      };
      expect(sampleTrap(broken), JSON.stringify(bad)).toBeUndefined();
      expect(sampleLabel(broken)).toBe("Sample");
    }
  });
});

describe("analytics placements", () => {
  it("identifies the product in both placements", () => {
    // The hero placement was the constant "toolkit-hero". handleCTAClick sends
    // only (ctaName, placement) to GA4, so the waitlist click — the event S1
    // measures demand on — carried no product identity, and two products would
    // have been indistinguishable in the data S3 calibrates against.
    for (const [slug, product] of products) {
      expect(heroPlacement(product)).toContain(slug);
      expect(ladderPlacement(product)).toContain(slug);
    }
  });

  it("distinguishes the two slots on the same page", () => {
    for (const [, product] of products) {
      expect(heroPlacement(product)).not.toBe(ladderPlacement(product));
    }
  });

  it("keeps placements URL-safe and slot-suffixed", () => {
    // These land in a query string and then in a GA4 dimension, so a stray
    // space or slash would be silently encoded and bucket as a different value.
    for (const [, product] of products) {
      for (const placement of [
        heroPlacement(product),
        ladderPlacement(product),
      ]) {
        expect(placement).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      }
      expect(heroPlacement(product).endsWith("-hero")).toBe(true);
      expect(ladderPlacement(product).endsWith("-footer")).toBe(true);
    }
  });
});

describe("toolkit copy compliance", () => {
  // A pass is uninterpretable until the same check has been seen to fail, so the
  // scanners are proved to discriminate before they are trusted on real copy.
  it("detects a banned claim when one is present", () => {
    const knownBad = [
      "Results guaranteed or your money back.",
      "Make $5,000 in 30 days with this toolkit.",
      "Completely risk-free.",
      "Customers see a 40% increase in throughput.",
      "Proven to double your delivery speed.",
    ];
    for (const sample of knownBad) {
      expect(BANNED_CLAIM_PATTERNS.some((p) => p.test(sample))).toBe(true);
    }
  });

  it("detects unshippable stub language when it is present", () => {
    const knownBad = [
      "Get the field guide - instant download",
      "Buy now and download now",
      "Add to cart",
      "Proceed to checkout",
      "Email me and I will refund it",
    ];
    for (const sample of knownBad) {
      expect(
        UNSHIPPABLE_STUB_CLAIMS.some((p) => p.test(sample)),
        `expected to flag: ${sample}`,
      ).toBe(true);
    }
  });

  it("does not flag engineering vocabulary that merely resembles commerce", () => {
    // Each sample is checked against BOTH lists, because the two false positives
    // came from different lists: "checkout" from the stub rules, "guarantees"
    // from the upstream banned claims. The first version of this test checked
    // both samples against UNSHIPPABLE_STUB_CLAIMS only — which contains no
    // guarantee pattern — so the assertion pinning the guarantee rewording was
    // vacuous and would have passed no matter what that pattern did.
    const legitimate = [
      "The primary checkout went stale",
      "A guard only covers what it gates",
    ];
    for (const sample of legitimate) {
      for (const pattern of [
        ...BANNED_CLAIM_PATTERNS,
        ...UNSHIPPABLE_STUB_CLAIMS,
      ]) {
        expect(
          pattern.test(sample),
          `false positive on "${sample}" from ${pattern}`,
        ).toBe(false);
      }
    }
  });

  it("still flags the wording those carve-outs were made around", () => {
    // The negative control for the test above. Both carve-outs were supposed to
    // be made by rewording the copy, not by weakening the pattern. If someone
    // "fixes" a future false positive by gutting the regex instead, the test
    // above keeps passing and only this one notices.
    expect(
      BANNED_CLAIM_PATTERNS.some((p) =>
        p.test("A guard guarantees only what it gates"),
      ),
      "the guarantee pattern no longer fires on the original wording",
    ).toBe(true);
    expect(
      UNSHIPPABLE_STUB_CLAIMS.some((p) => p.test("Proceed to checkout")),
      "the checkout pattern no longer fires on commerce phrasing",
    ).toBe(true);
  });

  it("ships no banned claims", () => {
    for (const [slug, product] of products) {
      const copy = copyOf(product);
      for (const pattern of BANNED_CLAIM_PATTERNS) {
        expect(pattern.test(copy), `${slug} copy matches ${pattern}`).toBe(
          false,
        );
      }
    }
  });

  it("promises nothing a stub cannot deliver", () => {
    for (const [slug, product] of products) {
      const copy = copyOf(product);
      for (const pattern of UNSHIPPABLE_STUB_CLAIMS) {
        expect(pattern.test(copy), `${slug} copy matches ${pattern}`).toBe(
          false,
        );
      }
    }
  });

  it("holds the template's own copy to the same rules", () => {
    // TEMPLATE_COPY is not part of any product, so the per-product scans above
    // never touch it — and the hero button lives here.
    const copy = Object.values(TEMPLATE_COPY).join("\n");
    for (const pattern of [
      ...BANNED_CLAIM_PATTERNS,
      ...UNSHIPPABLE_STUB_CLAIMS,
    ]) {
      expect(pattern.test(copy), `template copy matches ${pattern}`).toBe(
        false,
      );
    }
  });

  it("leaves no user-facing copy hardcoded in the template", () => {
    // Backstop for the two scans above, which can only check strings that were
    // put where they could be found. This one reads the JSX itself, so a string
    // typed straight into the markup is still covered.
    const source = templateSourceWithoutComments();
    for (const pattern of [
      ...BANNED_CLAIM_PATTERNS,
      ...UNSHIPPABLE_STUB_CLAIMS,
    ]) {
      expect(pattern.test(source), `ToolkitStub.tsx matches ${pattern}`).toBe(
        false,
      );
    }
  });

  it("strips comments before scanning, but keeps the code", () => {
    // Proves the previous test can still see a violation. Comment-stripping is
    // load-bearing there — these files quote the banned wording to explain the
    // rules — and a stripper that ate the whole file would make that scan pass
    // unconditionally.
    const source = templateSourceWithoutComments();

    expect(source).toContain("TEMPLATE_COPY.heroCta");
    expect(source).toContain("getToolkitProduct");
    // The explanatory comments quote both of these; the stripped source must not.
    expect(source).not.toContain("instant download");
    expect(source).not.toContain("dark text on white");
  });
});

describe("getToolkitProduct", () => {
  it("resolves a known slug", () => {
    expect(getToolkitProduct("agent-ops-field-guide")?.slug).toBe(
      "agent-ops-field-guide",
    );
  });

  it("returns undefined for an unknown slug", () => {
    expect(getToolkitProduct("not-a-product")).toBeUndefined();
  });

  it("returns undefined when the route param is missing", () => {
    expect(getToolkitProduct(undefined)).toBeUndefined();
  });

  it("returns undefined for object-prototype members", () => {
    // The slug is attacker-controlled in the sense that it is whatever is in the
    // URL. A bare TOOLKIT_PRODUCTS[slug] reads the prototype chain, so each of
    // these returned a truthy non-product, passed the caller's `!product` guard,
    // and rendered the product page with every field undefined — a blank page at
    // HTTP 200 rather than the 404. There is no ErrorBoundary above this route.
    for (const slug of [
      "constructor",
      "toString",
      "valueOf",
      "hasOwnProperty",
      "__proto__",
      "propertyIsEnumerable",
    ]) {
      expect(
        getToolkitProduct(slug),
        `${slug} resolved to something`,
      ).toBeUndefined();
    }
  });

  it("resolves only the slugs the registry declares", () => {
    // The positive half of the check above: proving prototype keys are rejected
    // is only reassuring if a real key is still accepted.
    for (const [slug] of products) {
      expect(getToolkitProduct(slug)?.slug).toBe(slug);
    }
  });
});
