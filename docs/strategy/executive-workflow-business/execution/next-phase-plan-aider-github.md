# Next Phase Plan: Telemetry + Aider + GitHub Integration

> **Phase:** 2A — Telemetry, Code Quality, Testing & GitHub Workflow Automation  
> **Date:** 2026-04-20  
> **Toolchain:** Goose (orchestrator) + Aider (code edits) + `gh` CLI (GitHub management)  
> **Repo:** `https://github.com/jlynshue/jlynshue.github.io.git`  
> **Branch:** `main` (at `5bf0d72`)

---

## Executive Summary

The infrastructure phase (EWB-013/014) is complete. The site is live at `jonathanlynshue.com` with CI/CD deploying on every push to `main`. The next phase starts with **telemetry instrumentation** for both Goose and Aider, then leverages those tools (with full cost/token tracking) to expand test coverage, generate documentation, mirror tickets to GitHub Issues, and implement remaining EWB features.

---

## Tool Roles & Responsibilities

| Workflow | Tool | Why |
|----------|------|-----|
| Multi-file code edits | **Aider** | Repo-map awareness, auto-commits, Bedrock Opus 4.7 |
| Generate tests | **Aider** | Reads source → generates matching test files |
| Generate docs | **Aider** | Reads code structure → produces markdown |
| Create GitHub Issues | **`gh` CLI** | `gh issue create` from Goose shell |
| Create Pull Requests | **`gh` CLI** | `gh pr create` after Aider commits on branch |
| Orchestrate pipeline | **Goose** | Invoke Aider/gh, verify tests, create PRs |
| HubSpot API calls | **Goose** | Has `Hubspot.*` SDK functions |
| Merge PRs | **`gh` CLI** | `gh pr merge` after CI passes |

---

## Prerequisites (All Verified ✅)

| Requirement | Status | Value |
|-------------|--------|-------|
| Aider installed | ✅ | v0.86.2 |
| AWS CLI authenticated | ✅ | Account `288833448876`, user `jonathan.lynshue` |
| Bedrock models available | ✅ | `anthropic.claude-opus-4-7` (preferred), `anthropic.claude-opus-4-6-v1` (fallback) |
| GitHub CLI authenticated | ✅ | `jlynshue` via keyring token |
| Git repo operational | ✅ | `origin → jlynshue/jlynshue.github.io`, branch `main` at `5bf0d72` |
| Test framework | ✅ | Vitest v3.1.4, 12 tests passing |
| Keychain helper | ✅ | `/Users/jonathanlyn-shue/code-projects/scripts/mcp/keychain-helper.sh` |

---

## Sprint 0: Telemetry Setup (NEW — Do First)

> **Goal:** Every Goose session and Aider run automatically logs tokens, cost, model, and task to the monorepo's centralized telemetry logs. No manual tracking.

### What Was Built

#### `scripts/goose-log-session.sh`
Extracts token/cost data from Goose's SQLite session database and appends JSONL entries to the monorepo telemetry logs.

```bash
# Usage — run at end of any Goose session
bash scripts/goose-log-session.sh <session_id> [task] [notes]

# Example
bash scripts/goose-log-session.sh 20260420_9 EWB-013 "Full infra deploy"
```

**Data sources:**
- `~/.local/share/goose/sessions/sessions.db` (SQLite)
- Fields extracted: `accumulated_input_tokens`, `accumulated_output_tokens`, `model_config_json`, `provider_name`, `created_at`, `updated_at`, message count

**Writes to:**
- `logs/model_usage.jsonl` — Token counts, cost, model, provider, timestamps, session ID
- `logs/agent_runs.jsonl` — Task ID, title, success, cost, message count, project path

#### `scripts/aider-run.sh`
Wrapper around `aider` that captures token/cost output and writes telemetry.

```bash
# One-shot mode (for Goose orchestration)
bash scripts/aider-run.sh \
  --task EWB-010 \
  --message "Add GrowthBook SDK to the project" \
  src/lib/growthbook.ts package.json

# Interactive mode
bash scripts/aider-run.sh --task EWB-010 --interactive src/lib/growthbook.ts
```

