# Architecture

## System Diagram

```
┌─────────────────┐     ┌──────────────────────┐     ┌─────────────┐
│  Browser/Client │────▶│  Firebase Hosting     │────▶│  Cloud Run  │
│                 │     │  (CDN + custom domain)│     │  (backend)  │
└─────────────────┘     └──────────────────────┘     └──────┬──────┘
                                                            │
                         ┌──────────────────────────────────┼─────────────────┐
                         │                                  │                 │
                         ▼                                  ▼                 ▼
                  ┌─────────────┐                   ┌─────────────┐   ┌───────────┐
                  │  Firestore  │                   │ Cloud Tasks │   │  PostHog  │
                  │  (events,   │                   │ (async      │   │  (events) │
                  │   profiles, │                   │  delivery)  │   │           │
                  │   contacts) │                   └──────┬──────┘   └───────────┘
                  └─────────────┘                          │
                                                           ▼
                                                    ┌───────────┐
                                                    │  HubSpot  │
                                                    │  (CRM)    │
                                                    └───────────┘
```

## Request Flows

### Page View (SPA)
1. Browser requests any path
2. Firebase Hosting CDN serves cached static assets (`/assets/*`)
3. Non-asset paths rewrite to Cloud Run
4. Server sets first-party cookies (`jls_aid`, `jls_sid`), logs `page_viewed` event to Firestore
5. PostHog event delivered via Cloud Tasks (async)
6. Returns `index.html` for client-side routing

### CTA Redirect (`/r/discovery-call`)
1. User clicks CTA → `/r/discovery-call?placement=hero&utm_source=linkedin`
2. Server creates tracking token (signed JWT-like payload with attribution data)
3. Logs `cta_clicked` + `calendar_redirected` events
4. 302 redirects to Cal.com with `?jls_tracking=<token>` appended
5. Events dispatched to PostHog via Cloud Tasks

### Webhook (Cal.com / Tally)
1. Vendor sends POST to `/webhooks/calcom` or `/webhooks/tally`
2. Server verifies HMAC signature (rejects 401 if invalid)
3. Extracts data (booking info or form submission)
4. For Tally: decodes `jls_tracking` hidden field → links contact to attribution
5. Upserts contact in HubSpot, logs event to Firestore + PostHog

### Event Delivery Pipeline
1. Event created in Firestore with `delivery.posthogStatus: "pending"`
2. Cloud Tasks enqueues delivery task to `event-delivery` queue
3. Task fires POST to `/internal/tasks/posthog-delivery`
4. Server sends event to PostHog API, updates delivery status

## Deployment Pipeline

```
Push to main
    │
    ▼
GitHub Actions (.github/workflows/deploy.yml)
    │
    ├─▶ verify: npm test + typecheck + build:all
    │
    └─▶ production (after verify passes):
         ├─▶ Authenticate via Workload Identity Federation (keyless)
         ├─▶ Deploy source to Cloud Run (auto-builds via Cloud Build)
         ├─▶ Build web assets (npm run build)
         └─▶ Deploy Firebase Hosting (from dist/)
```

## Key Design Decisions

1. **Server-side tracking only** — No client-side analytics scripts. All measurement happens on the backend via first-party cookies and server events.
2. **First-party cookies** — `jls_aid` (anonymous ID) and `jls_sid` (session ID) set by the server on same domain. No third-party cookie dependency.
3. **Async event delivery** — Events write to Firestore immediately, then deliver to PostHog/HubSpot asynchronously via Cloud Tasks. Page responses are never blocked by vendor APIs.
4. **Workload Identity Federation** — GitHub Actions authenticates to GCP without stored service account keys. Uses OIDC token exchange.
5. **Firebase Hosting + Cloud Run rewrites** — Static assets served from CDN, dynamic routes proxy to Cloud Run. Single domain, no CORS issues.
