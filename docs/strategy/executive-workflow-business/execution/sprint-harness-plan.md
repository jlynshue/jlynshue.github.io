# Phase 2A Sprint Harness — Aider QA, Test Plans, Documentation & Verification

> **Methodology:** Harness (branch → Aider edit → verify → PR → merge → log)  
> **Date:** 2026-04-20  
> **Remaining Sprints:** 5 (Sprint 1–5)  
> **Sprint Cadence:** Micro-sprints (1–3 hours each, same-day completion)  
> **Definition of Done:** All acceptance criteria pass, CI green, PR merged, telemetry logged  
> **Quality Standard:** Every code change has tests, every Aider run is verified before commit  
> **Stakeholders:** Jon (product owner), Goose (orchestrator), Aider (code editor), `gh` (GitHub manager)

---

## Harness Methodology

Every sprint follows this exact execution loop. Goose orchestrates, stops only when human input is required.

```
┌─────────────────────────────────────────────────────┐
│  HARNESS LOOP (per task)                            │
│                                                     │
│  1. BRANCH    git checkout -b feat/<name>           │
│  2. EDIT      aider-run.sh --task X --message "..." │
│  3. VERIFY    npx vitest --run && npm run typecheck  │
│  4. FIX       if tests fail → aider fix loop (≤3)  │
│  5. PR        gh pr create --title "..." --body "." │
│  6. CI        wait for GitHub Actions green         │
│  7. MERGE     gh pr merge --merge                   │
│  8. LOG       goose-log-session.sh + aider logs     │
│  9. TICKET    update EWB ticket status + audit trail │
│                                                     │
│  EXIT: All acceptance criteria met                  │
│  STOP: Human input required (flag + wait)           │
└─────────────────────────────────────────────────────┘
```

**Fix Loop (Step 4):** If tests fail after Aider edits, Goose runs up to 3 rounds of:
```bash
bash scripts/aider-run.sh --task <TASK> \
  --message "These tests are failing: <paste errors>. Fix the source to make tests pass." \
  <failing-file> <source-file>
```
If 3 rounds fail, Goose stops and flags for human review.

---

## Current Baseline (Entry Criteria)

| Metric | Value |
|--------|-------|
| Test files | 3 (`app.spec.ts`, `utils.spec.ts`, `src/lib/utils.spec.ts`) |
| Test count | 12 passing |
| Source files (server, no tests) | 5 (`dispatcher.ts`, `repository.ts`, `vendors.ts`, `config.ts`, `index.ts`) |
| Source files (frontend, no tests) | 4 pages (`Index.tsx`, `Sprint.tsx`, `Diagnostic.tsx`, `NotFound.tsx`) |
| CI | Green (verify → Cloud Run → Firebase Hosting) |
| Telemetry | ✅ Both scripts verified |

---

## Sprint 1: Server Test Coverage

### Objectives
- Generate test files for all untested server modules
- Expand existing `app.spec.ts` with webhook handler + health route tests
- Reach 40+ total tests with 100% server module file coverage

### Entry Criteria
- [ ] 12 tests passing (baseline)
- [ ] Git on `main`, clean working tree
- [ ] Aider + AWS Bedrock authenticated

### Test Plan

| Task | Source File | Test File | Test Cases | Risk |
|------|-----------|-----------|------------|------|
| 1.1 | `server/src/dispatcher.ts` (52L, 3F, 1 class) | `dispatcher.spec.ts` | • `MemoryDispatcher.dispatch()` returns false<br>• `CloudTaskDispatcher.dispatch()` creates task<br>• Error handling on failed dispatch | Low — small module |
| 1.2 | `server/src/repository.ts` (108L, 18F, 2 classes) | `repository.spec.ts` | • `MemoryTrackingStore.saveProfile/getProfile` CRUD<br>• `MemoryTrackingStore.saveEvent/getEvent` CRUD<br>• `MemoryTrackingStore.saveContact/getContact` CRUD<br>• `MemoryTrackingStore.getCursor/setCursor`<br>• `FirestoreTrackingStore` (mock Firestore) | Med — 18 functions |
| 1.3 | `server/src/vendors.ts` (171L, 7F, 2 classes) | `vendors.spec.ts` | • PostHog `capture()` event formatting<br>• HubSpot `upsertContact()` mapping<br>• HubSpot `searchDealsUpdatedSince()` query<br>• Stage event map resolution | Med — vendor API mocking |
| 1.4 | `server/src/app.ts` (703L, 23F) | `app.spec.ts` (expand) | • `GET /health` → 200 JSON<br>• `GET /healthz` → 200 JSON<br>• `POST /webhooks/calcom` valid → 202<br>• `POST /webhooks/calcom` bad sig → 401<br>• `POST /internal/sync/hubspot` with bearer → 200<br>• `POST /internal/sync/hubspot` no bearer → 401<br>• Static file serving (`.js`, `.css`)<br>• 404 for unknown routes | High — core app |
| 1.5 | `server/src/config.ts` (45L, 3F) | `config.spec.ts` | • Defaults applied when env vars missing<br>• Env var override works | Low — small |

