import path from "node:path";

import type { AppConfig, EventName } from "./types.js";

const DEFAULT_STAGE_EVENT_MAP = "{}";

function parseStageEventMap(input: string): Partial<Record<string, EventName>> {
  try {
    const parsed = JSON.parse(input) as Record<string, EventName>;
    return parsed;
  } catch (error) {
    throw new Error(`Invalid HUBSPOT_STAGE_EVENT_MAP_JSON: ${String(error)}`);
  }
}

function readOptional(name: string): string | null {
  const value = process.env[name]?.trim();
  return value ? value : null;
}

export const loadConfig = buildConfig;

export function buildConfig(): AppConfig {
  return {
    nodeEnv: process.env.NODE_ENV ?? "production",
    port: Number(process.env.PORT ?? "8080"),
    baseUrl: process.env.BASE_URL ?? "http://localhost:8080",
    staticDir: path.resolve(process.cwd(), process.env.STATIC_DIR ?? "dist"),
    cookieDomain: readOptional("COOKIE_DOMAIN"),
    discoveryCallUrl: readOptional("DISCOVERY_CALL_URL"),
    leadMagnetUrl: readOptional("LEAD_MAGNET_URL"),
    trackingSecret: process.env.TRACKING_SECRET ?? "local-tracking-secret",
    internalApiToken: process.env.INTERNAL_API_TOKEN ?? "local-internal-token",
    calcomWebhookSecret: readOptional("CALCOM_WEBHOOK_SECRET"),
    tallyWebhookSecret: readOptional("TALLY_WEBHOOK_SECRET"),
    posthogHost: readOptional("POSTHOG_HOST"),
    posthogApiKey: readOptional("POSTHOG_API_KEY"),
    hubspotToken: readOptional("HUBSPOT_TOKEN"),
    hubspotStageEventMap: parseStageEventMap(
      process.env.HUBSPOT_STAGE_EVENT_MAP_JSON ?? DEFAULT_STAGE_EVENT_MAP,
    ),
    serviceUrl: readOptional("SERVICE_URL"),
    cloudTasksProject: readOptional("CLOUD_TASKS_PROJECT"),
    cloudTasksLocation: readOptional("CLOUD_TASKS_LOCATION"),
    cloudTasksQueue: readOptional("CLOUD_TASKS_QUEUE"),
    linkedinAccessToken: readOptional("LINKEDIN_ACCESS_TOKEN"),
    linkedinPersonUrn: readOptional("LINKEDIN_PERSON_URN"),
  };
}
