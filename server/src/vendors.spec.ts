import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { PostHogApiClient, HubSpotApiClient, mapDealStageToEvent } from "./vendors.js";
import type { AppConfig, NormalizedEvent } from "./types.js";

function buildConfig(overrides: Partial<AppConfig> = {}): AppConfig {
  return {
    nodeEnv: "production",
    port: 8080,
    baseUrl: "https://jonathanlynshue.com",
    staticDir: "/tmp",
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
    linkedinAccessToken: null,
    linkedinPersonUrn: null,
    ...overrides,
  };
}

function buildEvent(overrides: Partial<NormalizedEvent> = {}): NormalizedEvent {
  return {
    eventId: "evt-001",
    eventName: "page_viewed",
    occurredAt: "2026-04-19T12:00:00.000Z",
    anonymousId: "anon-123",
    sessionId: "session-456",
    path: "/diagnostic",
    referrer: "https://linkedin.com",
    utmSource: "linkedin",
    utmMedium: "social",
    utmCampaign: "q2",
    utmContent: null,
    ctaId: null,
    ctaPlacement: null,
    assetId: null,
    contactEmail: null,
    hubspotContactId: null,
    hubspotDealId: null,
    dealStage: null,
    value: null,
    properties: {},
    delivery: { updatedAt: "2026-04-19T12:00:00.000Z" },
    ...overrides,
  };
}

describe("PostHogApiClient", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("builds correct event payload with distinctId, event name, properties, and timestamp", async () => {
    fetchMock.mockResolvedValue(new Response("ok", { status: 200 }));

    const client = new PostHogApiClient(buildConfig());
    const event = buildEvent({
      contactEmail: "hello@company.com",
      properties: { custom_field: "value" },
    });

    await client.capture(event);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, options] = fetchMock.mock.calls[0];
    expect(url.toString()).toBe("https://us.i.posthog.com/capture/");
    expect(options.method).toBe("POST");
    expect(options.headers["Content-Type"]).toBe("application/json");

    const body = JSON.parse(options.body);
    expect(body.api_key).toBe("phc_test");
    expect(body.event).toBe("page_viewed");
    expect(body.distinct_id).toBe("hello@company.com");
    expect(body.timestamp).toBe("2026-04-19T12:00:00.000Z");
    expect(body.properties.path).toBe("/diagnostic");
    expect(body.properties.utm_source).toBe("linkedin");
    expect(body.properties.utm_medium).toBe("social");
    expect(body.properties.utm_campaign).toBe("q2");
    expect(body.properties.anonymous_id).toBe("anon-123");
    expect(body.properties.session_id).toBe("session-456");
    expect(body.properties.custom_field).toBe("value");
    expect(body.properties.$current_url).toBe("https://jonathanlynshue.com/diagnostic");
  });

  it("uses anonymousId as distinctId when contactEmail is null", async () => {
    fetchMock.mockResolvedValue(new Response("ok", { status: 200 }));

    const client = new PostHogApiClient(buildConfig());
    const event = buildEvent({ contactEmail: null, anonymousId: "anon-xyz" });

    await client.capture(event);

    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.distinct_id).toBe("anon-xyz");
  });

  it("does not call fetch when posthogHost is not configured", async () => {
    fetchMock.mockResolvedValue(new Response("ok", { status: 200 }));

    const client = new PostHogApiClient(buildConfig({ posthogHost: null }));
    await client.capture(buildEvent());

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("throws an error when PostHog returns a non-ok response", async () => {
    fetchMock.mockResolvedValue(new Response("rate limited", { status: 429 }));

    const client = new PostHogApiClient(buildConfig());

    await expect(client.capture(buildEvent())).rejects.toThrow(
      "PostHog capture failed: 429 rate limited",
    );
  });
});

