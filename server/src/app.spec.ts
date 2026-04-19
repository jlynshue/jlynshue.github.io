import { createHmac } from "node:crypto";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createApp } from "./app.js";
import { MemoryTrackingStore } from "./repository.js";
import { createTrackingToken } from "./utils.js";
import type { AppConfig } from "./types.js";

async function createStaticBundle() {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "jls-site-test-"));
  await fs.writeFile(path.join(dir, "index.html"), "<!doctype html><html><body>ok</body></html>", "utf8");
  await fs.mkdir(path.join(dir, "assets"));
  await fs.writeFile(path.join(dir, "assets", "app.js"), "console.log('ok')", "utf8");
  return dir;
}

function buildConfig(staticDir: string): AppConfig {
  return {
    nodeEnv: "production",
    port: 8080,
    baseUrl: "https://jonathanlynshue.com",
    staticDir,
    cookieDomain: "jonathanlynshue.com",
    discoveryCallUrl: "https://cal.com/jonathanlynshue/discovery-call",
    leadMagnetUrl: "https://tally.so/r/workflow-audit",
    trackingSecret: "tracking-secret",
    internalApiToken: "internal-token",
    calcomWebhookSecret: "calcom-secret",
    tallyWebhookSecret: "tally-secret",
    posthogHost: "https://us.i.posthog.com",
    posthogApiKey: "phc_test",
    hubspotToken: "hubspot-token",
    hubspotStageEventMap: {
      appointmentscheduled: "discovery_completed",
    },
    serviceUrl: null,
    cloudTasksProject: null,
    cloudTasksLocation: null,
    cloudTasksQueue: null,
  };
}

describe("server app", () => {
  let staticDir: string;

  beforeEach(async () => {
    staticDir = await createStaticBundle();
  });

  afterEach(async () => {
    await fs.rm(staticDir, { recursive: true, force: true });
  });

  it("captures server-side page views and sets first-party cookies", async () => {
    const store = new MemoryTrackingStore();
    const posthog = { capture: vi.fn().mockResolvedValue(undefined) };
    const hubspot = {
      upsertContact: vi.fn().mockResolvedValue(null),
      searchDealsUpdatedSince: vi.fn().mockResolvedValue([]),
    };

    const app = createApp(buildConfig(staticDir), {
      store,
      dispatcher: { dispatch: vi.fn().mockResolvedValue(false) } as any,
      posthog,
      hubspot,
      now: () => new Date("2026-04-19T12:00:00.000Z"),
    });

    const response = await app.handleRequest(
      new Request("https://jonathanlynshue.com/diagnostic?utm_source=linkedin&utm_campaign=q2", {
        headers: { accept: "text/html" },
      }),
    );

    expect(response.status).toBe(200);
    expect(await response.text()).toContain("ok");
    expect(response.headers.get("set-cookie")).toContain("jls_aid=");
    expect(Array.from(store.events.values())[0]?.eventName).toBe("page_viewed");
    expect(posthog.capture).toHaveBeenCalledTimes(1);
  });

  it("routes discovery CTAs through a tracked backend redirect", async () => {
    const store = new MemoryTrackingStore();
    const posthog = { capture: vi.fn().mockResolvedValue(undefined) };
    const hubspot = {
      upsertContact: vi.fn().mockResolvedValue(null),
      searchDealsUpdatedSince: vi.fn().mockResolvedValue([]),
    };

    const app = createApp(buildConfig(staticDir), {
      store,
      dispatcher: { dispatch: vi.fn().mockResolvedValue(false) } as any,
      posthog,
      hubspot,
      now: () => new Date("2026-04-19T12:00:00.000Z"),
    });

    const response = await app.handleRequest(
      new Request("https://jonathanlynshue.com/r/discovery-call?placement=hero&utm_source=linkedin", {
        headers: { accept: "text/html" },
      }),
    );

    expect(response.status).toBe(302);
    const location = response.headers.get("location");
    expect(location).toContain("https://cal.com/jonathanlynshue/discovery-call");
    expect(location).toContain("jls_tracking=");
    expect(location).toContain("placement=hero");
    expect(Array.from(store.events.values()).map((event) => event.eventName)).toEqual([
      "cta_clicked",
      "calendar_redirected",
    ]);
  });

  it("accepts valid tally webhooks and upserts the contact", async () => {
    const store = new MemoryTrackingStore();
    const posthog = { capture: vi.fn().mockResolvedValue(undefined) };
    const hubspot = {
      upsertContact: vi.fn().mockResolvedValue("123"),
      searchDealsUpdatedSince: vi.fn().mockResolvedValue([]),
    };
    const app = createApp(buildConfig(staticDir), {
      store,
      dispatcher: { dispatch: vi.fn().mockResolvedValue(false) } as any,
      posthog,
      hubspot,
      now: () => new Date("2026-04-19T12:00:00.000Z"),
    });

    const token = createTrackingToken(
      {
        version: 1,
        anonymousId: "anon-123",
        sessionId: "session-123",
        firstTouch: {
          path: "/",
          referrer: "https://linkedin.com",
          utmSource: "linkedin",
          utmMedium: "social",
          utmCampaign: "q2",
          utmContent: null,
          occurredAt: "2026-04-19T11:59:00.000Z",
        },
        lastTouch: {
          path: "/",
          referrer: "https://linkedin.com",
          utmSource: "linkedin",
          utmMedium: "social",
          utmCampaign: "q2",
          utmContent: null,
          occurredAt: "2026-04-19T11:59:00.000Z",
        },
        ctaId: "lead_magnet",
        ctaPlacement: "hero",
        assetId: "workflow-audit",
        issuedAt: "2026-04-19T11:59:30.000Z",
      },
      "tracking-secret",
    );

    const body = JSON.stringify({
      eventId: "evt_1",
      eventType: "FORM_RESPONSE",
      createdAt: "2026-04-19T12:00:00.000Z",
      data: {
        formId: "form_123",
        fields: [
          { label: "Email", type: "INPUT_EMAIL", value: "hello@company.com" },
          { label: "jls_tracking", type: "HIDDEN_FIELDS", value: token },
          { label: "asset", type: "HIDDEN_FIELDS", value: "workflow-audit" },
        ],
      },
    });
    const signature = createHmac("sha256", "tally-secret").update(body).digest("base64");

    const response = await app.handleRequest(
      new Request("https://jonathanlynshue.com/webhooks/tally", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Tally-Signature": signature,
        },
        body,
      }),
    );

    expect(response.status).toBe(202);
    expect(posthog.capture).toHaveBeenCalledTimes(2);
    expect(hubspot.upsertContact).toHaveBeenCalledTimes(1);
    expect(await store.getContact("hello@company.com")).toMatchObject({
      email: "hello@company.com",
      hubspotContactId: "123",
      latestLeadAsset: "workflow-audit",
    });
  });

  it("protects internal task routes with a bearer token", async () => {
    const app = createApp(buildConfig(staticDir), {
      store: new MemoryTrackingStore(),
      dispatcher: { dispatch: vi.fn().mockResolvedValue(false) } as any,
      posthog: { capture: vi.fn().mockResolvedValue(undefined) },
      hubspot: {
        upsertContact: vi.fn().mockResolvedValue(null),
        searchDealsUpdatedSince: vi.fn().mockResolvedValue([]),
      },
      now: () => new Date("2026-04-19T12:00:00.000Z"),
    });

    const response = await app.handleRequest(
      new Request("https://jonathanlynshue.com/internal/tasks/posthog-delivery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event: { eventId: "x" } }),
      }),
    );

    expect(response.status).toBe(401);
  });
});
