# API Reference

Base URL: configured via `BASE_URL` environment variable (default `http://localhost:8080`).

---

## Health Check

### `GET /health`

### `GET /healthz`

Simple liveness probe. No authentication required.

**Response**

- Status: `200`
- Body:

```json
{
  "status": "ok",
  "service": "jonathanlynshue-site"
}
```

**Example**

```bash
curl https://jonathanlynshue.com/healthz
```

---

## Tracked Redirects

All redirect routes resolve first-party tracking (cookies `jls_aid`, `jls_sid`), record analytics events, and issue a `302` redirect to the configured destination URL with a signed tracking token appended.

### `GET /r/discovery-call`

Redirects to the URL configured in `DISCOVERY_CALL_URL` (e.g. a Cal.com scheduling page).

**Events emitted:** `cta_clicked`, `calendar_redirected`

| Query Param    | Description                                  |
| -------------- | -------------------------------------------- |
| `placement`    | Identifies where the CTA was rendered        |
| `utm_source`   | UTM source parameter (attribution)           |
| `utm_medium`   | UTM medium parameter (attribution)           |
| `utm_campaign` | UTM campaign parameter (attribution)         |
| `utm_content`  | UTM content parameter (attribution)          |

**Cookies set**

| Cookie    | Max-Age   | Purpose                |
| --------- | --------- | ---------------------- |
| `jls_aid` | 1 year    | Anonymous visitor ID   |
| `jls_sid` | 30 min    | Session ID             |

**Response**

- Status: `302`
- `Location` header: destination URL with `jls_tracking`, UTM, `placement`, and `asset` query parameters appended.
- `Cache-Control: no-store`

**Auth:** None

**Example**

```bash
curl -v 'https://jonathanlynshue.com/r/discovery-call?placement=hero&utm_source=linkedin'
```

---

### `GET /r/lead-magnet`

Redirects to the URL configured in `LEAD_MAGNET_URL` (e.g. a Tally form).

**Events emitted:** `cta_clicked`, `lead_magnet_redirected`

| Query Param    | Description                                          |
| -------------- | ---------------------------------------------------- |
| `placement`    | Identifies where the CTA was rendered                |
| `asset`        | Lead-magnet asset identifier (default `workflow-audit`) |
| `utm_source`   | UTM source parameter (attribution)                   |
| `utm_medium`   | UTM medium parameter (attribution)                   |
| `utm_campaign` | UTM campaign parameter (attribution)                 |
| `utm_content`  | UTM content parameter (attribution)                  |

**Cookies set:** Same as `/r/discovery-call`.

**Response**

- Status: `302`
- `Location` header: destination URL with tracking parameters appended.
- `Cache-Control: no-store`

**Auth:** None

**Example**

```bash
curl -v 'https://jonathanlynshue.com/r/lead-magnet?asset=workflow-audit&placement=footer'
```

---

### Unknown redirect targets

Any `GET /r/<unknown>` where the target is not `discovery-call` or `lead-magnet` (or the corresponding URL is not configured) returns:

- Status: `404`
- Body:

```json
{
  "error": "Unknown redirect target: <target>"
}
```

---

## Webhooks

### `POST /webhooks/calcom`

Receives Cal.com booking webhooks. In production, the request body signature is verified.

**Auth:** `X-Cal-Signature-256` header — HMAC-SHA256 hex digest of the raw request body, signed with `CALCOM_WEBHOOK_SECRET`.

**Body:** Cal.com webhook payload (JSON). Relevant fields:

| Field                          | Description                                |
| ------------------------------ | ------------------------------------------ |
| `triggerEvent`                 | Must be `BOOKING_CREATED`, `BOOKING_PAID`, or `BOOKING_REQUESTED` (others are ignored with `202`) |
| `createdAt`                    | ISO-8601 timestamp of the booking          |
| `payload.attendees[].email`    | Attendee email (used for contact identification) |
| `payload.responses.jls_tracking.value` | Signed tracking token from the redirect flow |
| `payload.uid`                  | Booking UID (stored in event properties)   |

**Behavior:**

1. Verifies signature (production only).
2. Extracts email and tracking token from the payload.
3. Emits `calendar_booked` and `contact_identified` events to PostHog.
4. Upserts the contact in HubSpot with attribution data from the tracking token.

**Response**

| Status | Condition                        | Body                                      |
| ------ | -------------------------------- | ----------------------------------------- |
| `202`  | Success                          | `{"ok": true}`                            |
| `202`  | Ignored trigger event            | `{"ok": true, "ignored": "<triggerEvent>"}` |
| `400`  | Missing attendee email           | `{"error": "Unable to resolve attendee email from Cal.com payload"}` |
| `401`  | Invalid signature (production)   | `{"error": "Invalid Cal.com webhook signature"}` |