**Features:**
- Parses Aider's `Tokens: Xk sent, Xk received. Cost: $X.XX` output lines
- Enables `--analytics` and `--analytics-log` to project-scoped `.aider.analytics.jsonl`
- Enables `--llm-history-file` and `--chat-history-file` for full conversation logs
- Counts git commits made by Aider during the session
- Logs duration, success/failure, exit code

**Writes to:**
- `logs/model_usage.jsonl` — Same schema as Goose entries, `source: "aider"`
- `logs/agent_runs.jsonl` — Same schema, plus `commits` and `duration_sec` fields

### Telemetry Log Schema (Shared)

Both scripts write to the same JSONL files that the existing monorepo telemetry system uses:

**`model_usage.jsonl`:**
```json
{
  "timestamp": "2026-04-20T20:52:28+00:00",
  "model": "us.anthropic.claude-opus-4-6-v1",
  "tokens_in": 41994684,
  "tokens_out": 174319,
  "tokens_total": 42169003,
  "cost_usd": 642.99,
  "task": "EWB-013",
  "provider": "aws_bedrock",
  "source": "goose",
  "start_time": "2026-04-20T15:01:09+00:00",
  "end_time": "2026-04-20T20:52:28+00:00",
  "session_id": "20260420_9"
}
```

**`agent_runs.jsonl`:**
```json
{
  "timestamp": "2026-04-20T20:52:28+00:00",
  "task_id": "EWB-013",
  "title": "Project Completion Plan Review",
  "source": "goose",
  "model": "us.anthropic.claude-opus-4-6-v1",
  "success": true,
  "cost_usd": 642.99,
  "session_id": "20260420_9",
  "messages": 848,
  "notes": "Full infra deploy session"
}
```

### Integration with Existing Monorepo Telemetry

The scripts write to the same `logs/` directory and use the same schema as:
- `shared/libs/python/telemetry/model_usage.py` — `log_model_call()` function
- `shared/libs/python/telemetry/event_schema.py` — Unified event schema
- `shared/libs/python/telemetry/observability.py` — Observability pipeline
- `scripts/bedrock-usage.py` — AWS CloudWatch Bedrock cost tracking

**Existing analysis tools work automatically** — no changes needed to `get_usage()`, `get_usage_stats()`, or the observability pipeline.

### Verified Working ✅

```
$ bash scripts/goose-log-session.sh 20260420_9 EWB-013 "Full infra deploy"
✅ Goose session 20260420_9 logged
   Model:    us.anthropic.claude-opus-4-6-v1
   Tokens:   42169003 (in: 41994684, out: 174319)
   Cost:     $642.9942
   Messages: 848
   Task:     EWB-013
   → logs/model_usage.jsonl
   → logs/agent_runs.jsonl
```

---

## Sprint 1: Test Coverage Expansion (Aider-driven)

| # | Task | Tool | Command Pattern | Time Est. |
|---|------|------|----------------|-----------|
| 1.1 | Generate `server/src/dispatcher.spec.ts` | Aider | `bash scripts/aider-run.sh --task EWB-TESTS --message "Create unit tests for CloudTaskDispatcher..." server/src/dispatcher.ts server/src/dispatcher.spec.ts` | 15 min |
| 1.2 | Generate `server/src/repository.spec.ts` | Aider | `bash scripts/aider-run.sh --task EWB-TESTS --message "Create unit tests..." server/src/repository.ts server/src/repository.spec.ts` | 15 min |
| 1.3 | Generate `server/src/vendors.spec.ts` | Aider | `bash scripts/aider-run.sh --task EWB-TESTS --message "Create unit tests..." server/src/vendors.ts server/src/vendors.spec.ts` | 10 min |
| 1.4 | Expand `server/src/app.spec.ts` | Aider | `bash scripts/aider-run.sh --task EWB-TESTS --message "Add tests for webhook handlers..." server/src/app.ts server/src/app.spec.ts` | 20 min |
| 1.5 | Create `src/pages/Index.test.tsx` | Aider | `bash scripts/aider-run.sh --task EWB-TESTS --message "Create component render tests..." src/pages/Index.tsx src/pages/Index.test.tsx` | 15 min |
| 1.6 | Verify all tests pass | Goose | `npx vitest --run` | 5 min |
| 1.7 | Push branch + create PR | `gh` | `git push -u origin feat/test-coverage && gh pr create ...` | 5 min |
| 1.8 | Log Goose + Aider session telemetry | Scripts | `bash scripts/goose-log-session.sh ...` | 2 min |

