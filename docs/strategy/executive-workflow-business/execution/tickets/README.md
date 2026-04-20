---
date: 2026-04-19
agent: cline
category: execution-tickets
---

# Execution Tickets — Executive Workflow Business

## Ticket Index

| ID | Title | Status | Priority | Phase | Folder |
|----|-------|--------|----------|-------|--------|
| EWB-015 | UI Automation MCP Assessment | 🔲 Backlog | **P0** | Immediate | [backlog](./backlog/EWB-015.md) |
| EWB-014 | Merge Firebase/Cloud Run Branch | 🔲 Backlog | High | Immediate | [backlog](./backlog/EWB-014.md) |
| EWB-013 | Firebase + Cloud Run Infrastructure | 🔲 Backlog | High | After merge | [backlog](./backlog/EWB-013.md) |
| EWB-001 | Technology Stack Deployment | ✅ Done | High | Phase 1 / Week 1 | [done](./done/EWB-001.md) |
| EWB-002 | Website Homepage Rewrite | ✅ Done | High | Phase 1 / Week 1–2 | [done](./done/EWB-002.md) |
| EWB-008 | Social Media Channels + GitHub Artifact | ✅ Done | Medium | Phase 1 / Week 2–3 | [done](./done/EWB-008.md) |
| EWB-009 | Website Supporting Pages (Sprint + Diagnostic) | ✅ Done | Medium | Phase 1 / Week 3–4 | [done](./done/EWB-009.md) |
| EWB-004 | Content Publishing System — Month 1 | 🔵 In Progress | High | Phase 1 / Week 1–4 | [in-progress](./in-progress/EWB-004.md) |
| EWB-003 | LinkedIn Profile Overhaul | 🔲 Backlog | High | Phase 1 / Week 1 | [backlog](./backlog/EWB-003.md) |
| EWB-005 | Warm Outbound Campaign | 🔲 Backlog | High | Phase 1 / Week 1–4 | [backlog](./backlog/EWB-005.md) |
| EWB-006 | Referral Activation Campaign | 🔲 Backlog | High | Phase 1 / Week 2–4 | [backlog](./backlog/EWB-006.md) |
| EWB-007 | Sales Enablement Setup | 🔲 Backlog | High | Phase 1 / Week 2–3 | [backlog](./backlog/EWB-007.md) |
| EWB-010 | A/B Testing PODs Setup | 🔲 Backlog | Medium | Phase 2 / Week 5+ | [backlog](./backlog/EWB-010.md) |
| EWB-011 | Certification Program — Tier 1 | 🔲 Backlog | Low | Phase 2 / Month 2+ | [backlog](./backlog/EWB-011.md) |
| EWB-012 | Validation System & Weekly Reviews | 🔲 Backlog | High | Ongoing | [backlog](./backlog/EWB-012.md) |

## Status Summary

| Status | Count | Tickets |
|--------|-------|---------|
| ✅ Done | 4 | EWB-001, 002, 008, 009 |
| 🔵 In Progress | 1 | EWB-004 |
| 🔲 Backlog | 10 | EWB-003, 005, 006, 007, 010, 011, 012, 013, 014, 015 |

## Priority Execution Order

1. **EWB-015** (P0) — UI Automation MCP Assessment → unblocks all UI-dependent work
2. **EWB-014** — Merge Firebase/Cloud Run branch
3. **EWB-013** — Firebase + Cloud Run infrastructure setup
4. **EWB-007** — HubSpot pipeline (partially automated by new server)
5. **EWB-003** — LinkedIn profile overhaul (automatable after EWB-015)
6. **EWB-004** — Content publishing (drafts ready, needs review + publish)
7. **EWB-005/006** — Outbound + referrals
8. **EWB-010** — A/B testing (Phase 2)
9. **EWB-012** — Validation system
10. **EWB-011** — Certifications (Month 2+)

## Status Legend

- ✅ **Done** — Completed, verified, in `done/` folder
- 🔵 **In Progress** — Actively being worked, in `in-progress/` folder
- 🔲 **Backlog** — Not yet started, in `backlog/` folder

## Supporting Documents

- [Decision Log](./decision-log.md) — All project decisions with rationale
- [Execution Overview](../00-execution-overview.md) — Master execution plan
- [90-Day Calendar](../10-90-day-calendar.md) — Week-by-week schedule
- [Hosting & Measurement Architecture](../13-hosting-and-measurement-architecture.md) — Firebase/Cloud Run design
- [Implementation Summary](../14-implementation-summary.md) — What was built in the Codex session

## Workflow

1. New tickets start in `backlog/`
2. When work begins, move file to `in-progress/` and update status
3. When complete and verified, move to `done/` and log in audit trail
4. All decisions logged in `decision-log.md`

## Tickets Affected by GitHub Migration (2026-04-19)

The `codex/firebase-cloud-run-site-refresh` branch introduced Firebase Hosting + Cloud Run + server-side tracking. These tickets need attention:

- **EWB-001** — Tech stack changed: Plausible → PostHog (server-side), new webhook integrations
- **EWB-007** — HubSpot contact upsert now automated server-side; pipeline stages still manual
- **EWB-010** — A/B testing needs PostHog as metrics source instead of Plausible
- **EWB-012** — KPI dashboard metrics source changed to PostHog event surface