**Example**

```bash
curl -X POST https://jonathanlynshue.com/webhooks/calcom \
  -H "Content-Type: application/json" \
  -H "X-Cal-Signature-256: <hmac-hex-digest>" \
  -d '{
    "triggerEvent": "BOOKING_CREATED",
    "createdAt": "2026-04-20T12:00:00.000Z",
    "payload": {
      "uid": "booking-123",
      "attendees": [{"email": "user@example.com"}],
      "responses": {
        "jls_tracking": {"value": "<signed-token>"}
      }
    }
  }'
```

---

### `POST /webhooks/tally`

Receives Tally form-response webhooks. In production, the request body signature is verified.

**Auth:** `Tally-Signature` header — HMAC-SHA256 base64 digest of the raw request body, signed with `TALLY_WEBHOOK_SECRET`.

**Body:** Tally webhook payload (JSON). Relevant fields:

| Field                    | Description                                          |
| ------------------------ | ---------------------------------------------------- |
| `eventId`                | Tally event ID (stored in event properties)          |
| `createdAt`              | ISO-8601 timestamp                                   |
| `data.formId`            | Tally form ID (fallback asset identifier)            |
| `data.fields[]`          | Array of form fields                                 |
| `data.fields[].label`    | Field label — looks for `"Email"` to extract email   |
| `data.fields[].key`      | Field key — looks for `"jls_tracking"`, `"asset"`, or `"lead_asset"` |
| `data.fields[].value`    | Field value                                          |

**Behavior:**

1. Verifies signature (production only).
2. Extracts respondent email and hidden `jls_tracking` field from the payload.
3. Resolves the asset ID from fields (`asset` → `lead_asset` → token → `formId`).
4. Emits `lead_captured` and `contact_identified` events to PostHog.
5. Upserts the contact in HubSpot with attribution data.

**Response**

| Status | Condition                        | Body                                      |
| ------ | -------------------------------- | ----------------------------------------- |
| `202`  | Success                          | `{"ok": true}`                            |
| `400`  | Missing respondent email         | `{"error": "Unable to resolve respondent email from Tally payload"}` |
| `401`  | Invalid signature (production)   | `{"error": "Invalid Tally webhook signature"}` |

**Example**

```bash
curl -X POST https://jonathanlynshue.com/webhooks/tally \
  -H "Content-Type: application/json" \
  -H "Tally-Signature: <hmac-base64-digest>" \
  -d '{
    "eventId": "evt_abc123",
    "createdAt": "2026-04-20T12:00:00.000Z",
    "data": {
      "formId": "form_xyz",
      "fields": [
        {"label": "Email", "key": "question_email", "value": "user@example.com"},
        {"label": "Tracking", "key": "jls_tracking", "value": "<signed-token>"},
        {"label": "Asset", "key": "asset", "value": "workflow-audit"}
      ]
    }
  }'
```

---

## Internal Task Endpoints

All internal endpoints require a bearer token matching the `INTERNAL_API_TOKEN` environment variable.

**Auth:** `Authorization: Bearer <INTERNAL_API_TOKEN>`

Unauthorized requests receive:

- Status: `401`
- Body: `{"error": "Unauthorized"}`

---

### `POST /internal/tasks/posthog-delivery`

Delivers a previously-queued event to PostHog. Called by Cloud Tasks or inline when the dispatcher is unavailable.

**Body:** JSON — `PostHogTaskPayload`

```json
{
  "event": {
    "eventId": "uuid",
    "eventName": "page_viewed",
    "occurredAt": "2026-04-20T12:00:00.000Z",
    "anonymousId": "uuid",
    "sessionId": "uuid",
    "path": "/",
    "referrer": null,
    "utmSource": null,
    "utmMedium": null,
    "utmCampaign": null,
    "utmContent": null,
    "contactEmail": null,
    "ctaId": null,
    "ctaPlacement": null,
    "assetId": null,
    "properties": {}
  }
}
```

**Behavior:**

1. Calls the PostHog capture API with the event.
2. Updates the event's delivery status to `posthogStatus: "sent"` in the store.

**Response**

- Status: `200`
- Body: `{"ok": true}`

**Example**

