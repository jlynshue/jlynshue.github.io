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

/**
 * Generates a new unique identifier using a random UUID.
 * @returns {string} A random UUID string.
 * @example
 * const id = createId(); // "a1b2c3d4-e5f6-..."
 */
export function createId(): string {
  return randomUUID();
}

/**
 * Returns the current (or provided) date as an ISO 8601 string.
 * @param {Date} now - The date to format (defaults to current time).
 * @returns {string} An ISO 8601 date string.
 * @example
 * nowIso(); // "2026-04-20T12:00:00.000Z"
 */
export function nowIso(now: Date = new Date()): string {
  return now.toISOString();
}

/**
 * Extracts the pathname and query string from a URL.
 * @param {URL} url - The URL to extract from.
 * @returns {string} The pathname concatenated with the search/query string.
 * @example
 * getPathWithQuery(new URL("https://example.com/page?q=1")); // "/page?q=1"
 */
export function getPathWithQuery(url: URL): string {
  return `${url.pathname}${url.search}`;
}

/**
 * Parses a Cookie header string into a key-value record.
 * @param {string | null} header - The raw Cookie header value.
 * @returns {Record<string, string>} A map of cookie names to decoded values.
 * @example
 * parseCookies("foo=bar; baz=qux"); // { foo: "bar", baz: "qux" }
 */
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

/**
 * Serializes a cookie name/value pair with options into a Set-Cookie header string.
 * @param {string} name - The cookie name.
 * @param {string} value - The cookie value.
 * @param {object} options - Optional cookie attributes (maxAge, domain, httpOnly, sameSite, secure, path).
 * @returns {string} A formatted Set-Cookie header string.
 * @example
 * serializeCookie("sid", "abc123", { maxAge: 3600 });
 */
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

/**
 * Builds a TouchPoint from the incoming request, URL, and timestamp.
 * @param {Request} request - The incoming HTTP request (used for the referer header).
 * @param {URL} url - The parsed request URL (used for path and UTM params).
 * @param {string} occurredAt - ISO 8601 timestamp of when the touch occurred.
 * @returns {TouchPoint} A populated touch point object.
 */
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

/**
 * Determines whether a touch point qualifies as an attribution touch (has UTM params or an external referrer).
 * @param {TouchPoint} touch - The touch point to evaluate.
 * @param {string} baseUrl - The site's base URL, used to distinguish internal vs external referrers.
 * @returns {boolean} True if the touch carries attribution data.
 */
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

/**
 * Resolves the session ID, creating a new session if none exists or the previous one has expired (30 min timeout).
 * @param {TrackingProfile | null} existing - The existing tracking profile, if any.
 * @param {string | null} cookieSessionId - The session ID from the cookie, if present.
 * @param {Date} now - The current timestamp.
 * @returns {{ sessionId: string; sessionStartedAt: string }} The resolved session ID and start time.
 */
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

/**
 * Creates an HMAC-signed tracking token from a payload.
 * @param {TrackingTokenPayload} payload - The data to encode in the token.
 * @param {string} secret - The HMAC secret key.
 * @returns {string} A base64url-encoded payload with an appended HMAC signature.
 * @example
 * createTrackingToken({ anonymousId: "abc", sessionId: "s1" }, "secret");
 */
export function createTrackingToken(payload: TrackingTokenPayload, secret: string): string {
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = createHmac("sha256", secret).update(encodedPayload).digest("base64url");
  return `${encodedPayload}.${signature}`;
}

/**
 * Verifies an HMAC-signed tracking token and returns the decoded payload if valid.
 * @param {string} token - The signed token string (payload.signature).
 * @param {string} secret - The HMAC secret key used to verify the signature.
 * @returns {TrackingTokenPayload | null} The decoded payload, or null if verification fails.
 */
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

/**
 * Verifies an HMAC signature over a raw request body using timing-safe comparison.
 * @param {string} rawBody - The raw request body string.
 * @param {string} secret - The HMAC secret key.
 * @param {string | null} providedSignature - The signature provided by the caller.
 * @param {"hex" | "base64"} format - The encoding format of the signature.
 * @returns {boolean} True if the signature is valid.
 */
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

/**
 * Creates a fully populated NormalizedEvent with a unique ID and pending delivery status.
 * @param {object} params - Event parameters including eventName, occurredAt, path, and optional attribution/contact fields.
 * @returns {NormalizedEvent} A new normalized event ready for storage and delivery.
 */
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