**Success Criteria:** 40+ passing tests. All server modules have test files. CI green. Telemetry entries logged.

---

## Sprint 2: Documentation Generation (Aider-driven)

| # | Task | Tool | Command Pattern | Time Est. |
|---|------|------|----------------|-----------|
| 2.1 | Update `README.md` | Aider | `bash scripts/aider-run.sh --task EWB-DOCS --message "Rewrite README.md..." README.md` | 15 min |
| 2.2 | Generate `docs/API-REFERENCE.md` | Aider | `bash scripts/aider-run.sh --task EWB-DOCS --message "Create API-REFERENCE.md..." server/src/app.ts docs/API-REFERENCE.md` | 15 min |
| 2.3 | Add docstrings to server modules | Aider | `bash scripts/aider-run.sh --task EWB-DOCS --message "Add JSDoc comments..." server/src/utils.ts server/src/dispatcher.ts server/src/repository.ts` | 20 min |
| 2.4 | Generate `docs/ARCHITECTURE.md` | Aider | `bash scripts/aider-run.sh --task EWB-DOCS --message "Create ARCHITECTURE.md..." server/src/index.ts server/src/app.ts firebase.template.json docs/ARCHITECTURE.md` | 15 min |
| 2.5 | Push + PR | `gh` | `gh pr create --title "docs: comprehensive documentation refresh"` | 5 min |

**Success Criteria:** README accurate. API reference covers all 10+ routes. Architecture doc explains the full stack.

---

## Sprint 3: GitHub Issues from EWB Backlog

| # | Task | Tool | Command Pattern | Time Est. |
|---|------|------|----------------|-----------|
| 3.1 | Create labels | `gh` | `gh label create phase-1 && gh label create phase-2 && gh label create automatable && gh label create manual` | 2 min |
| 3.2 | Create issue for EWB-003 | `gh` | `gh issue create --title "EWB-003: LinkedIn Profile Overhaul" --label "phase-1,manual"` | 2 min |
| 3.3 | Create issue for EWB-005 | `gh` | `gh issue create --title "EWB-005: Warm Outbound Campaign" ...` | 2 min |
| 3.4 | Create issue for EWB-006 | `gh` | `gh issue create --title "EWB-006: Referral Activation" ...` | 2 min |
| 3.5 | Create issue for EWB-007 | `gh` | `gh issue create --title "EWB-007: HubSpot Sales Pipeline" --label "phase-1,automatable"` | 2 min |
| 3.6 | Create issue for EWB-010 | `gh` | `gh issue create --title "EWB-010: A/B Testing (GrowthBook)" --label "phase-2"` | 2 min |
| 3.7 | Create issue for EWB-011 | `gh` | `gh issue create --title "EWB-011: Certifications (MS-102, ACP-620)" --label "phase-2,manual"` | 2 min |

**Success Criteria:** All 6 backlog tickets mirrored as GitHub Issues. Labels applied.

---

## Sprint 4: EWB-007 Implementation (Goose + Aider)

| # | Task | Tool | Time Est. |
|---|------|------|-----------|
| 4.1 | Create HubSpot pipeline via API | Goose | 15 min |
| 4.2 | Create custom properties | Goose | 10 min |
| 4.3 | Build proposal templates | Aider | 20 min |
| 4.4 | Update `HUBSPOT_STAGE_EVENT_MAP_JSON` | Goose | 10 min |
| 4.5 | Replace `HUBSPOT_TOKEN` placeholder | Goose | 5 min |
| 4.6 | Redeploy | Goose | 5 min |
| 4.7 | Verify HubSpot sync job | Goose | 5 min |

**Success Criteria:** HubSpot pipeline created with 10 stages. Proposal templates ready.

---

## Sprint 5: EWB-010 — A/B Testing Setup (Aider)

| # | Task | Tool | Time Est. |
|---|------|------|-----------|
| 5.1 | Install GrowthBook SDK | Aider | 15 min |
| 5.2 | Create Hero headline experiment | Aider | 15 min |
| 5.3 | Track experiment exposure events | Aider | 15 min |
| 5.4 | Add server route for experiment tracking | Aider | 15 min |
| 5.5 | Tests + PR | Aider + `gh` | 15 min |