describe("HubSpotApiClient", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe("upsertContact", () => {
    it("sends correct request and returns contactId from response", async () => {
      fetchMock.mockResolvedValue(
        new Response(JSON.stringify({ results: [{ id: "hs-contact-789" }] }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      );

      const client = new HubSpotApiClient(buildConfig());
      const payload = {
        relatedEventId: "evt-001",
        contactEmail: "hello@company.com",
        anonymousId: "anon-123",
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
          path: "/diagnostic",
          referrer: null,
          utmSource: "google",
          utmMedium: "cpc",
          utmCampaign: "brand",
          utmContent: "ad1",
          occurredAt: "2026-04-19T12:00:00.000Z",
        },
        latestLeadAsset: "workflow-audit",
        latestCtaId: "lead_magnet",
        latestCtaPlacement: "hero",
      };

      const contactId = await client.upsertContact(payload);

      expect(contactId).toBe("hs-contact-789");
      expect(fetchMock).toHaveBeenCalledTimes(1);

      const [url, options] = fetchMock.mock.calls[0];
      expect(url).toBe("https://api.hubapi.com/crm/v3/objects/contacts/batch/upsert");
      expect(options.method).toBe("POST");
      expect(options.headers.Authorization).toBe("Bearer hubspot-token");

      const body = JSON.parse(options.body);
      const props = body.inputs[0].properties;
      expect(body.inputs[0].id).toBe("hello@company.com");
      expect(body.inputs[0].idProperty).toBe("email");
      expect(props.email).toBe("hello@company.com");
      expect(props.jls_anonymous_id).toBe("anon-123");
      expect(props.jls_first_touch_source).toBe("linkedin");
      expect(props.jls_first_touch_medium).toBe("social");
      expect(props.jls_first_touch_campaign).toBe("q2");
      expect(props.jls_first_touch_content).toBe("");
      expect(props.jls_first_landing_path).toBe("/");
      expect(props.jls_last_touch_source).toBe("google");
      expect(props.jls_last_touch_medium).toBe("cpc");
      expect(props.jls_last_touch_campaign).toBe("brand");
      expect(props.jls_last_touch_content).toBe("ad1");
      expect(props.jls_last_touch_path).toBe("/diagnostic");
      expect(props.jls_last_cta_id).toBe("lead_magnet");
      expect(props.jls_last_cta_placement).toBe("hero");
      expect(props.jls_latest_lead_asset).toBe("workflow-audit");
    });

    it("returns null when hubspotToken is not configured", async () => {
      fetchMock.mockResolvedValue(new Response("ok", { status: 200 }));

      const client = new HubSpotApiClient(buildConfig({ hubspotToken: null }));
      const result = await client.upsertContact({
        relatedEventId: "evt-001",
        contactEmail: "hello@company.com",
        anonymousId: null,
        firstTouch: null,
        lastTouch: null,
        latestLeadAsset: null,
        latestCtaId: null,
        latestCtaPlacement: null,
      });

      expect(result).toBeNull();
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it("throws an error when HubSpot returns a non-ok response", async () => {
      fetchMock.mockResolvedValue(new Response("unauthorized", { status: 401 }));

      const client = new HubSpotApiClient(buildConfig());

      await expect(
        client.upsertContact({
          relatedEventId: "evt-001",
          contactEmail: "hello@company.com",
          anonymousId: null,
          firstTouch: null,
          lastTouch: null,
          latestLeadAsset: null,
          latestCtaId: null,
          latestCtaPlacement: null,
        }),
      ).rejects.toThrow("HubSpot contact upsert failed: 401 unauthorized");
    });
  });

  describe("searchDealsUpdatedSince", () => {
    it("sends correct search request with date filter and returns mapped deals", async () => {
      fetchMock.mockResolvedValue(
        new Response(
          JSON.stringify({
            results: [
              {
                id: "deal-001",
                properties: {
                  dealstage: "appointmentscheduled",
                  hs_lastmodifieddate: "2026-04-19T13:00:00.000Z",
                  dealname: "Test Deal",
                },
              },
              {
                id: "deal-002",
                properties: {
                  dealstage: "qualifiedtobuy",
                  hs_lastmodifieddate: "2026-04-19T14:00:00.000Z",
                  dealname: "Another Deal",
                },
              },
            ],
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        ),
      );

      const client = new HubSpotApiClient(buildConfig());
      const since = "2026-04-19T12:00:00.000Z";
      const deals = await client.searchDealsUpdatedSince(since);

      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [url, options] = fetchMock.mock.calls[0];
      expect(url).toBe("https://api.hubapi.com/crm/v3/objects/deals/search");
      expect(options.method).toBe("POST");
      expect(options.headers.Authorization).toBe("Bearer hubspot-token");

      const body = JSON.parse(options.body);
      const filter = body.filterGroups[0].filters[0];
      expect(filter.propertyName).toBe("hs_lastmodifieddate");
      expect(filter.operator).toBe("GTE");
      expect(filter.value).toBe(new Date(since).getTime().toString());
      expect(body.properties).toEqual(["dealstage", "hs_lastmodifieddate", "dealname"]);
      expect(body.limit).toBe(100);

      expect(deals).toHaveLength(2);
      expect(deals[0]).toEqual({
        id: "deal-001",
        dealStage: "appointmentscheduled",
        updatedAt: "2026-04-19T13:00:00.000Z",
        properties: {
          dealstage: "appointmentscheduled",
          hs_lastmodifieddate: "2026-04-19T13:00:00.000Z",
          dealname: "Test Deal",
        },
      });
      expect(deals[1]).toEqual({
        id: "deal-002",
        dealStage: "qualifiedtobuy",
        updatedAt: "2026-04-19T14:00:00.000Z",
        properties: {
          dealstage: "qualifiedtobuy",
          hs_lastmodifieddate: "2026-04-19T14:00:00.000Z",
          dealname: "Another Deal",
        },
      });
    });

    it("returns empty array when hubspotToken is not configured", async () => {
      fetchMock.mockResolvedValue(new Response("ok", { status: 200 }));

      const client = new HubSpotApiClient(buildConfig({ hubspotToken: null }));
      const deals = await client.searchDealsUpdatedSince("2026-04-19T12:00:00.000Z");

      expect(deals).toEqual([]);
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it("throws an error when HubSpot returns a non-ok response", async () => {
      fetchMock.mockResolvedValue(new Response("server error", { status: 500 }));

      const client = new HubSpotApiClient(buildConfig());

      await expect(
        client.searchDealsUpdatedSince("2026-04-19T12:00:00.000Z"),
      ).rejects.toThrow("HubSpot deal search failed: 500 server error");
    });
  });
});

describe("mapDealStageToEvent", () => {
  it("returns the mapped event name for a known stage", () => {
    const stageMap = { appointmentscheduled: "discovery_completed" as const };
    expect(mapDealStageToEvent("appointmentscheduled", stageMap)).toBe("discovery_completed");
  });

  it("returns null for an unknown stage", () => {
    const stageMap = { appointmentscheduled: "discovery_completed" as const };
    expect(mapDealStageToEvent("closedwon", stageMap)).toBeNull();
  });

  it("returns null for an empty stage map", () => {
    expect(mapDealStageToEvent("appointmentscheduled", {})).toBeNull();
  });
});
