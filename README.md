# jonathanlynshue.com

[![Deploy Firebase Hosting + Cloud Run](https://github.com/jlynshue/jlynshue.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/jlynshue/jlynshue.github.io/actions/workflows/deploy.yml)

**Live:** [jonathanlynshue.com](https://jonathanlynshue.com)

Full-stack personal brand platform with server-side event tracking, webhook ingestion, and CRM automation. Built as a production-grade SPA backed by a Cloud Run API that handles first-party analytics, Cal.com/Tally webhook processing, and HubSpot deal pipeline sync.

## Architecture

```
Browser ─┬─► Firebase Hosting (React SPA, CDN-cached)
         │
         └─► Cloud Run API (Node.js, us-central1)
                 ├── /r/*            Tracked redirects (first-party cookies)
                 ├── /webhooks/*     HMAC-validated inbound (Cal.com, Tally)
                 ├── /internal/*     Cloud Tasks delivery endpoints
                 │
                 ├──► Firestore      Event store + contact records
                 ├──► Cloud Tasks    Async fan-out (event-delivery queue)
                 ├──► PostHog        Server-side analytics delivery
                 └──► HubSpot        Contact + deal pipeline sync
```

## Key Engineering Decisions

- **Cloud Run over Vercel/Netlify** — Server-side tracking requires long-lived HTTP handlers for webhook ingestion, HMAC validation, and durable queue dispatch. Cloud Run gives full control over request lifecycle with zero cold-start penalty at the traffic profile this site sees.

- **Firestore over PostgreSQL** — Event-sourced design (every page view, redirect, form submission stored as an immutable document). Serverless scale from zero, no connection pooling, no migrations, and Cloud Tasks delivery is idempotent with document-level transactions.

- **Custom first-party tracking over GA4** — Full data ownership with server-side event collection. No ad blockers strip the signal, no third-party cookies, and the same event stream feeds both PostHog (product analytics) and HubSpot (CRM attribution) via Cloud Tasks fan-out.

- **HMAC-SHA256 webhook validation** — Cal.com booking events and Tally form submissions are cryptographically verified before processing. Prevents spoofed events from polluting the CRM pipeline.

## Test Coverage

62 tests across 7 spec files covering the backend API layer (routes, dispatcher, repository, config, vendor integrations, utilities) and frontend utilities.

```bash
npm test             # Vitest — 62 tests
npm run typecheck    # Full TypeScript verification
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui |
| Backend | Node.js HTTP server (`server/src/app.ts`) |
| Database | Firestore (native mode) |
| Queue | Cloud Tasks (`event-delivery`) |
| Hosting | Firebase Hosting + Cloud Run (us-central1) |
| CI/CD | GitHub Actions + Workload Identity Federation |
| Tracking | Server-side only — PostHog + HubSpot via Cloud Tasks |
| Forms | Tally (webhook → `/webhooks/tally`) |
| Scheduling | Cal.com (webhook → `/webhooks/calcom`) |

## Local Development

```bash
npm install
npm run dev          # Vite dev server on :8080
npm run build:all    # Build client + server
npm test             # Vitest (62 tests)
npm run typecheck    # TypeScript check
```

## Server Routes

| Route | Method | Auth | Description |
|-------|--------|------|-------------|
| `/health` | GET | None | Health check — returns `{status: "ok"}` |
| `/healthz` | GET | None | Health check alias |
| `/r/discovery-call` | GET | None | Tracked redirect → Cal.com with first-party cookies |
| `/r/lead-magnet` | GET | None | Tracked redirect → Tally form |
| `/webhooks/calcom` | POST | HMAC-SHA256 | Cal.com booking events |
| `/webhooks/tally` | POST | HMAC-SHA256 | Tally form submissions |
| `/internal/tasks/*` | POST | Bearer token | Cloud Tasks delivery (PostHog, HubSpot) |
| `/internal/sync/hubspot` | POST | Bearer token | Scheduled HubSpot deal sync |
| `/*` | GET | None | SPA fallback (serves `index.html`) |

## Deployment

Push to `main` triggers GitHub Actions:
1. **verify** — `npm test` + `npm run typecheck` + `npm run build:all`
2. **production** — Deploy Cloud Run → Deploy Firebase Hosting

Pull requests get preview deploys with 7-day expiry.

## Project Structure

```
├── src/                  # React frontend (pages, components, hooks)
├── server/src/           # Node.js backend (app, config, types, vendors)
├── public/               # Static assets (logos, favicon, robots.txt)
├── docs/                 # Strategy docs, tickets, execution plans
├── .github/workflows/    # CI/CD pipeline
├── firebase.template.json # Hosting config with Cloud Run rewrites
└── Dockerfile            # Multi-stage Node 20 build
```

## Environment Variables

See `.env.example` for all required variables. Never commit real values.

## License

MIT