### Aider Commands (Exact)

```bash
# 1.1 Dispatcher
bash scripts/aider-run.sh --task EWB-TESTS \
  --message "Create server/src/dispatcher.spec.ts with vitest. Test MemoryDispatcher (always returns false) and CloudTaskDispatcher (mock @google-cloud/tasks). Match the patterns in app.spec.ts. Import from './dispatcher.js'." \
  server/src/dispatcher.ts server/src/types.ts

# 1.2 Repository
bash scripts/aider-run.sh --task EWB-TESTS \
  --message "Create server/src/repository.spec.ts with vitest. Test all MemoryTrackingStore methods: saveProfile/getProfile, saveEvent, updateEventDelivery, saveContact/getContact, getCursor/setCursor. Skip FirestoreTrackingStore (requires real Firestore). Import from './repository.js'. Use the patterns from app.spec.ts." \
  server/src/repository.ts server/src/types.ts

# 1.3 Vendors
bash scripts/aider-run.sh --task EWB-TESTS \
  --message "Create server/src/vendors.spec.ts with vitest. Test PostHogClient.capture() builds correct payloads. Test HubSpotClient.upsertContact() with mocked fetch. Test stage event map resolution. Use vi.fn() mocks. Import from './vendors.js'." \
  server/src/vendors.ts server/src/types.ts

# 1.4 App expansion
bash scripts/aider-run.sh --task EWB-TESTS \
  --message "Add these test cases to server/src/app.spec.ts: (1) GET /health returns {status:'ok'}, (2) GET /healthz returns {status:'ok'}, (3) POST /webhooks/calcom with valid HMAC signature returns 202, (4) POST /webhooks/calcom with bad signature returns 401, (5) POST /internal/sync/hubspot with correct bearer token, (6) unknown routes return 404 JSON. Keep existing tests intact." \
  server/src/app.ts server/src/app.spec.ts

# 1.5 Config
bash scripts/aider-run.sh --task EWB-TESTS \
  --message "Create server/src/config.spec.ts with vitest. Test that buildConfig() returns correct defaults when env vars are missing, and that it reads PORT, BASE_URL, TRACKING_SECRET etc when set. Use vi.stubEnv(). Import from './config.js'." \
  server/src/config.ts
```

### Verification Steps
1. `npx vitest --run` → all tests pass
2. `npm run typecheck` → no type errors
3. Count: `npx vitest --run 2>&1 | grep "Tests"` → 40+ tests
4. No test files import real external services (Firestore, Cloud Tasks, PostHog)

### Acceptance Criteria
- [ ] AC1: `dispatcher.spec.ts` exists with ≥3 test cases
- [ ] AC2: `repository.spec.ts` exists with ≥6 test cases (all MemoryTrackingStore methods)
- [ ] AC3: `vendors.spec.ts` exists with ≥4 test cases
- [ ] AC4: `app.spec.ts` expanded with ≥5 new test cases (health, webhooks, auth, 404)
- [ ] AC5: `config.spec.ts` exists with ≥2 test cases
- [ ] AC6: 40+ total tests passing
- [ ] AC7: `npm run typecheck` clean
- [ ] AC8: CI green on PR
- [ ] AC9: Telemetry entries logged for all Aider runs

