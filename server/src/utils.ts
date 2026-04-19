import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

import type {
  DeliveryStatus,
  EventName,
  NormalizedEvent,
  TouchPoint,
  TrackingProfile,
  TrackingTokenPayload,
} from "./types.js";

const THIRTY_MINUTES_MS = 30 * 60 * 1000;
const TEXT_ENCODER = new TextEncoder();
const STATIC_EXTENSIONS = new Set([
  ".css",
  ".gif",
  ".ico",
  ".jpeg",
  ".jpg",
  ".js",
  ".json",
  ".map",
  ".png",
  ".svg",
  ".txt",
  ".webp",
]);

const CONTENT_TYPES: Record<string, string> = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
};

export function createId(): string {
  return randomUUID();
}

export function nowIso(now: Date = new Date()): string {
  return now.toISOString();
}

export function getPathWithQuery(url: URL): string {
  return `${url.pathname}${url.search}`;
}

export function parseCookies(header: string | null): Record<string, string> {
  if (!header) {
    return {};
  }

  return header.split(";").reduce<Record<string, string>>((accumulator, entry) => {
    const [name, ...rest] = entry.trim().split("=");
    if (!name || rest.length === 0) {
      return accumulator;
    }
    accumulator[name] = decodeURIComponent(rest.join("="));
    return accumulator;
  }, {});
}

export function serializeCookie(
  name: string,
  value: string,
  options: {
    maxAge?: number;
    domain?: string | null;
    httpOnly?: boolean;
    sameSite?: "Lax" | "Strict" | "None";
    secure?: boolean;
    path?: string;
  } = {},
): string {
  const parts = [`${name}=${encodeURIComponent(value)}`];
  parts.push(`Path=${options.path ?? "/"}`);
  if (options.maxAge) {
    parts.push(`Max-Age=${options.maxAge}`);
  }
  if (options.domain) {
    parts.push(`Domain=${options.domain}`);
  }
  if (options.httpOnly ?? true) {
    parts.push("HttpOnly");
  }
  if (options.secure ?? true) {
    parts.push("Secure");
  }
  parts.push(`SameSite=${options.sameSite ?? "Lax"}`);
  return parts.join("; ");
}

export function parseTouchFromRequest(request: Request, url: URL, occurredAt: string): TouchPoint {
  const referrerHeader = request.headers.get("referer");
  return {
    path: getPathWithQuery(url),
    referrer: referrerHeader || null,
    utmSource: url.searchParams.get("utm_source"),
    utmMedium: url.searchParams.get("utm_medium"),
    utmCampaign: url.searchParams.get("utm_campaign"),
    utmContent: url.searchParams.get("utm_content"),
    occurredAt,
  };
}

export function isAttributionTouch(touch: TouchPoint, baseUrl: string): boolean {
  if (touch.utmSource || touch.utmMedium || touch.utmCampaign || touch.utmContent) {
    return true;
  }

  if (!touch.referrer) {
    return false;
  }

  try {
    const referrer = new URL(touch.referrer);
    const base = new URL(baseUrl);
    return referrer.host !== base.host;
  } catch {
    return true;
  }
}

export function resolveSessionId(
  existing: TrackingProfile | null,
  cookieSessionId: string | null,
  now: Date,
): { sessionId: string; sessionStartedAt: string } {
  if (!cookieSessionId || !existing) {
    return { sessionId: createId(), sessionStartedAt: now.toISOString() };
  }

  const elapsed = now.getTime() - new Date(existing.sessionLastSeenAt).getTime();
  if (Number.isNaN(elapsed) || elapsed > THIRTY_MINUTES_MS) {
    return { sessionId: createId(), sessionStartedAt: now.toISOString() };
  }

  return {
    sessionId: cookieSessionId,
    sessionStartedAt: existing.sessionStartedAt,
  };
}

export function createTrackingToken(payload: TrackingTokenPayload, secret: string): string {
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = createHmac("sha256", secret).update(encodedPayload).digest("base64url");
  return `${encodedPayload}.${signature}`;
}