/**
 * Clones a Headers object and appends one or more Set-Cookie values.
 * @param {Headers} existing - The original response headers.
 * @param {string[]} cookies - Serialized Set-Cookie strings to append.
 * @returns {Headers} A new Headers instance with the cookies appended.
 */
export function mergeCookieHeaders(existing: Headers, cookies: string[]): Headers {
  const headers = new Headers(existing);
  for (const cookie of cookies) {
    headers.append("Set-Cookie", cookie);
  }
  return headers;
}

/**
 * Creates a JSON Response with the appropriate Content-Type header.
 * @param {unknown} body - The value to JSON-serialize as the response body.
 * @param {ResponseInit} init - Optional Response init options (status, headers, etc.).
 * @returns {Response} A Response with a JSON body and Content-Type set.
 * @example
 * jsonResponse({ ok: true }, { status: 200 });
 */
export function jsonResponse(body: unknown, init: ResponseInit = {}): Response {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json; charset=utf-8");
  return new Response(JSON.stringify(body), { ...init, headers });
}

/**
 * Determines whether a request is a browser HTML navigation (GET/HEAD for a non-static, non-API path accepting HTML).
 * @param {Request} request - The incoming HTTP request.
 * @param {URL} url - The parsed request URL.
 * @returns {boolean} True if the request should be served the SPA HTML shell.
 */
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

/**
 * Resolves a URL pathname to an absolute file path within the static directory, preventing path traversal.
 * @param {string} staticDir - The root directory for static files.
 * @param {string} pathname - The URL pathname to resolve.
 * @returns {string | null} The resolved absolute file path, or null if it escapes the static root.
 */
export function resolveStaticFilePath(staticDir: string, pathname: string): string | null {
  const normalizedPath = pathname === "/" ? "/index.html" : pathname;
  const resolvedPath = path.resolve(staticDir, `.${normalizedPath}`);
  const resolvedRoot = path.resolve(staticDir);
  if (!resolvedPath.startsWith(resolvedRoot)) {
    return null;
  }
  return resolvedPath;
}

/**
 * Attempts to serve a static file from disk, returning a Response with appropriate headers or null if not found.
 * @param {string} staticDir - The root directory for static files.
 * @param {string} pathname - The URL pathname of the requested file.
 * @param {string} method - The HTTP method (GET or HEAD).
 * @returns {Promise<Response | null>} A Response with the file contents, or null if the file doesn't exist.
 */
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

/**
 * Reads the full request body as a UTF-8 string.
 * @param {Request} request - The incoming HTTP request.
 * @returns {Promise<string>} The raw body text.
 */
export async function readRawBody(request: Request): Promise<string> {
  return request.text();
}

/**
 * Extracts a Bearer token from the Authorization header.
 * @param {Request} request - The incoming HTTP request.
 * @returns {string | null} The token string, or null if not present or malformed.
 */
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

/**
 * Extracts the jls_tracking token from a Cal.com webhook payload, checking responses, customInputs, and metadata.
 * @param {Record<string, any>} payload - The Cal.com webhook payload.
 * @returns {string | null} The tracking token, or null if not found.
 */
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

/**
 * Extracts the attendee email from a Cal.com webhook payload.
 * @param {Record<string, any>} payload - The Cal.com webhook payload.
 * @returns {string | null} The lowercase email, or null if not found.
 */
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

/**
 * Extracts a field value by label from a Tally form webhook payload.
 * @param {Record<string, any>} payload - The Tally webhook payload.
 * @param {string} label - The field label to search for (case-insensitive).
 * @returns {string | null} The field value, or null if not found.
 */
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

/**
 * Extracts the email address from a Tally form webhook payload (by type INPUT_EMAIL or label "email").
 * @param {Record<string, any>} payload - The Tally webhook payload.
 * @returns {string | null} The lowercase email, or null if not found.
 */
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

/**
 * Appends tracking parameters (token, UTM values, and extras) to a destination URL.
 * @param {URL} destination - The URL to append parameters to (mutated in place).
 * @param {string} trackingToken - The signed tracking token value.
 * @param {TouchPoint} touch - The touch point containing UTM parameters.
 * @param {Record<string, string | null>} extras - Additional key-value pairs to append (nulls are skipped).
 * @returns {URL} The mutated destination URL with parameters appended.
 */
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
