# jonathanlynshue.com

Personal website and executive workflow business platform for Jonathan Lyn-Shue.

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