export function verifyTrackingToken(token: string, secret: string): TrackingTokenPayload | null {
  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = createHmac("sha256", secret)
    .update(encodedPayload)
    .digest("base64url");

  const expected = TEXT_ENCODER.encode(expectedSignature);
  const received = TEXT_ENCODER.encode(signature);
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) {
    return null;
  }

  try {
    return JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8")) as TrackingTokenPayload;
  } catch {
    return null;
  }
}

export function verifyRawBodySignature(
  rawBody: string,
  secret: string,
  providedSignature: string | null,
  format: "hex" | "base64",
): boolean {
  if (!providedSignature) {
    return false;
  }

  const computedSignature = createHmac("sha256", secret).update(rawBody).digest(format);
  const expected = TEXT_ENCODER.encode(computedSignature);
  const received = TEXT_ENCODER.encode(providedSignature);
  if (expected.length !== received.length) {
    return false;
  }
  return timingSafeEqual(expected, received);
}

export function createEvent(params: {
  eventName: EventName;
  occurredAt: string;
  path: string;
  referrer?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  utmContent?: string | null;
  anonymousId?: string | null;
  sessionId?: string | null;
  ctaId?: string | null;
  ctaPlacement?: string | null;
  assetId?: string | null;
  contactEmail?: string | null;
  hubspotContactId?: string | null;
  hubspotDealId?: string | null;
  dealStage?: string | null;
  value?: number | null;
  properties?: Record<string, unknown>;
}): NormalizedEvent {
  const occurredAt = params.occurredAt;
  const delivery: DeliveryStatus = {
    posthogStatus: "pending",
    hubspotStatus: undefined,
    lastError: null,
    updatedAt: occurredAt,
  };

  return {
    eventId: createId(),
    eventName: params.eventName,
    occurredAt,
    anonymousId: params.anonymousId ?? null,
    sessionId: params.sessionId ?? null,
    path: params.path,
    referrer: params.referrer ?? null,
    utmSource: params.utmSource ?? null,
    utmMedium: params.utmMedium ?? null,
    utmCampaign: params.utmCampaign ?? null,
    utmContent: params.utmContent ?? null,
    ctaId: params.ctaId ?? null,
    ctaPlacement: params.ctaPlacement ?? null,
    assetId: params.assetId ?? null,
    contactEmail: params.contactEmail ?? null,
    hubspotContactId: params.hubspotContactId ?? null,
    hubspotDealId: params.hubspotDealId ?? null,
    dealStage: params.dealStage ?? null,
    value: params.value ?? null,
    properties: params.properties ?? {},
    delivery,
  };
}

export function mergeCookieHeaders(existing: Headers, cookies: string[]): Headers {
  const headers = new Headers(existing);
  for (const cookie of cookies) {
    headers.append("Set-Cookie", cookie);
  }
  return headers;
}

export function jsonResponse(body: unknown, init: ResponseInit = {}): Response {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json; charset=utf-8");
  return new Response(JSON.stringify(body), { ...init, headers });
}

export function isHtmlNavigationRequest(request: Request, url: URL): boolean {
  if (!["GET", "HEAD"].includes(request.method)) {
    return false;
  }
  if (url.pathname.startsWith("/r/") || url.pathname.startsWith("/webhooks/") || url.pathname.startsWith("/internal/")) {
    return false;
  }
  const ext = path.extname(url.pathname);
  if (STATIC_EXTENSIONS.has(ext)) {
    return false;
  }
  const accept = request.headers.get("accept") ?? "";
  return accept.includes("text/html") || accept.includes("*/*");
}

export function resolveStaticFilePath(staticDir: string, pathname: string): string | null {
  const normalizedPath = pathname === "/" ? "/index.html" : pathname;
  const resolvedPath = path.resolve(staticDir, `.${normalizedPath}`);
  const resolvedRoot = path.resolve(staticDir);
  if (!resolvedPath.startsWith(resolvedRoot)) {
    return null;
  }
  return resolvedPath;
}