### Exit Criteria → Sprint 2
- PR merged to `main`
- Test count ≥ 40
- `logs/agent_runs.jsonl` has entries with `task_id: "EWB-TESTS"`

---

## Sprint 2: Documentation Generation

### Objectives
- Rewrite README to reflect the actual production stack
- Generate API reference for all server routes
- Generate architecture doc explaining system flow
- Add JSDoc to undocumented server functions

### Entry Criteria
- [ ] Sprint 1 merged (tests passing, CI green)
- [ ] Git on `main`, clean working tree

### Documentation Plan

| Task | Output File | Content | Source Files |
|------|-----------|---------|-------------|
| 2.1 | `README.md` | Project overview, tech stack, local dev setup, deploy process, directory structure | All project files |
| 2.2 | `docs/API-REFERENCE.md` | All server routes: method, path, auth, request/response, examples | `server/src/app.ts` |
| 2.3 | `docs/ARCHITECTURE.md` | System diagram (text), data flow, component responsibilities, infrastructure | `server/src/*.ts`, `firebase.template.json`, `.github/workflows/deploy.yml` |
| 2.4 | Server JSDoc | All exported functions with `@param`, `@returns`, `@example` | `server/src/utils.ts`, `server/src/dispatcher.ts`, `server/src/repository.ts`, `server/src/vendors.ts` |

### Aider Commands (Exact)

```bash
# 2.1 README
bash scripts/aider-run.sh --task EWB-DOCS \
  --message "Rewrite README.md for the jonathanlynshue.com website project. Include: (1) Project overview — personal site + executive workflow business, Firebase Hosting + Cloud Run, (2) Tech stack — Vite, React, TypeScript, Tailwind, Node server, Firestore, Cloud Tasks, (3) Local development — npm install, npm run dev, npm run build:all, npm test, (4) Deployment — GitHub Actions CI/CD, Workload Identity Federation, (5) Server routes summary — /health, /r/*, /webhooks/*, /internal/*, (6) Directory structure, (7) Environment variables from .env.example. Do NOT include secrets." \
  README.md .env.example package.json

# 2.2 API Reference
bash scripts/aider-run.sh --task EWB-DOCS \
  --message "Create docs/API-REFERENCE.md documenting every route in the server handleRequest function in app.ts. For each route include: HTTP method, path, authentication (none, webhook signature, bearer token), request body schema, response status codes and body, example curl command. Routes: GET /health, GET /healthz, GET /r/:target, POST /webhooks/calcom, POST /webhooks/tally, POST /internal/tasks/posthog-delivery, POST /internal/tasks/hubspot-upsert, POST /internal/sync/hubspot." \
  server/src/app.ts

# 2.3 Architecture
bash scripts/aider-run.sh --task EWB-DOCS \
  --message "Create docs/ARCHITECTURE.md describing the system architecture. Include: (1) ASCII system diagram showing Browser → Firebase Hosting → Cloud Run → Firestore/Cloud Tasks/PostHog/HubSpot, (2) Request flow for page views, CTA redirects, and webhook processing, (3) Event pipeline: tracked redirect → Firestore event → Cloud Tasks → PostHog + HubSpot, (4) Deployment pipeline: GitHub Actions → Cloud Build → Cloud Run + Firebase Hosting, (5) Key design decisions: server-side tracking, no client analytics scripts, first-party cookies." \
  server/src/app.ts server/src/index.ts firebase.template.json .github/workflows/deploy.yml

# 2.4 JSDoc
bash scripts/aider-run.sh --task EWB-DOCS \
  --message "Add JSDoc comments (with @param, @returns, @example where useful) to all exported functions in these files. Do not change any logic. Preserve existing comments." \
  server/src/utils.ts server/src/dispatcher.ts server/src/repository.ts server/src/vendors.ts
```

