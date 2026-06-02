> Source: vault planning folder (Obsidian)
> (`10.00-Projects/10.11-jonathanlynshue.com/documentation-plan.md`). Mirrored here for repo readers.


# Documentation Plan — jonathanlynshue.com

Gap analysis and prioritized backlog for the site's documentation, organized by
the **[Diataxis](https://diataxis.fr/) framework** (Tutorial / How-to / Reference
/ Explanation). All developer/operational docs are authored **in the repo** (the
source of truth) and **mirrored** read-only into this vault folder's `mirror/`.

> Mirror of this file lives at `docs/DOCUMENTATION-PLAN.md` in the repo.

## 1. Current state — Diataxis coverage map

| Diataxis quadrant | Purpose | Existing docs | Status |
|---|---|---|---|
| **Reference** | Information-oriented (look things up) | `README.md`, `docs/API-REFERENCE.md` | ✅ Strong, current |
| **Explanation** | Understanding-oriented (the "why") | `docs/ARCHITECTURE.md` (system diagram, flows, key design decisions) | ✅ Good |
| **How-to** | Task-oriented (solve a specific problem) | `docs/aider-bedrock-setup.md`, `docs/skills/hubspot-cli.md` | ⚠️ Thin — no contributing / deploy / env / testing guides |
| **Tutorial** | Learning-oriented (guided first run) | — | ❌ None |

**Defect:** `CLAUDE.md` is generic "Fusion Starter" boilerplate (wrong `app/`
structure, React-Router version confusion). It is reference-class but **actively
misleading** → P0 rewrite.

**Strategy/business content** (`docs/strategy/`, `docs/transformation-package/`,
`docs/templates/`) is intentionally out of scope for the dev-docs framework.

## 2. Prioritized backlog

Each doc is authored **in-repo**, then mirrored into `mirror/`.

| Priority | Doc | Repo path | Diataxis | Scope notes |
|---|---|---|---|---|
| **P0** | Rewrite `CLAUDE.md` | `CLAUDE.md` | reference | Real stack table, actual `src/` + `server/src/` structure, real commands (`dev` :8080, `build:all`, `test`, `typecheck`), `react-router-dom` routing in `src/App.tsx`, pointers to API-REFERENCE + deployment. Remove all boilerplate. |
| **P0** | Deployment & rollback runbook | `docs/DEPLOYMENT.md` | how-to | Deploy flow (push `main` → verify → Cloud Run + Firebase), PR preview channels, **rollback** (`gcloud run services update-traffic` to prior revision + `firebase hosting:rollback`), secret rotation, WIF bootstrap, incident steps. |
| **P0** | Environment & secrets setup | `docs/ENVIRONMENT.md` | reference + how-to | Every `.env` var explained; where each is set (local `.env` / GitHub Actions secrets / GCP Secret Manager); bootstrap of GCP project, Firestore, Cloud Tasks queue, Firebase Hosting, WIF provider + service account. |
| **P1** | `CONTRIBUTING.md` | `CONTRIBUTING.md` | how-to | Branch model, PR flow, commit conventions, local setup, the `test` + `typecheck` gates, note that there is **no lint script** (Prettier only). |
| **P1** | Testing guide | `docs/TESTING.md` | how-to | Run/write Vitest (62 tests), server (`server/src/*.spec.ts`) vs client specs, coverage, mocking Firestore via `USE_MEMORY_STORE`. |
| **P1** | Multi-environment plan (update) | vault `the multi-environment plan` + mirror | explanation | Resolve `[FILL]` to the real stack; add current-vs-target state. (Done in this pass.) |
| **P2** | `SECURITY.md` | `SECURITY.md` | explanation | HMAC-SHA256 webhook verification, `TRACKING_SECRET` / `INTERNAL_API_TOKEN` rotation, WIF keyless auth, secret-handling policy, vuln reporting. |
| **P2** | Getting-started tutorial | `docs/GETTING-STARTED.md` | tutorial | Zero-to-running-locally guided walkthrough (clone → `.env` → `npm i` → `dev` → make a change → run tests). |
| **P2** | `CHANGELOG.md` | `CHANGELOG.md` | reference | Keep-a-Changelog format; seed from git history. |
| **P3** | ADRs | `docs/adr/000N-*.md` | explanation | Promote ARCHITECTURE.md "Key Design Decisions" into numbered ADRs (server-side tracking, first-party cookies, async delivery, WIF, Hosting+Run rewrites). |
| **P3** | `TROUBLESHOOTING.md` | `docs/TROUBLESHOOTING.md` | how-to | Common failures: deploy auth, webhook 401s, missing tracking events, Cloud Tasks retries. |

## 3. Mirror sync + conflict resolution

- **Source of truth = the repo.** The vault `mirror/` holds generated, read-only copies.
- Each mirrored file carries a banner pointing back to its repo path.
- Regenerate the mirror with the `cp` block documented in `mirror/_MIRROR-README.md`
  (or promote it to a tracked `scripts/sync-vault-mirror.sh` later).
- On any divergence, **the repo wins** and the mirror is regenerated. Mirror files
  are never hand-edited.

## 4. Execution checklist

- [ ] **P0** Rewrite `CLAUDE.md` (in scope this pass)
- [ ] **P0** `docs/DEPLOYMENT.md` — deploy + rollback runbook
- [ ] **P0** `docs/ENVIRONMENT.md` — env vars + GCP/Firebase/WIF bootstrap
- [ ] **P1** `CONTRIBUTING.md`
- [ ] **P1** `docs/TESTING.md`
- [x] **P1** Update multi-environment plan to real stack (this pass)
- [ ] **P2** `SECURITY.md`
- [ ] **P2** `docs/GETTING-STARTED.md`
- [ ] **P2** `CHANGELOG.md`
- [ ] **P3** `docs/adr/` + `docs/TROUBLESHOOTING.md`
- [ ] Refresh `mirror/` after each repo doc lands
