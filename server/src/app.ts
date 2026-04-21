import { randomUUID } from "node:crypto";

import { CloudTaskDispatcher } from "./dispatcher.js";
import { FirestoreTrackingStore } from "./repository.js";
import {
  appendTrackingParameters,
  createEvent,
  createTrackingToken,
  extractBearerToken,
  extractCalcomEmail,
  extractCalcomToken,
  extractTallyEmail,
  extractTallyFieldValue,
  getPathWithQuery,
  isAttributionTouch,
  isHtmlNavigationRequest,
  jsonResponse,
  mergeCookieHeaders,
  nowIso,
  parseCookies,
  parseTouchFromRequest,
  readRawBody,
  resolveSessionId,
  serializeCookie,
  serveStaticFile,
  verifyRawBodySignature,
  verifyTrackingToken,
} from "./utils.js";
import { mapDealStageToEvent } from "./vendors.js";
import type {
  AppConfig,
  ContactRecord,
  EventName,
  HubSpotUpsertTaskPayload,
  PostHogTaskPayload,
  TouchPoint,
  TrackingProfile,
  TrackingStore,
  TrackingTokenPayload,
} from "./types.js";

interface AppDependencies {
  store: TrackingStore;
  dispatcher: CloudTaskDispatcher;
  posthog: {
    capture(event: PostHogTaskPayload["event"]): Promise<void>;
  };
  hubspot: {
    upsertContact(payload: HubSpotUpsertTaskPayload): Promise<string | null>;
    searchDealsUpdatedSince(since: string): Promise<
      Array<{
        id: string;
        dealStage: string;
        updatedAt: string;
        properties: Record<string, string | null>;
      }>
    >;
  };
  now?: () => Date;
}

interface TrackingResolution {
  profile: TrackingProfile;
  cookies: string[];
  currentTouch: TouchPoint;
}

const DISCOVERY_TARGET = "discovery-call";
const LEAD_MAGNET_TARGET = "lead-magnet";

function securityCookie(config: AppConfig): boolean {
  return config.baseUrl.startsWith("https://");
}

function normalizeEmail(email: string | null): string | null {
  return email ? email.toLowerCase() : null;
}

function jsonError(status: number, error: string): Response {
  return jsonResponse({ error }, { status });
}

function isAuthorized(request: Request, config: AppConfig): boolean {
  return extractBearerToken(request) === config.internalApiToken;
}

function buildTrackingCookies(config: AppConfig, profile: TrackingProfile): string[] {
  return [
    serializeCookie("jls_aid", profile.anonymousId, {
      maxAge: 60 * 60 * 24 * 365,
      domain: config.cookieDomain,
      secure: securityCookie(config),
    }),
    serializeCookie("jls_sid", profile.sessionId, {
      maxAge: 60 * 30,
      domain: config.cookieDomain,
      secure: securityCookie(config),
    }),
  ];
}

function resolveRedirectTarget(config: AppConfig, target: string): URL | null {
  if (target === DISCOVERY_TARGET && config.discoveryCallUrl) {
    return new URL(config.discoveryCallUrl);
  }
  if (target === LEAD_MAGNET_TARGET && config.leadMagnetUrl) {
    return new URL(config.leadMagnetUrl);
  }
  return null;
}

function specificRedirectEvent(target: string): EventName {
  return target === DISCOVERY_TARGET ? "calendar_redirected" : "lead_magnet_redirected";
}

function assetIdForTarget(target: string, url: URL): string | null {
  if (target === LEAD_MAGNET_TARGET) {
    return url.searchParams.get("asset") ?? "workflow-audit";
  }
  return null;
}

function ctaIdForTarget(target: string): string {
  return target === DISCOVERY_TARGET ? "schedule_discovery_call" : "lead_magnet";
}

function buildWebhookTouch(token: TrackingTokenPayload | null, fallbackPath: string, occurredAt: string): TouchPoint {
  return (
    token?.lastTouch ?? {
      path: fallbackPath,
      referrer: null,
      utmSource: null,
      utmMedium: null,
      utmCampaign: null,
      utmContent: null,
      occurredAt,
    }
  );
}

