import { createHmac } from "node:crypto";

import { describe, expect, it } from "vitest";

import {
  createTrackingToken,
  isHtmlNavigationRequest,
  normalizeRoutePath,
  parseCookies,
  verifyRawBodySignature,
  verifyTrackingToken,
} from "./utils.js";

describe("tracking utils", () => {
  it("signs and verifies tracking tokens", () => {
    const token = createTrackingToken(
      {
        version: 1,
        anonymousId: "anon-123",
        sessionId: "session-123",
        firstTouch: null,
        lastTouch: null,
        ctaId: "schedule_discovery_call",
        ctaPlacement: "hero",
        assetId: null,
        issuedAt: "2026-04-19T00:00:00.000Z",
      },
      "secret",
    );

    expect(verifyTrackingToken(token, "secret")?.anonymousId).toBe("anon-123");
    expect(verifyTrackingToken(token, "wrong-secret")).toBeNull();
  });

  it("detects html navigation requests but excludes internal routes and assets", () => {
    const htmlRequest = new Request("https://jonathanlynshue.com/sprint", {
      headers: { accept: "text/html" },
    });
    const webhookRequest = new Request(
      "https://jonathanlynshue.com/webhooks/tally",
      {
        method: "POST",
        headers: { accept: "application/json" },
      },
    );
    const assetRequest = new Request(
      "https://jonathanlynshue.com/assets/app.js",
      {
        headers: { accept: "*/*" },
      },
    );

    expect(isHtmlNavigationRequest(htmlRequest, new URL(htmlRequest.url))).toBe(
      true,
    );
    expect(
      isHtmlNavigationRequest(webhookRequest, new URL(webhookRequest.url)),
    ).toBe(false);
    expect(
      isHtmlNavigationRequest(assetRequest, new URL(assetRequest.url)),
    ).toBe(false);
  });

  it("serves the SPA shell for nested /toolkit product paths", () => {
    // A client route in App.tsx is only half the path. In production the request
    // reaches Cloud Run via the trailing "**" rewrite in firebase.template.json,
    // and this predicate is what decides it gets index.html rather than a 404 —
    // so /toolkit/<slug> needs no Firebase rewrite of its own. This asserts the
    // denylist behaviour the client route depends on.
    const productRequest = new Request(
      "https://jonathanlynshue.com/toolkit/agent-ops-field-guide",
      { headers: { accept: "text/html" } },
    );
    const wildcardAccept = new Request(
      "https://jonathanlynshue.com/toolkit/agent-ops-field-guide",
      { headers: { accept: "*/*" } },
    );
    const postToProduct = new Request(
      "https://jonathanlynshue.com/toolkit/agent-ops-field-guide",
      { method: "POST", headers: { accept: "text/html" } },
    );

    expect(
      isHtmlNavigationRequest(productRequest, new URL(productRequest.url)),
    ).toBe(true);
    expect(
      isHtmlNavigationRequest(wildcardAccept, new URL(wildcardAccept.url)),
    ).toBe(true);
    expect(
      isHtmlNavigationRequest(postToProduct, new URL(postToProduct.url)),
    ).toBe(false);
  });

  it("parses and verifies signed raw webhook bodies", () => {
    const rawBody = JSON.stringify({ hello: "world" });
    const goodSignature = createHmac("sha256", "secret")
      .update(rawBody)
      .digest("base64");
    const badSignature = "bad";

    expect(parseCookies("jls_aid=abc; jls_sid=def")).toEqual({
      jls_aid: "abc",
      jls_sid: "def",
    });

    expect(
      verifyRawBodySignature(rawBody, "secret", goodSignature, "base64"),
    ).toBe(true);
    expect(
      verifyRawBodySignature(rawBody, "secret", badSignature, "base64"),
    ).toBe(false);
  });

  it("normalizes route paths by collapsing a trailing slash", () => {
    expect(normalizeRoutePath("/work/")).toBe("/work");
    expect(normalizeRoutePath("/work")).toBe("/work");
    expect(normalizeRoutePath("/")).toBe("/");
    // Case is preserved deliberately — URL paths are case-sensitive.
    expect(normalizeRoutePath("/Work")).toBe("/Work");
  });
});
