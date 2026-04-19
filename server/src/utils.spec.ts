import { createHmac } from "node:crypto";

import { describe, expect, it } from "vitest";

import {
  createTrackingToken,
  isHtmlNavigationRequest,
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
    const webhookRequest = new Request("https://jonathanlynshue.com/webhooks/tally", {
      method: "POST",
      headers: { accept: "application/json" },
    });
    const assetRequest = new Request("https://jonathanlynshue.com/assets/app.js", {
      headers: { accept: "*/*" },
    });

    expect(isHtmlNavigationRequest(htmlRequest, new URL(htmlRequest.url))).toBe(true);
    expect(isHtmlNavigationRequest(webhookRequest, new URL(webhookRequest.url))).toBe(false);
    expect(isHtmlNavigationRequest(assetRequest, new URL(assetRequest.url))).toBe(false);
  });

  it("parses and verifies signed raw webhook bodies", () => {
    const rawBody = JSON.stringify({ hello: "world" });
    const goodSignature = createHmac("sha256", "secret").update(rawBody).digest("base64");
    const badSignature = "bad";

    expect(parseCookies("jls_aid=abc; jls_sid=def")).toEqual({
      jls_aid: "abc",
      jls_sid: "def",
    });

    expect(verifyRawBodySignature(rawBody, "secret", goodSignature, "base64")).toBe(true);
    expect(verifyRawBodySignature(rawBody, "secret", badSignature, "base64")).toBe(false);
  });
});