**Success Criteria:** GrowthBook SDK installed. Hero headline A/B test functional.

---

## Aider Launch Commands (Reference)

### Via telemetry wrapper (preferred)
```bash
cd /Users/jonathanlyn-shue/code-projects/projects/active/jonathanlynshue-site
bash /Users/jonathanlyn-shue/code-projects/scripts/aider-run.sh \
  --task EWB-010 \
  --message "YOUR TASK HERE" \
  file1.ts file2.ts
```

### Direct (no telemetry)
```bash
cd /Users/jonathanlyn-shue/code-projects/projects/active/jonathanlynshue-site
AWS_REGION=us-east-1 aider --model bedrock/anthropic.claude-opus-4-7
```

### Fallback model
```bash
AWS_REGION=us-east-1 aider --model bedrock/anthropic.claude-opus-4-6-v1
```

---

## Goose Orchestration Pattern (The Power Combo)

```bash
# 1. Create feature branch
git checkout -b feat/<feature-name>

# 2. Aider makes code changes (with telemetry)
bash scripts/aider-run.sh --task <TASK> --message "<task>" <files>

# 3. Goose verifies tests pass
npx vitest --run

# 4. Push and create PR
git push -u origin feat/<feature-name>
gh pr create --title "<title>" --body "<body>"

# 5. After CI passes, merge
gh pr merge --merge

# 6. Log the session
bash scripts/goose-log-session.sh <session_id> <task> "<notes>"
```

---

## Dependencies & Execution Order

```
Sprint 0 (Telemetry) ✅ DONE
  └─► Sprint 1 (Tests) ← start immediately
      └─► Sprint 5 (A/B Testing) — needs test infra from Sprint 1
  └─► Sprint 2 (Docs) — can run in parallel with Sprint 1
  └─► Sprint 3 (GitHub Issues) — can run in parallel (no code changes)

Sprint 4 (HubSpot) ← needs HUBSPOT_TOKEN (human: create private app)
```

---

## Milestones & Checkpoints

| Milestone | Target | Success Metric |
|-----------|--------|----------------|
| **M0: Telemetry** | ✅ Done | Both scripts verified, entries in JSONL logs |
| **M1: Test coverage** | Day 1 | 40+ tests, CI green, PR merged |
| **M2: Docs complete** | Day 1–2 | README + API Ref + Architecture, PR merged |
| **M3: GitHub Issues live** | Day 1 | 6 issues created with labels |
| **M4: HubSpot operational** | Day 2–3 | Pipeline visible in HubSpot, webhook sync working |
| **M5: A/B testing ready** | Day 3–4 | GrowthBook installed, hero test live |

---

## Owners

| Role | Person/Agent | Responsibilities |
|------|-------------|------------------|
| **Orchestrator** | Goose | Invokes Aider/gh, verifies tests, creates PRs, HubSpot API |
| **Code Editor** | Aider (Bedrock Opus 4.7) | Test generation, docs, code changes, auto-commits |
| **GitHub Manager** | `gh` CLI | Issues, PRs, labels, merges |
| **Human** | Jon | HubSpot private app creation, LinkedIn work (EWB-003) |

---

## References

- **Aider Bedrock Setup:** `/Users/jonathanlyn-shue/code-projects/projects/active/jonathanlynshue-site/docs/aider-bedrock-setup.md`
- **Keychain Helper:** `/Users/jonathanlyn-shue/code-projects/scripts/mcp/keychain-helper.sh`
- **Telemetry Scripts:** `scripts/goose-log-session.sh`, `scripts/aider-run.sh`
- **Telemetry Shared Libs:** `shared/libs/python/telemetry/`
- **Ticket System:** `docs/strategy/executive-workflow-business/execution/tickets/`
- **Decision Log:** `docs/strategy/executive-workflow-business/execution/tickets/decision-log.md`

This is an example of another chat using the framework I want to use:

> The crosslisting-platform project demonstrates the pattern: Aider handles code edits (docs, tests, refactoring), `gh` manages GitHub (issues, PRs), and Goose orchestrates the pipeline — invoking both, verifying between steps, and handling API integrations that neither Aider nor `gh` can reach.