```bash
curl -X POST https://jonathanlynshue.com/internal/tasks/posthog-delivery \
  -H "Authorization: Bearer $INTERNAL_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "event": {
      "eventId": "550e8400-e29b-41d4-a716-446655440000",
      "eventName": "page_viewed",
      "occurredAt": "2026-04-20T12:00:00.000Z",
      "anonymousId": "anon-123",
      "sessionId": "sess-456",
      "path": "/",
      "referrer": null,
      "utmSource": null,
      "utmMedium": null,
      "utmCampaign": null,
      "utmContent": null,
      "contactEmail": null,
      "ctaId": null,
      "ctaPlacement": null,
      "assetId": null,
      "properties": {"route": "/"}
    }
  }'
```

---

### `POST /internal/tasks/hubspot-upsert`

Upserts a contact in HubSpot and persists the result. Called by Cloud Tasks or inline.

**Body:** JSON — `HubSpotUpsertTaskPayload`

```json
{
  "relatedEventId": "uuid",
  "contactEmail": "user@example.com",
  "anonymousId": "uuid | null",
  "firstTouch": { "path": "/", "referrer": null, "utmSource": null, "utmMedium": null, "utmCampaign": null, "utmContent": null, "occurredAt": "..." },
  "lastTouch": null,
  "latestLeadAsset": "workflow-audit",
  "latestCtaId": "lead_magnet",
  "latestCtaPlacement": "hero"
}
```

**Behavior:**

1. Calls the HubSpot batch upsert API.
2. Merges the contact record in the store (preserves `firstTouch`, updates `lastTouch`, `latestLeadAsset`, `latestCtaId`, `latestCtaPlacement`).
3. Updates the event's delivery status to `hubspotStatus: "sent"`.

**Response**

- Status: `200`
- Body:

```json
{
  "ok": true,
  "hubspotContactId": "12345"
}
```

**Example**

```bash
curl -X POST https://jonathanlynshue.com/internal/tasks/hubspot-upsert \
  -H "Authorization: Bearer $INTERNAL_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "relatedEventId": "550e8400-e29b-41d4-a716-446655440000",
    "contactEmail": "user@example.com",
    "anonymousId": "anon-123",
    "firstTouch": null,
    "lastTouch": null,
    "latestLeadAsset": "workflow-audit",
    "latestCtaId": "lead_magnet",
    "latestCtaPlacement": "hero"
  }'
```

---

### `POST /internal/sync/hubspot`

Polls HubSpot for recently-updated deals, maps deal stages to event names via `HUBSPOT_STAGE_EVENT_MAP_JSON`, and emits corresponding PostHog events. Maintains a cursor in the store to avoid reprocessing.

**Body:** JSON (optional). Send `Content-Length: 0` for default behavior.

| Field   | Type   | Description                                                        |
| ------- | ------ | ------------------------------------------------------------------ |
| `since` | string | ISO-8601 timestamp override. Defaults to stored cursor, then 24 h ago. |

**Behavior:**

1. Reads the `hubspot:deals:lastSyncedAt` cursor from the store.
2. Fetches deals updated since the cursor (or `since` override, or 24 hours ago).
3. For each deal whose stage maps to an event name, emits the event to PostHog.
4. Advances the cursor to 1 ms after the latest deal's `updatedAt`.

**Response**

- Status: `200`
- Body:

```json
{
  "ok": true,
  "since": "2026-04-19T12:00:00.000Z",
  "nextCursor": "2026-04-20T12:00:00.001Z",
  "dealCount": 5,
  "syncedCount": 2
}
```

**Example (default cursor)**

```bash
curl -X POST https://jonathanlynshue.com/internal/sync/hubspot \
  -H "Authorization: Bearer $INTERNAL_API_TOKEN" \
  -H "Content-Length: 0"
```

**Example (explicit since)**

```bash
curl -X POST https://jonathanlynshue.com/internal/sync/hubspot \
  -H "Authorization: Bearer $INTERNAL_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"since": "2026-04-19T00:00:00.000Z"}'
```

---

## Static Assets & SPA Fallback

Any request that does not match the routes above is handled as follows:

1. **Static file lookup** — the server attempts to serve the file from `STATIC_DIR` matching the URL pathname.
2. **SPA fallback** — if no static file is found and the request looks like an HTML navigation (`GET`/`HEAD`, no static-file extension, not under `/r/`, `/webhooks/`, or `/internal/`), the server serves `index.html` from `STATIC_DIR`. This also resolves tracking (sets `jls_aid`/`jls_sid` cookies) and emits a `page_viewed` event.
3. **404** — otherwise returns:

```json
{
  "error": "No route matched /some/path"
}
```

**Example**

```bash
# Fetch a static asset
curl https://jonathanlynshue.com/assets/app.js

# SPA navigation (returns index.html with tracking cookies)
curl -v https://jonathanlynshue.com/about
```