function mergeContact(existing: ContactRecord | null, patch: ContactRecord): ContactRecord {
  return {
    ...existing,
    ...patch,
    firstTouch: existing?.firstTouch ?? patch.firstTouch,
    lastTouch: patch.lastTouch ?? existing?.lastTouch ?? null,
    latestLeadAsset: patch.latestLeadAsset ?? existing?.latestLeadAsset ?? null,
    latestCtaId: patch.latestCtaId ?? existing?.latestCtaId ?? null,
    latestCtaPlacement: patch.latestCtaPlacement ?? existing?.latestCtaPlacement ?? null,
    updatedAt: patch.updatedAt,
    createdAt: existing?.createdAt ?? patch.createdAt,
  };
}

export function createApp(config: AppConfig, dependencies: AppDependencies) {
  const clock = dependencies.now ?? (() => new Date());

  async function saveAndDispatchPostHog(event: PostHogTaskPayload["event"]): Promise<void> {
    await dependencies.store.saveEvent(event);

    if (!config.posthogApiKey || !config.posthogHost) {
      await dependencies.store.updateEventDelivery(event.eventId, {
        posthogStatus: "sent",
        lastError: null,
        updatedAt: nowIso(clock()),
      });
      return;
    }

    const queued = await dependencies.dispatcher.dispatch("/internal/tasks/posthog-delivery", { event });
    if (queued) {
      await dependencies.store.updateEventDelivery(event.eventId, {
        posthogStatus: "pending",
        lastError: null,
        updatedAt: nowIso(clock()),
      });
      return;
    }

    try {
      await dependencies.posthog.capture(event);
      await dependencies.store.updateEventDelivery(event.eventId, {
        posthogStatus: "sent",
        lastError: null,
        updatedAt: nowIso(clock()),
      });
    } catch (error) {
      await dependencies.store.updateEventDelivery(event.eventId, {
        posthogStatus: "failed",
        lastError: String(error),
        updatedAt: nowIso(clock()),
      });
      throw error;
    }
  }

  async function saveAndDispatchHubSpot(payload: HubSpotUpsertTaskPayload): Promise<void> {
    if (!config.hubspotToken) {
      await dependencies.store.updateEventDelivery(payload.relatedEventId, {
        hubspotStatus: "sent",
        lastError: null,
        updatedAt: nowIso(clock()),
      });
      return;
    }

    const queued = await dependencies.dispatcher.dispatch("/internal/tasks/hubspot-upsert", payload);
    if (queued) {
      await dependencies.store.updateEventDelivery(payload.relatedEventId, {
        hubspotStatus: "pending",
        lastError: null,
        updatedAt: nowIso(clock()),
      });
      return;
    }

    try {
      const hubspotContactId = await dependencies.hubspot.upsertContact(payload);
      const existing = await dependencies.store.getContact(payload.contactEmail);
      const record = mergeContact(existing, {
        email: payload.contactEmail,
        anonymousId: payload.anonymousId,
        hubspotContactId,
        createdAt: nowIso(clock()),
        updatedAt: nowIso(clock()),
        firstTouch: payload.firstTouch,
        lastTouch: payload.lastTouch,
        latestLeadAsset: payload.latestLeadAsset,
        latestCtaId: payload.latestCtaId,
        latestCtaPlacement: payload.latestCtaPlacement,
      });
      await dependencies.store.saveContact(record);
      await dependencies.store.updateEventDelivery(payload.relatedEventId, {
        hubspotStatus: "sent",
        lastError: null,
        updatedAt: nowIso(clock()),
      });
    } catch (error) {
      await dependencies.store.updateEventDelivery(payload.relatedEventId, {
        hubspotStatus: "failed",
        lastError: String(error),
        updatedAt: nowIso(clock()),
      });
      throw error;
    }
  }

  async function resolveTracking(request: Request, url: URL): Promise<TrackingResolution> {
    const cookies = parseCookies(request.headers.get("cookie"));
    const now = clock();
    const occurredAt = now.toISOString();
    const currentTouch = parseTouchFromRequest(request, url, occurredAt);
    const cookieAnonymousId = cookies.jls_aid ?? null;
    const existingProfile = cookieAnonymousId
      ? await dependencies.store.getProfile(cookieAnonymousId)
      : null;

    const anonymousId = cookieAnonymousId ?? existingProfile?.anonymousId ?? randomUUID();
    const session = resolveSessionId(existingProfile, cookies.jls_sid ?? null, now);
    const profile: TrackingProfile = {
      anonymousId,
      sessionId: session.sessionId,
      sessionStartedAt: session.sessionStartedAt,
      sessionLastSeenAt: occurredAt,
      firstTouch: existingProfile?.firstTouch ?? currentTouch,
      lastTouch: isAttributionTouch(currentTouch, config.baseUrl)
        ? currentTouch
        : existingProfile?.lastTouch ?? currentTouch,
      lastPath: currentTouch.path,
    };

    await dependencies.store.saveProfile(profile);

    return {
      profile,
      cookies: buildTrackingCookies(config, profile),
      currentTouch,
    };
  }

  async function serveIndexHtml(request: Request, url: URL): Promise<Response> {
    const tracking = await resolveTracking(request, url);
    const event = createEvent({
      eventName: "page_viewed",
      occurredAt: tracking.currentTouch.occurredAt,
      path: tracking.currentTouch.path,
      referrer: tracking.currentTouch.referrer,
      utmSource: tracking.currentTouch.utmSource,
      utmMedium: tracking.currentTouch.utmMedium,
      utmCampaign: tracking.currentTouch.utmCampaign,
      utmContent: tracking.currentTouch.utmContent,
      anonymousId: tracking.profile.anonymousId,
      sessionId: tracking.profile.sessionId,
      properties: {
        route: url.pathname,
      },
    });

    await saveAndDispatchPostHog(event);

    const htmlResponse = await serveStaticFile(config.staticDir, "/index.html", request.method);
    if (!htmlResponse) {
      return jsonError(500, "index.html not found in static bundle");
    }

    return new Response(request.method === "HEAD" ? null : await htmlResponse.text(), {
      status: htmlResponse.status,
      headers: mergeCookieHeaders(htmlResponse.headers, tracking.cookies),
    });
  }

  async function handleTrackedRedirect(request: Request, url: URL): Promise<Response> {
    const target = url.pathname.replace(/^\/r\//, "");
    const destination = resolveRedirectTarget(config, target);
    if (!destination) {
      return jsonError(404, `Unknown redirect target: ${target}`);
    }

    const tracking = await resolveTracking(request, url);
    const placement = url.searchParams.get("placement");
    const assetId = assetIdForTarget(target, url);
    const ctaId = ctaIdForTarget(target);

    const clickEvent = createEvent({
      eventName: "cta_clicked",
      occurredAt: tracking.currentTouch.occurredAt,
      path: tracking.currentTouch.path,
      referrer: tracking.currentTouch.referrer,
      utmSource: tracking.currentTouch.utmSource,
      utmMedium: tracking.currentTouch.utmMedium,
      utmCampaign: tracking.currentTouch.utmCampaign,
      utmContent: tracking.currentTouch.utmContent,
      anonymousId: tracking.profile.anonymousId,
      sessionId: tracking.profile.sessionId,
      ctaId,
      ctaPlacement: placement,
      assetId,
      properties: {
        redirect_target: target,
      },
    });

    const redirectEvent = createEvent({
      eventName: specificRedirectEvent(target),
      occurredAt: tracking.currentTouch.occurredAt,
      path: tracking.currentTouch.path,
      referrer: tracking.currentTouch.referrer,
      utmSource: tracking.currentTouch.utmSource,
      utmMedium: tracking.currentTouch.utmMedium,
      utmCampaign: tracking.currentTouch.utmCampaign,
      utmContent: tracking.currentTouch.utmContent,
      anonymousId: tracking.profile.anonymousId,
      sessionId: tracking.profile.sessionId,
      ctaId,
      ctaPlacement: placement,
      assetId,
      properties: {
        redirect_destination: destination.toString(),
      },
    });

    await saveAndDispatchPostHog(clickEvent);
    await saveAndDispatchPostHog(redirectEvent);

    const trackingToken = createTrackingToken(
      {
        version: 1,
        anonymousId: tracking.profile.anonymousId,
        sessionId: tracking.profile.sessionId,
        firstTouch: tracking.profile.firstTouch,
        lastTouch: tracking.profile.lastTouch,
        ctaId,
        ctaPlacement: placement,
        assetId,
        issuedAt: tracking.currentTouch.occurredAt,
      },
      config.trackingSecret,
    );

    const redirectUrl = appendTrackingParameters(destination, trackingToken, tracking.profile.lastTouch, {
      placement,
      asset: assetId,
    });

    const headers = new Headers({
      Location: redirectUrl.toString(),
      "Cache-Control": "no-store",
    });

    return new Response(null, {
      status: 302,
      headers: mergeCookieHeaders(headers, tracking.cookies),
    });
  }

  async function handleCalcomWebhook(request: Request): Promise<Response> {
    const rawBody = await readRawBody(request);
    if (
      config.nodeEnv === "production" &&
      !verifyRawBodySignature(rawBody, config.calcomWebhookSecret ?? "", request.headers.get("x-cal-signature-256"), "hex")
    ) {
      return jsonError(401, "Invalid Cal.com webhook signature");
    }

    const payload = JSON.parse(rawBody) as Record<string, any>;
    const triggerEvent = String(payload.triggerEvent ?? "");
    if (!["BOOKING_CREATED", "BOOKING_PAID", "BOOKING_REQUESTED"].includes(triggerEvent)) {
      return jsonResponse({ ok: true, ignored: triggerEvent }, { status: 202 });
    }

    const token = verifyTrackingToken(extractCalcomToken(payload) ?? "", config.trackingSecret);
    const occurredAt = payload.createdAt ?? nowIso(clock());
    const touch = buildWebhookTouch(token, "/r/discovery-call", occurredAt);
    const email = normalizeEmail(extractCalcomEmail(payload));
    if (!email) {
      return jsonError(400, "Unable to resolve attendee email from Cal.com payload");
    }

    const bookedEvent = createEvent({
      eventName: "calendar_booked",
      occurredAt,
      path: touch.path,
      referrer: touch.referrer,
      utmSource: touch.utmSource,
      utmMedium: touch.utmMedium,
      utmCampaign: touch.utmCampaign,
      utmContent: touch.utmContent,
      anonymousId: token?.anonymousId ?? null,
      sessionId: token?.sessionId ?? null,
      ctaId: token?.ctaId ?? "schedule_discovery_call",
      ctaPlacement: token?.ctaPlacement ?? null,
      assetId: token?.assetId ?? null,
      contactEmail: email,
      properties: {
        calcom_trigger_event: triggerEvent,
        booking_uid: payload.payload?.uid ?? payload.uid ?? null,
      },
    });

    const identifyEvent = createEvent({
      eventName: "contact_identified",
      occurredAt,
      path: touch.path,
      referrer: touch.referrer,
      utmSource: touch.utmSource,
      utmMedium: touch.utmMedium,
      utmCampaign: touch.utmCampaign,
      utmContent: touch.utmContent,
      anonymousId: token?.anonymousId ?? null,
      sessionId: token?.sessionId ?? null,
      ctaId: token?.ctaId ?? "schedule_discovery_call",
      ctaPlacement: token?.ctaPlacement ?? null,
      assetId: token?.assetId ?? null,
      contactEmail: email,
      properties: {
        source: "calcom",
      },
    });

    await saveAndDispatchPostHog(bookedEvent);
    await saveAndDispatchPostHog(identifyEvent);

    await saveAndDispatchHubSpot({
      relatedEventId: bookedEvent.eventId,
      contactEmail: email,
      anonymousId: token?.anonymousId ?? null,
      firstTouch: token?.firstTouch ?? null,
      lastTouch: token?.lastTouch ?? null,
      latestLeadAsset: token?.assetId ?? null,
      latestCtaId: token?.ctaId ?? "schedule_discovery_call",
      latestCtaPlacement: token?.ctaPlacement ?? null,
    });

    return jsonResponse({ ok: true }, { status: 202 });
  }

  async function handleTallyWebhook(request: Request): Promise<Response> {
    const rawBody = await readRawBody(request);
    if (
      config.nodeEnv === "production" &&
      !verifyRawBodySignature(rawBody, config.tallyWebhookSecret ?? "", request.headers.get("Tally-Signature"), "base64")
    ) {
      return jsonError(401, "Invalid Tally webhook signature");
    }

    const payload = JSON.parse(rawBody) as Record<string, any>;
    const email = normalizeEmail(extractTallyEmail(payload));
    if (!email) {
      return jsonError(400, "Unable to resolve respondent email from Tally payload");
    }

    const token = verifyTrackingToken(extractTallyFieldValue(payload, "jls_tracking") ?? "", config.trackingSecret);
    const occurredAt = payload.createdAt ?? nowIso(clock());
    const touch = buildWebhookTouch(token, "/r/lead-magnet", occurredAt);
    const assetId =
      extractTallyFieldValue(payload, "asset") ??
      extractTallyFieldValue(payload, "lead_asset") ??
      token?.assetId ??
      payload.data?.formId ??
      null;

    const capturedEvent = createEvent({
      eventName: "lead_captured",
      occurredAt,
      path: touch.path,
      referrer: touch.referrer,
      utmSource: touch.utmSource,
      utmMedium: touch.utmMedium,
      utmCampaign: touch.utmCampaign,
      utmContent: touch.utmContent,
      anonymousId: token?.anonymousId ?? null,
      sessionId: token?.sessionId ?? null,
      ctaId: token?.ctaId ?? "lead_magnet",
      ctaPlacement: token?.ctaPlacement ?? null,
      assetId,
      contactEmail: email,
      properties: {
        tally_event_id: payload.eventId ?? null,
        form_id: payload.data?.formId ?? null,
      },
    });

    const identifyEvent = createEvent({
      eventName: "contact_identified",
      occurredAt,
      path: touch.path,
      referrer: touch.referrer,
      utmSource: touch.utmSource,
      utmMedium: touch.utmMedium,
      utmCampaign: touch.utmCampaign,
      utmContent: touch.utmContent,
      anonymousId: token?.anonymousId ?? null,
      sessionId: token?.sessionId ?? null,
      ctaId: token?.ctaId ?? "lead_magnet",
      ctaPlacement: token?.ctaPlacement ?? null,
      assetId,
      contactEmail: email,
      properties: {
        source: "tally",
      },
    });

    await saveAndDispatchPostHog(capturedEvent);
    await saveAndDispatchPostHog(identifyEvent);

    await saveAndDispatchHubSpot({
      relatedEventId: capturedEvent.eventId,
      contactEmail: email,
      anonymousId: token?.anonymousId ?? null,
      firstTouch: token?.firstTouch ?? null,
      lastTouch: token?.lastTouch ?? null,
      latestLeadAsset: assetId,
      latestCtaId: token?.ctaId ?? "lead_magnet",
      latestCtaPlacement: token?.ctaPlacement ?? null,
    });

    return jsonResponse({ ok: true }, { status: 202 });
  }

  async function handlePostHogDelivery(request: Request): Promise<Response> {
    if (!isAuthorized(request, config)) {
      return jsonError(401, "Unauthorized");
    }

    const payload = (await request.json()) as PostHogTaskPayload;
    await dependencies.posthog.capture(payload.event);
    await dependencies.store.updateEventDelivery(payload.event.eventId, {
      posthogStatus: "sent",
      lastError: null,
      updatedAt: nowIso(clock()),
    });
    return jsonResponse({ ok: true });
  }

  async function handleHubSpotUpsert(request: Request): Promise<Response> {
    if (!isAuthorized(request, config)) {
      return jsonError(401, "Unauthorized");
    }

    const payload = (await request.json()) as HubSpotUpsertTaskPayload;
    const hubspotContactId = await dependencies.hubspot.upsertContact(payload);
    const existing = await dependencies.store.getContact(payload.contactEmail);
    await dependencies.store.saveContact(
      mergeContact(existing, {
        email: payload.contactEmail,
        anonymousId: payload.anonymousId,
        hubspotContactId,
        createdAt: nowIso(clock()),
        updatedAt: nowIso(clock()),
        firstTouch: payload.firstTouch,
        lastTouch: payload.lastTouch,
        latestLeadAsset: payload.latestLeadAsset,
        latestCtaId: payload.latestCtaId,
        latestCtaPlacement: payload.latestCtaPlacement,
      }),
    );
    await dependencies.store.updateEventDelivery(payload.relatedEventId, {
      hubspotStatus: "sent",
      lastError: null,
      updatedAt: nowIso(clock()),
    });
    return jsonResponse({ ok: true, hubspotContactId });
  }

  async function handleHubSpotSync(request: Request): Promise<Response> {
    if (!isAuthorized(request, config)) {
      return jsonError(401, "Unauthorized");
    }

    const body = request.headers.get("content-length") === "0" ? {} : ((await request.json()) as Record<string, string>);
    const existingCursor = await dependencies.store.getCursor("hubspot:deals:lastSyncedAt");
    const since = body.since ?? existingCursor ?? new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const deals = await dependencies.hubspot.searchDealsUpdatedSince(since);

    let latestCursor = since;
    let syncedCount = 0;

    for (const deal of deals) {
      const eventName = mapDealStageToEvent(deal.dealStage, config.hubspotStageEventMap);
      if (!eventName) {
        if (new Date(deal.updatedAt).getTime() > new Date(latestCursor).getTime()) {
          latestCursor = deal.updatedAt;
        }
        continue;
      }

      const event = createEvent({
        eventName,
        occurredAt: deal.updatedAt,
        path: "/internal/sync/hubspot",
        hubspotDealId: deal.id,
        dealStage: deal.dealStage,
        properties: {
          hubspot_properties: deal.properties,
        },
      });

      await saveAndDispatchPostHog(event);
      syncedCount += 1;

      if (new Date(deal.updatedAt).getTime() > new Date(latestCursor).getTime()) {
        latestCursor = deal.updatedAt;
      }
    }

    const nextCursor = new Date(new Date(latestCursor).getTime() + 1).toISOString();
    await dependencies.store.setCursor("hubspot:deals:lastSyncedAt", nextCursor);

    return jsonResponse({
      ok: true,
      since,
      nextCursor,
      dealCount: deals.length,
      syncedCount,
    });
  }

  // ── LinkedIn Publishing ──

  async function linkedinApiFetch(path: string, options: RequestInit): Promise<Response> {
    if (!config.linkedinAccessToken) {
      throw new Error("LINKEDIN_ACCESS_TOKEN not configured");
    }
    const headers = new Headers(options.headers);
    headers.set("Authorization", `Bearer ${config.linkedinAccessToken}`);
    if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");
    return fetch(`https://api.linkedin.com${path}`, { ...options, headers });
  }

  async function linkedinCreatePost(text: string, visibility: string): Promise<{ postUrn: string; activityUrn: string }> {
    const personUrn = config.linkedinPersonUrn ?? "urn:li:person:mvKbumetTz";
    const payload = {
      author: personUrn,
      commentary: text,
      visibility,
      distribution: { feedDistribution: "MAIN_FEED", targetEntities: [], thirdPartyDistributionChannels: [] },
      lifecycleState: "PUBLISHED",
    };
    const res = await linkedinApiFetch("/rest/posts", {
      method: "POST",
      headers: { "LinkedIn-Version": "202601", "X-Restli-Protocol-Version": "2.0.0" },
      body: JSON.stringify(payload),
    });
    if (res.status !== 201) {
      const body = await res.text();
      throw new Error(`LinkedIn post failed (${res.status}): ${body}`);
    }
    const postUrn = res.headers.get("x-restli-id") ?? "";
    const activityUrn = postUrn.replace("urn:li:share:", "urn:li:activity:");
    return { postUrn, activityUrn };
  }

  async function linkedinCreateComment(activityUrn: string, text: string): Promise<string> {
    const personUrn = config.linkedinPersonUrn ?? "urn:li:person:mvKbumetTz";
    const encodedUrn = encodeURIComponent(activityUrn);
    const res = await linkedinApiFetch(`/v2/socialActions/${encodedUrn}/comments`, {
      method: "POST",
      body: JSON.stringify({ actor: personUrn, message: { text } }),
    });
    if (res.status !== 201) {
      const body = await res.text();
      throw new Error(`LinkedIn comment failed (${res.status}): ${body}`);
    }
    const result = (await res.json()) as { id?: string };
    return result.id ?? "unknown";
  }

  async function handleLinkedInPublish(request: Request): Promise<Response> {
    if (request.method !== "POST") return jsonError(405, "Method not allowed");
    const bearer = extractBearerToken(request);
    if (bearer !== config.internalApiToken) return jsonError(401, "Unauthorized");
    if (!config.linkedinAccessToken) return jsonError(503, "LINKEDIN_ACCESS_TOKEN not configured");

    // Read all queued items from Firestore
    const snapshot = await (dependencies.store as FirestoreTrackingStore).firestore
      .collection("linkedin_queue")
      .where("status", "==", "queued")
      .where("scheduledAt", "<=", clock().toISOString())
      .orderBy("scheduledAt", "asc")
      .limit(5)
      .get();

    if (snapshot.empty) {
      return jsonResponse({ ok: true, published: 0, message: "No queued posts ready" });
    }

    const results: Array<{ id: string; status: string; postUrn?: string; error?: string }> = [];

    for (const doc of snapshot.docs) {
      const item = doc.data() as import("./types.js").LinkedInQueueItem;
      try {
        // Create the post
        const { postUrn, activityUrn } = await linkedinCreatePost(item.postText, item.visibility || "PUBLIC");

        // Update the document with postUrn
        await doc.ref.update({
          status: "posted",
          postUrn,
          activityUrn,
          updatedAt: clock().toISOString(),
        });

        // If there's a comment, dispatch it as a delayed Cloud Task (5 min)
        if (item.commentText && dependencies.dispatcher.enabled) {
          await dependencies.dispatcher.dispatch("/internal/linkedin/comment", {
            queueItemId: doc.id,
            activityUrn,
            commentText: item.commentText,
          });
        } else if (item.commentText) {
          // No Cloud Tasks available — comment immediately
          const commentId = await linkedinCreateComment(activityUrn, item.commentText);
          await doc.ref.update({ status: "commented", updatedAt: clock().toISOString() });
          console.log(`[LinkedIn] Commented immediately: ${commentId}`);
        }

        results.push({ id: doc.id, status: "posted", postUrn });
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        console.error(`[LinkedIn] Failed to publish ${doc.id}:`, errorMsg);
        await doc.ref.update({ status: "failed", error: errorMsg, updatedAt: clock().toISOString() });
        results.push({ id: doc.id, status: "failed", error: errorMsg });
      }
    }

    return jsonResponse({ ok: true, published: results.filter((r) => r.status === "posted").length, results });
  }

  async function handleLinkedInComment(request: Request): Promise<Response> {
    if (request.method !== "POST") return jsonError(405, "Method not allowed");
    const bearer = extractBearerToken(request);
    if (bearer !== config.internalApiToken) return jsonError(401, "Unauthorized");
    if (!config.linkedinAccessToken) return jsonError(503, "LINKEDIN_ACCESS_TOKEN not configured");

    const raw = await readRawBody(request);
    const payload = JSON.parse(raw) as { queueItemId: string; activityUrn: string; commentText: string };

    try {
      const commentId = await linkedinCreateComment(payload.activityUrn, payload.commentText);

      // Update Firestore status
      await (dependencies.store as FirestoreTrackingStore).firestore
        .collection("linkedin_queue")
        .doc(payload.queueItemId)
        .update({ status: "commented", updatedAt: clock().toISOString() });

      return jsonResponse({ ok: true, commentId });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.error(`[LinkedIn] Comment failed for ${payload.queueItemId}:`, errorMsg);

      await (dependencies.store as FirestoreTrackingStore).firestore
        .collection("linkedin_queue")
        .doc(payload.queueItemId)
        .update({ status: "failed", error: `Comment failed: ${errorMsg}`, updatedAt: clock().toISOString() });

      return jsonError(500, errorMsg);
    }
  }

  async function handleLinkedInQueue(request: Request): Promise<Response> {
    if (request.method !== "POST") return jsonError(405, "Method not allowed");
    const bearer = extractBearerToken(request);
    if (bearer !== config.internalApiToken) return jsonError(401, "Unauthorized");

    const raw = await readRawBody(request);
    const body = JSON.parse(raw) as {
      posts: Array<{
        scheduledAt: string;
        postText: string;
        commentText?: string;
        visibility?: string;
      }>;
    };

    if (!body.posts || !Array.isArray(body.posts) || body.posts.length === 0) {
      return jsonError(400, "Missing or empty posts array");
    }

    const store = (dependencies.store as FirestoreTrackingStore).firestore;
    const batch = store.batch();
    const ids: string[] = [];

    for (const post of body.posts) {
      const id = randomUUID();
      const ref = store.collection("linkedin_queue").doc(id);
      const item: import("./types.js").LinkedInQueueItem = {
        id,
        scheduledAt: post.scheduledAt,
        postText: post.postText,
        commentText: post.commentText ?? null,
        visibility: post.visibility ?? "PUBLIC",
        status: "queued",
        postUrn: null,
        activityUrn: null,
        error: null,
        createdAt: clock().toISOString(),
        updatedAt: clock().toISOString(),
      };
      batch.set(ref, item);
      ids.push(id);
    }

    await batch.commit();
    return jsonResponse({ ok: true, queued: ids.length, ids }, { status: 201 });
  }

  async function handleRequest(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/healthz" || url.pathname === "/health") {
      return jsonResponse({ status: "ok", service: "jonathanlynshue-site" });
    }

    if (url.pathname === "/r/experiment-exposure") {
      const experiment = url.searchParams.get("experiment");
      const variation = url.searchParams.get("variation");
      if (!experiment || !variation) {
        return jsonError(400, "Missing experiment or variation param");
      }

      const cookies = parseCookies(request.headers.get("cookie"));
      const distinctId = cookies.jls_aid ?? "anonymous";
      const occurredAt = clock().toISOString();

      const event = createEvent({
        eventName: "experiment_exposed",
        occurredAt,
        path: url.pathname,
        anonymousId: distinctId !== "anonymous" ? distinctId : null,
        properties: { experiment, variation },
      });

      await dependencies.store.saveEvent(event);
      await dependencies.posthog.capture(event);

      return new Response(null, { status: 204 });
    }

    if (url.pathname.startsWith("/r/")) {
      return handleTrackedRedirect(request, url);
    }

    if (url.pathname === "/webhooks/calcom") {
      return handleCalcomWebhook(request);
    }

    if (url.pathname === "/webhooks/tally") {
      return handleTallyWebhook(request);
    }

    if (url.pathname === "/internal/tasks/posthog-delivery") {
      return handlePostHogDelivery(request);
    }

    if (url.pathname === "/internal/tasks/hubspot-upsert") {
      return handleHubSpotUpsert(request);
    }

    if (url.pathname === "/internal/sync/hubspot") {
      return handleHubSpotSync(request);
    }

    if (url.pathname === "/internal/linkedin/publish") {
      return handleLinkedInPublish(request);
    }

    if (url.pathname === "/internal/linkedin/comment") {
      return handleLinkedInComment(request);
    }

    if (url.pathname === "/internal/linkedin/queue") {
      return handleLinkedInQueue(request);
    }

    const staticResponse = await serveStaticFile(config.staticDir, url.pathname, request.method);
    if (staticResponse) {
      return staticResponse;
    }

    if (isHtmlNavigationRequest(request, url)) {
      return serveIndexHtml(request, url);
    }

    return jsonError(404, `No route matched ${url.pathname}`);
  }

  return {
    handleRequest,
  };
}
