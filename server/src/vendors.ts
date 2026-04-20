import type {
  AppConfig,
  EventName,
  HubSpotDealRecord,
  HubSpotUpsertTaskPayload,
  NormalizedEvent,
} from "./types.js";

function getHubSpotPropertyMap(payload: HubSpotUpsertTaskPayload): Record<string, string> {
  return {
    email: payload.contactEmail,
    jls_anonymous_id: payload.anonymousId ?? "",
    jls_first_touch_source: payload.firstTouch?.utmSource ?? "",
    jls_first_touch_medium: payload.firstTouch?.utmMedium ?? "",
    jls_first_touch_campaign: payload.firstTouch?.utmCampaign ?? "",
    jls_first_touch_content: payload.firstTouch?.utmContent ?? "",
    jls_first_landing_path: payload.firstTouch?.path ?? "",
    jls_last_touch_source: payload.lastTouch?.utmSource ?? "",
    jls_last_touch_medium: payload.lastTouch?.utmMedium ?? "",
    jls_last_touch_campaign: payload.lastTouch?.utmCampaign ?? "",
    jls_last_touch_content: payload.lastTouch?.utmContent ?? "",
    jls_last_touch_path: payload.lastTouch?.path ?? "",
    jls_last_cta_id: payload.latestCtaId ?? "",
    jls_last_cta_placement: payload.latestCtaPlacement ?? "",
    jls_latest_lead_asset: payload.latestLeadAsset ?? "",
  };
}

/**
 * Client for sending events to the PostHog analytics API.
 */
export class PostHogApiClient {
  /**
   * @param {AppConfig} config - Application configuration containing posthogHost and posthogApiKey.
   */
  constructor(private readonly config: AppConfig) {}

  /**
   * Captures a normalized event and sends it to PostHog.
   * @param {NormalizedEvent} event - The event to capture.
   * @returns {Promise<void>} Resolves when the event is accepted; throws on failure.
   */
  async capture(event: NormalizedEvent): Promise<void> {
    if (!this.config.posthogHost || !this.config.posthogApiKey) {
      return;
    }

    const endpoint = new URL("/capture/", this.config.posthogHost);
    const distinctId = event.contactEmail ?? event.anonymousId ?? event.eventId;
    const properties: Record<string, unknown> = {
      path: event.path,
      referrer: event.referrer,
      utm_source: event.utmSource,
      utm_medium: event.utmMedium,
      utm_campaign: event.utmCampaign,
      utm_content: event.utmContent,
      cta_id: event.ctaId,
      cta_placement: event.ctaPlacement,
      asset_id: event.assetId,
      hubspot_contact_id: event.hubspotContactId,
      hubspot_deal_id: event.hubspotDealId,
      deal_stage: event.dealStage,
      session_id: event.sessionId,
      anonymous_id: event.anonymousId,
      $current_url: `${this.config.baseUrl}${event.path}`,
      ...event.properties,
    };

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_key: this.config.posthogApiKey,
        event: event.eventName,
        distinct_id: distinctId,
        timestamp: event.occurredAt,
        properties,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`PostHog capture failed: ${response.status} ${body}`);
    }
  }
}

/**
 * Client for interacting with the HubSpot CRM API (contacts and deals).
 */
export class HubSpotApiClient {
  /**
   * @param {AppConfig} config - Application configuration containing hubspotToken.
   */
  constructor(private readonly config: AppConfig) {}

  /**
   * Creates or updates a HubSpot contact using the batch upsert endpoint.
   * @param {HubSpotUpsertTaskPayload} payload - The contact data and attribution fields to upsert.
   * @returns {Promise<string | null>} The HubSpot contact ID on success, or null if HubSpot is not configured.
   */
  async upsertContact(payload: HubSpotUpsertTaskPayload): Promise<string | null> {
    if (!this.config.hubspotToken) {
      return null;
    }

    const response = await fetch("https://api.hubapi.com/crm/v3/objects/contacts/batch/upsert", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.config.hubspotToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: [
          {
            id: payload.contactEmail,
            idProperty: "email",
            properties: getHubSpotPropertyMap(payload),
          },
        ],
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`HubSpot contact upsert failed: ${response.status} ${body}`);
    }

    const data = (await response.json()) as {
      results?: Array<{ id?: string }>;
    };

    return data.results?.[0]?.id ?? null;
  }

  /**
   * Searches for HubSpot deals modified on or after the given timestamp.
   * @param {string} since - ISO 8601 timestamp; only deals updated at or after this time are returned.
   * @returns {Promise<HubSpotDealRecord[]>} An array of deal records, or an empty array if HubSpot is not configured.
   */
  async searchDealsUpdatedSince(since: string): Promise<HubSpotDealRecord[]> {
    if (!this.config.hubspotToken) {
      return [];
    }

    const response = await fetch("https://api.hubapi.com/crm/v3/objects/deals/search", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.config.hubspotToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filterGroups: [
          {
            filters: [
              {
                propertyName: "hs_lastmodifieddate",
                operator: "GTE",
                value: new Date(since).getTime().toString(),
              },
            ],
          },
        ],
        properties: ["dealstage", "hs_lastmodifieddate", "dealname"],
        sorts: ["hs_lastmodifieddate"],
        limit: 100,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`HubSpot deal search failed: ${response.status} ${body}`);
    }

    const data = (await response.json()) as {
      results?: Array<{
        id: string;
        properties: Record<string, string>;
      }>;
    };

    return (data.results ?? []).map((result) => ({
      id: result.id,
      dealStage: result.properties.dealstage ?? "",
      updatedAt: result.properties.hs_lastmodifieddate ?? new Date().toISOString(),
      properties: result.properties,
    }));
  }
}

/**
 * Maps a HubSpot deal stage identifier to a corresponding event name using a lookup table.
 * @param {string} stage - The HubSpot deal stage identifier.
 * @param {Partial<Record<string, EventName>>} stageEventMap - A mapping from stage identifiers to event names.
 * @returns {EventName | null} The matched event name, or null if the stage is not in the map.
 * @example
 * mapDealStageToEvent("closedwon", { closedwon: "deal_closed_won" }); // "deal_closed_won"
 */
export function mapDealStageToEvent(
  stage: string,
  stageEventMap: Partial<Record<string, EventName>>,
): EventName | null {
  return stageEventMap[stage] ?? null;
}