export async function serveStaticFile(
  staticDir: string,
  pathname: string,
  method: string,
): Promise<Response | null> {
  const filePath = resolveStaticFilePath(staticDir, pathname);
  if (!filePath) {
    return null;
  }

  try {
    const stats = await fs.stat(filePath);
    if (!stats.isFile()) {
      return null;
    }
    const ext = path.extname(filePath);
    const headers = new Headers();
    headers.set("Content-Type", CONTENT_TYPES[ext] ?? "application/octet-stream");
    headers.set("Cache-Control", ext === ".html" ? "no-cache" : "public, max-age=31536000, immutable");
    if (method === "HEAD") {
      return new Response(null, { headers, status: 200 });
    }
    const data = await fs.readFile(filePath);
    return new Response(data, { headers, status: 200 });
  } catch {
    return null;
  }
}

export async function readRawBody(request: Request): Promise<string> {
  return request.text();
}

export function extractBearerToken(request: Request): string | null {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) {
    return null;
  }
  const [type, token] = authHeader.split(" ");
  if (type !== "Bearer" || !token) {
    return null;
  }
  return token;
}

export function extractCalcomToken(payload: Record<string, any>): string | null {
  const nestedPayload = payload.payload ?? payload;
  const responseValue = nestedPayload.responses?.jls_tracking?.value;
  if (typeof responseValue === "string" && responseValue) {
    return responseValue;
  }
  const customInputValue = nestedPayload.customInputs?.jls_tracking;
  if (typeof customInputValue === "string" && customInputValue) {
    return customInputValue;
  }
  const metadataValue = nestedPayload.metadata?.jls_tracking;
  if (typeof metadataValue === "string" && metadataValue) {
    return metadataValue;
  }
  return null;
}

export function extractCalcomEmail(payload: Record<string, any>): string | null {
  const nestedPayload = payload.payload ?? payload;
  const attendee = nestedPayload.attendees?.[0];
  if (typeof attendee?.email === "string") {
    return attendee.email.toLowerCase();
  }
  const responseEmail = nestedPayload.responses?.email?.value;
  if (typeof responseEmail === "string") {
    return responseEmail.toLowerCase();
  }
  return null;
}

export function extractTallyFieldValue(
  payload: Record<string, any>,
  label: string,
): string | null {
  const fields = payload.data?.fields;
  if (!Array.isArray(fields)) {
    return null;
  }
  const match = fields.find(
    (field) => field && typeof field.label === "string" && field.label.toLowerCase() === label.toLowerCase(),
  );
  if (!match) {
    return null;
  }
  if (typeof match.value === "string") {
    return match.value;
  }
  return null;
}

export function extractTallyEmail(payload: Record<string, any>): string | null {
  const fields = payload.data?.fields;
  if (!Array.isArray(fields)) {
    return null;
  }
  const emailField = fields.find(
    (field) =>
      field &&
      (field.type === "INPUT_EMAIL" ||
        (typeof field.label === "string" && field.label.toLowerCase() === "email")),
  );
  if (typeof emailField?.value === "string") {
    return emailField.value.toLowerCase();
  }
  return null;
}

export function appendTrackingParameters(
  destination: URL,
  trackingToken: string,
  touch: TouchPoint,
  extras: Record<string, string | null>,
): URL {
  destination.searchParams.set("jls_tracking", trackingToken);
  if (touch.utmSource) destination.searchParams.set("utm_source", touch.utmSource);
  if (touch.utmMedium) destination.searchParams.set("utm_medium", touch.utmMedium);
  if (touch.utmCampaign) destination.searchParams.set("utm_campaign", touch.utmCampaign);
  if (touch.utmContent) destination.searchParams.set("utm_content", touch.utmContent);

  for (const [key, value] of Object.entries(extras)) {
    if (value) {
      destination.searchParams.set(key, value);
    }
  }

  return destination;
}
