import { describe, expect, it } from "vitest";
import {
  PRICE_CEILING_USD,
  PRICE_FLOOR_USD,
  TOOLKIT_PRODUCTS,
  getToolkitProduct,
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
  return collectStrings(product).join("\n");
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
    // Guards the narrowing above. If someone re-broadens the checkout rule to the
    // bare noun, this fails and explains why before the copy scan does.
    const legitimate = [
      "The primary checkout went stale",
      "A guard only covers what it gates",
    ];
    for (const sample of legitimate) {
      expect(
        UNSHIPPABLE_STUB_CLAIMS.some((p) => p.test(sample)),
        `false positive on: ${sample}`,
      ).toBe(false);
    }
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
});