### Verification Steps
1. All `.md` files render correctly (no broken markdown)
2. API reference mentions all 8+ routes from `app.ts`
3. Architecture doc includes system diagram
4. `npm run typecheck` still clean (JSDoc doesn't break types)
5. `npx vitest --run` still passes (no code changes)

### Acceptance Criteria
- [ ] AC1: `README.md` updated with accurate project description and setup instructions
- [ ] AC2: `docs/API-REFERENCE.md` exists, covers all 8+ server routes with examples
- [ ] AC3: `docs/ARCHITECTURE.md` exists with system diagram and data flow description
- [ ] AC4: All exported server functions have JSDoc comments
- [ ] AC5: No test regressions
- [ ] AC6: PR merged, CI green

### Exit Criteria → Sprint 3
- PR merged to `main`
- All 4 doc artifacts exist and are accurate
- Tests still passing (no regressions)

---

## Sprint 3: GitHub Issues from EWB Backlog

### Objectives
- Mirror all 6 backlog tickets as GitHub Issues for external visibility
- Create labels for phase/automation classification
- Link issues to markdown tickets via body references

### Entry Criteria
- [ ] GitHub CLI authenticated (`gh auth status` ✅)
- [ ] Backlog tickets exist in `tickets/backlog/`

### Task Plan

| Task | `gh` Command | Labels |
|------|-------------|--------|
| 3.0 | Create labels: `phase-1`, `phase-2`, `automatable`, `manual`, `high`, `medium`, `low` | — |
| 3.1 | EWB-003: LinkedIn Profile Overhaul | `phase-1`, `manual`, `high` |
| 3.2 | EWB-005: Warm Outbound Campaign | `phase-1`, `manual`, `high` |
| 3.3 | EWB-006: Referral Activation Campaign | `phase-1`, `manual`, `high` |
| 3.4 | EWB-007: Sales Enablement Setup (HubSpot) | `phase-1`, `automatable`, `high` |
| 3.5 | EWB-010: A/B Testing PODs Setup | `phase-2`, `automatable`, `medium` |
| 3.6 | EWB-011: Certification Program — Tier 1 | `phase-2`, `manual`, `low` |

### Issue Body Template

```markdown
## {TICKET_TITLE}

**Ticket:** `docs/strategy/.../tickets/backlog/{TICKET_ID}.md`
**Priority:** {PRIORITY}
**Phase:** {PHASE}
**Assignee:** {ASSIGNEE}
**Dependencies:** {DEPS}

### Requirements
{REQUIREMENTS_LIST}

### Acceptance Criteria
{AC_LIST}

---
*Synced from EWB markdown ticket system on 2026-04-20*
```

### Verification Steps
1. `gh issue list --repo jlynshue/jlynshue.github.io` → 6 issues
2. `gh label list --repo jlynshue/jlynshue.github.io` → 7 labels
3. Each issue body contains the ticket reference and requirements
4. Labels correctly assigned

### Acceptance Criteria
- [ ] AC1: 7 labels created (`phase-1`, `phase-2`, `automatable`, `manual`, `high`, `medium`, `low`)
- [ ] AC2: 6 issues created, one per backlog ticket
- [ ] AC3: Each issue has correct labels applied
- [ ] AC4: Each issue body includes requirements and acceptance criteria from the ticket

### Exit Criteria → Sprint 4
- All 6 issues visible on GitHub
- No code changes (no PR needed)

### ⚠️ Human Stop Point: None — fully automatable

---

## Sprint 4: EWB-007 — HubSpot Sales Pipeline

### Objectives
- Create HubSpot pipeline with 10 deal stages
- Create 5 custom deal properties
- Build diagnostic + sprint proposal templates
- Wire `HUBSPOT_STAGE_EVENT_MAP_JSON` to production
- Verify hourly sync job works

### Entry Criteria
- [ ] ⚠️ **HUMAN REQUIRED:** Jon creates HubSpot private app and adds token to Keychain
  ```bash
  security add-generic-password -a "jonathanlynshue-site" -s "HUBSPOT_TOKEN" -w "PASTE_TOKEN" -U
  ```
- [ ] Sprint 1 merged (tests passing)

### Task Plan

| Task | Tool | Details | Time |
|------|------|---------|------|
| 4.1 | Goose (HubSpot SDK) | Create pipeline: "Executive Workflow Pipeline" with 10 stages | 15 min |
| 4.2 | Goose (HubSpot SDK) | Create 5 custom properties: `workflow_type`, `engagement_source`, `lead_asset`, `attribution_source`, `attribution_campaign` | 10 min |
| 4.3 | Aider | Generate `docs/templates/diagnostic-proposal.md` — diagnostic scope, deliverables, pricing ($2.5k credited), timeline | 10 min |
| 4.4 | Aider | Generate `docs/templates/sprint-proposal.md` — sprint scope, day-by-day breakdown, pricing, deliverables | 10 min |
| 4.5 | Goose | Update `HUBSPOT_STAGE_EVENT_MAP_JSON` in GCP Secret Manager with real stage IDs | 10 min |
| 4.6 | Goose | Set real `HUBSPOT_TOKEN` in GitHub secrets from Keychain | 5 min |
| 4.7 | Goose | Trigger redeploy: `gh workflow run deploy.yml` | 5 min |
| 4.8 | Goose | Verify: `curl /internal/sync/hubspot` with bearer token → 200 | 5 min |

### Pipeline Stages (10)

```
1. New Lead
2. Discovery Scheduled
3. Discovery Completed
4. Diagnostic Proposed
5. Diagnostic Sold
6. Diagnostic In Progress
7. Sprint Proposed
8. Sprint Sold
9. Sprint In Progress
10. Closed Won
```

### Test Plan (Post-Implementation)
1. HubSpot dashboard shows pipeline with 10 stages
2. Custom properties visible on deal records
3. Create a test deal → verify it appears in pipeline
4. Cloud Scheduler fires → `/internal/sync/hubspot` → 200
5. `curl -H "Authorization: Bearer <token>" https://jonathanlynshue.com/internal/sync/hubspot` → 200

### Acceptance Criteria
- [ ] AC1: HubSpot pipeline exists with 10 stages
- [ ] AC2: 5 custom deal properties created
- [ ] AC3: `diagnostic-proposal.md` exists with scope, deliverables, pricing
- [ ] AC4: `sprint-proposal.md` exists with day-by-day breakdown, pricing
- [ ] AC5: `HUBSPOT_STAGE_EVENT_MAP_JSON` updated with real stage IDs
- [ ] AC6: `HUBSPOT_TOKEN` replaced with real value
- [ ] AC7: Hourly sync job returns 200

### Exit Criteria → Sprint 5
- Pipeline visible in HubSpot
- Sync job verified
- PR merged for proposal templates

### ⚠️ Human Stop Point: Step 4.0 — Jon must create HubSpot private app + provide token

---

## Sprint 5: EWB-010 — A/B Testing (GrowthBook)

### Objectives
- Install GrowthBook SDK in the frontend
- Create hero headline A/B test
- Track experiment exposure events server-side
- Generate tests for new code

### Entry Criteria
- [ ] Sprint 1 merged (test infrastructure exists)
- [ ] Git on `main`, clean working tree

### Task Plan

| Task | Tool | Details | Time |
|------|------|---------|------|
| 5.1 | Aider | Install `@growthbook/growthbook-react`, create `src/lib/growthbook.ts` with SDK init | 15 min |
| 5.2 | Aider | Wrap `HeroSection.tsx` headline in `useFeatureValue("hero_headline", default)` | 15 min |
| 5.3 | Aider | Add tracking callback that sends exposure events to `/r/experiment-exposure` | 15 min |
| 5.4 | Aider | Add `GET /r/experiment-exposure` route in `server/src/app.ts` that logs to Firestore | 15 min |
| 5.5 | Aider | Generate `src/lib/growthbook.spec.ts` + expand `app.spec.ts` for new route | 15 min |
| 5.6 | Verify | `npx vitest --run` + `npm run typecheck` | 5 min |
| 5.7 | PR | `gh pr create` + CI + merge | 5 min |

### Aider Commands (Exact)

```bash
# 5.1 Install + init
bash scripts/aider-run.sh --task EWB-010 \
  --message "Install @growthbook/growthbook-react. Create src/lib/growthbook.ts that initializes GrowthBook with apiHost and clientKey from env. Export a GrowthBookProvider wrapper and useExperiment hook. Use VITE_GROWTHBOOK_CLIENT_KEY env var." \
  package.json src/lib/growthbook.ts

# 5.2 Hero experiment
bash scripts/aider-run.sh --task EWB-010 \
  --message "In src/components/HeroSection.tsx, use GrowthBook useFeatureValue to A/B test the hero headline. Feature key: 'hero_headline'. Control: current text. Variant: 'Your executive reporting takes 4x longer than it should.' Wrap the component tree in the GrowthBook provider from src/lib/growthbook.ts." \
  src/components/HeroSection.tsx src/lib/growthbook.ts

# 5.3 Tracking
bash scripts/aider-run.sh --task EWB-010 \
  --message "In src/lib/growthbook.ts, add a trackingCallback to the GrowthBook instance that sends experiment exposure data to the server via fetch('/r/experiment-exposure?experiment=ID&variation=N'). Include the experiment key and variation index." \
  src/lib/growthbook.ts

# 5.4 Server route
bash scripts/aider-run.sh --task EWB-010 \
  --message "In server/src/app.ts, add handling for GET /r/experiment-exposure. Parse query params 'experiment' and 'variation'. Create a normalized event with eventName 'experiment_exposed'. Return 204. Follow the same patterns as handleTrackedRedirect." \
  server/src/app.ts server/src/types.ts

# 5.5 Tests
bash scripts/aider-run.sh --task EWB-010 \
  --message "Add test cases to server/src/app.spec.ts for: (1) GET /r/experiment-exposure?experiment=hero_headline&variation=1 returns 204 and creates an event, (2) GET /r/experiment-exposure without params returns 400. Keep all existing tests." \
  server/src/app.ts server/src/app.spec.ts
```

### Verification Steps
1. `npx vitest --run` → all tests pass (including new experiment route tests)
2. `npm run typecheck` → clean
3. `npm run build:all` → builds without errors
4. GrowthBook feature flag renders correctly in dev mode

### Acceptance Criteria
- [ ] AC1: `@growthbook/growthbook-react` in `package.json`
- [ ] AC2: `src/lib/growthbook.ts` exists with SDK initialization
- [ ] AC3: `HeroSection.tsx` uses feature flag for headline text
- [ ] AC4: Exposure events sent to server on experiment assignment
- [ ] AC5: `/r/experiment-exposure` route returns 204 and logs event
- [ ] AC6: ≥2 new test cases for experiment route
- [ ] AC7: All tests pass, CI green, PR merged

### Exit Criteria
- A/B testing infrastructure operational
- Hero headline experiment ready to activate via GrowthBook dashboard

### ⚠️ Human Stop Point: None for code. Jon needs to create GrowthBook account + set `VITE_GROWTHBOOK_CLIENT_KEY` when ready to activate.

---

## Cross-Sprint Telemetry & QA Checklist

After **every sprint**, Goose executes:

```bash
# 1. Log Goose session
bash scripts/goose-log-session.sh <session_id> <ticket> "<sprint description>"

# 2. Verify telemetry entries
tail -1 logs/model_usage.jsonl | python3 -m json.tool
tail -1 logs/agent_runs.jsonl | python3 -m json.tool

# 3. Verify test count hasn't regressed
npx vitest --run 2>&1 | grep "Tests"

# 4. Verify CI is green
gh run list --repo jlynshue/jlynshue.github.io --limit 1

# 5. Update EWB ticket status + audit trail
# (move ticket, update Status field, add audit trail entry)
```

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Aider generates tests that don't compile | Medium | Low | Fix loop (≤3 rounds), then Goose manual fix |
| Bedrock rate limit during batch Aider runs | Low | Medium | Use fallback model, add delays between runs |
| GrowthBook SDK conflicts with Vite SSR | Low | High | Feature-flag the import, lazy-load SDK |
| HubSpot free tier limits | Low | Medium | Monitor API call count, stay under 100/day |
| Test flakiness from async mocks | Medium | Low | Use `vi.useFakeTimers()`, deterministic test data |

---

## Summary Timeline

| Day | Sprint | Deliverables | Human Needed? |
|-----|--------|-------------|:------------:|
| **Day 1** | Sprint 1 + 2 + 3 | 40+ tests, docs, 6 GitHub Issues | No |
| **Day 2** | Sprint 4 | HubSpot pipeline + proposals | **Yes** (token) |
| **Day 3** | Sprint 5 | GrowthBook A/B testing | No |

**Total estimated time:** ~8–10 hours of agent work, ~30 minutes of human input.
