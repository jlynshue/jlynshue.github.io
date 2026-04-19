export type EventName =
  | "page_viewed"
  | "cta_clicked"
  | "calendar_redirected"
  | "calendar_booked"
  | "lead_magnet_redirected"
  | "lead_captured"
  | "contact_identified"
  | "discovery_completed"
  | "qualified_lead_marked"
  | "diagnostic_sold"
  | "sprint_sold"
  | "retainer_started";

export interface TouchPoint {
  path: string;
  referrer: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmContent: string | null;
  occurredAt: string;
}

export interface TrackingProfile {
  anonymousId: string;
  sessionId: string;
  sessionStartedAt: string;
  sessionLastSeenAt: string;
  firstTouch: TouchPoint;
  lastTouch: TouchPoint;
  lastPath: string;
}

export interface ContactRecord {
  email: string;
  anonymousId: string | null;
  hubspotContactId: string | null;
  createdAt: string;
  updatedAt: string;
  firstTouch: TouchPoint | null;
  lastTouch: TouchPoint | null;
  latestLeadAsset: string | null;
  latestCtaId: string | null;
  latestCtaPlacement: string | null;
}

export interface DeliveryStatus {
  posthogStatus?: "pending" | "sent" | "failed";
  hubspotStatus?: "pending" | "sent" | "failed";
  lastError?: string | null;
  updatedAt: string;
}

export interface NormalizedEvent {
  eventId: string;
  eventName: EventName;
  occurredAt: string;
  anonymousId: string | null;
  sessionId: string | null;
  path: string;
  referrer: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmContent: string | null;
  ctaId: string | null;
  ctaPlacement: string | null;
  assetId: string | null;
  contactEmail: string | null;
  hubspotContactId: string | null;
  hubspotDealId: string | null;
  dealStage: string | null;
  value: number | null;
  properties: Record<string, unknown>;
  delivery: DeliveryStatus;
}

export interface TrackingTokenPayload {
  version: 1;
  anonymousId: string | null;
  sessionId: string | null;
  firstTouch: TouchPoint | null;
  lastTouch: TouchPoint | null;
  ctaId: string | null;
  ctaPlacement: string | null;
  assetId: string | null;
  issuedAt: string;
}

export interface PostHogTaskPayload {
  event: NormalizedEvent;
}

export interface HubSpotUpsertTaskPayload {
  relatedEventId: string;
  contactEmail: string;
  anonymousId: string | null;
  firstTouch: TouchPoint | null;
  lastTouch: TouchPoint | null;
  latestLeadAsset: string | null;
  latestCtaId: string | null;
  latestCtaPlacement: string | null;
}

export interface HubSpotDealRecord {
  id: string;
  dealStage: string;
  updatedAt: string;
  properties: Record<string, string | null>;
}

export interface AppConfig {
  nodeEnv: string;
  port: number;
  baseUrl: string;
  staticDir: string;
  cookieDomain: string | null;
  discoveryCallUrl: string | null;
  leadMagnetUrl: string | null;
  trackingSecret: string;
  internalApiToken: string;
  calcomWebhookSecret: string | null;
  tallyWebhookSecret: string | null;
  posthogHost: string | null;
  posthogApiKey: string | null;
  hubspotToken: string | null;
  hubspotStageEventMap: Partial<Record<string, EventName>>;
  serviceUrl: string | null;
  cloudTasksProject: string | null;
  cloudTasksLocation: string | null;
  cloudTasksQueue: string | null;
}

export interface TrackingStore {
  getProfile(anonymousId: string): Promise<TrackingProfile | null>;
  saveProfile(profile: TrackingProfile): Promise<void>;
  saveEvent(event: NormalizedEvent): Promise<void>;
  updateEventDelivery(eventId: string, patch: Partial<DeliveryStatus>): Promise<void>;
  saveContact(contact: ContactRecord): Promise<void>;
  getContact(email: string): Promise<ContactRecord | null>;
  getCursor(key: string): Promise<string | null>;
  setCursor(key: string, value: string): Promise<void>;
}
