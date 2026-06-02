# CLAUDE.md

Guidance for Claude Code (claude.ai/code) working in this repository.

## What This Is

**jonathanlynshue.com** — personal website **+ executive-workflow lead-generation
platform** for Jonathan Lyn-Shue. A React SPA frontend with a Node.js backend that
does server-side tracking, tracked CTA redirects, and webhook ingestion.

Production: https://jonathanlynshue.com · Remote: `github.com/jlynshue/jlynshue.github.io`

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui (Radix), `react-router-dom` (SPA) |
| Backend | Node.js HTTP server (`server/src/app.ts`) |
| Database | Firestore (native mode) |
| Async | Cloud Tasks (`event-delivery` queue) |
| Hosting | Firebase Hosting (CDN + custom domain) + Cloud Run (us-central1) |
| CI/CD | GitHub Actions + Workload Identity Federation (keyless) |
| Tracking | Server-side only — PostHog + HubSpot via Cloud Tasks |
| Forms / Scheduling | Tally (webhook) · Cal.com (webhook) |

## Commands

```bash
npm install
npm run dev          # Vite dev server on :8080
npm run build        # Client build (alias: build:client)
npm run build:all    # Client + server (tsc -p tsconfig.server.json)
npm start            # Run built server (server/dist/index.js)
npm test             # Vitest (run mode) — ~62 tests
npm run typecheck    # tsc for app, node, and server configs
npm run format.fix   # Prettier --write .
```

> There is **no lint script** — Prettier handles formatting only.

## Project Structure

```
src/                     # React frontend
├── App.tsx              # Router: react-router-dom <Routes> (SPA)
├── main.tsx             # Entry
├── pages/               # Index, HowIWork, Sprint, Diagnostic, NotFound
├── components/          # Section components + components/ui/ (shadcn primitives)
├── hooks/  lib/  types/ # Hooks, utils (cn in lib/utils.ts), shared types
server/src/              # Node.js backend
├── app.ts               # HTTP server + routes
├── config.ts            # Env/config loading
├── repository.ts        # Firestore access (events, profiles, contacts)
├── dispatcher.ts        # Cloud Tasks event delivery
├── vendors.ts           # PostHog / HubSpot clients
├── utils.ts  types.ts
└── *.spec.ts            # Vitest tests colocated with sources
public/                  # Static assets (favicon, robots.txt, logos)
docs/                    # ARCHITECTURE, API-REFERENCE, deployment, strategy
.github/workflows/       # deploy.yml — verify + (preview|production)
firebase.template.json   # Hosting config w/ Cloud Run rewrites (rendered at deploy)
Dockerfile               # Multi-stage Node 20 build
```

## Routing

Routes are defined in `src/App.tsx` with `react-router-dom`:

```tsx
<Routes>
  <Route path="/" element={<Index />} />
  <Route path="/sprint" element={<Sprint />} />
  <Route path="/diagnostic" element={<Diagnostic />} />
  <Route path="/how-i-work" element={<HowIWork />} />
  {/* Keep custom routes ABOVE the catch-all */}
  <Route path="*" element={<NotFound />} />
</Routes>
```

Page components live in `src/pages/`. Styling uses Tailwind (tokens in
`tailwind.config.ts`), shadcn/ui components in `src/components/ui/`, and the `cn`
helper from `@/lib/utils` (clsx + tailwind-merge).

## Server Routes

Full contract in **`docs/API-REFERENCE.md`**. Summary:

| Route | Method | Auth | Purpose |
|-------|--------|------|---------|
| `/health`, `/healthz` | GET | none | Health check |
| `/r/discovery-call`, `/r/lead-magnet` | GET | none | Tracked redirects (Cal.com / Tally) |
| `/webhooks/calcom`, `/webhooks/tally` | POST | HMAC-SHA256 | Vendor events |
| `/internal/tasks/*`, `/internal/sync/hubspot` | POST | Bearer | Cloud Tasks delivery / sync |
| `/*` | GET | none | SPA fallback (serves `index.html` with tracking cookies) |

## Architecture & Deployment

- **Architecture** (system diagram, request flows, design decisions): `docs/ARCHITECTURE.md`.
- **Deploy:** push to `main` → GitHub Actions `verify` (`test` + `typecheck` +
  `build:all`) → `production` (deploy Cloud Run `jonathanlynshue-site-backend` +
  Firebase Hosting). PRs get preview Cloud Run services + Firebase preview channels
  (7-day expiry). Auth via Workload Identity Federation (no stored keys).
- **Multi-environment plan** (dev/uat/prod target state): see the vault project
  folder `10.00-Projects/10.11-jonathanlynshue.com/`.

## Key Conventions

1. **Server-side tracking only** — no client analytics scripts. First-party cookies
   (`jls_aid`, `jls_sid`) + server events to Firestore, delivered async to
   PostHog/HubSpot via Cloud Tasks. Never block page responses on vendor APIs.
2. **Tests colocated** as `*.spec.ts` (Vitest). Set `USE_MEMORY_STORE=true` to run
   the server without real Firestore.
3. **Secrets** live in `.env` (local) / GitHub Actions secrets / GCP Secret Manager.
   `.env.example` is the template — **never commit real values**.
4. **TypeScript** strict; run `npm run typecheck` before pushing (CI gates on it).
