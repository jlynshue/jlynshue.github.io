---
date: 2026-04-20
agent: goose
category: execution-tickets
---

# EWB Ticket System — README

## Folder Structure

| Folder | Purpose | Current Count |
|--------|---------|:------------:|
| `done/` | Completed tickets | **7** |
| `in-progress/` | Active work | **2** |
| `backlog/` | Not yet started | **6** |

## Board Summary (as of 2026-04-20)

### ✅ Done (7)
| Ticket | Title | Completed |
|--------|-------|-----------|
| EWB-001 | Technology Stack Deployment | 2026-04-20 |
| EWB-002 | Website Homepage Rewrite | 2026-04-18 |
| EWB-008 | Social Media Channels Setup | 2026-04-20 |
| EWB-009 | Website Supporting Pages | 2026-04-18 |
| EWB-013 | Firebase + Cloud Run Infrastructure Setup | 2026-04-20 |
| EWB-014 | Merge `codex/firebase-cloud-run-site-refresh` Branch | 2026-04-20 |
| EWB-015 | UI Automation MCP Assessment | 2026-04-20 |

### 🔵 In Progress (2)
| Ticket | Title | Blocker |
|--------|-------|---------|
| EWB-004 | Content Publishing System — Month 1 | EWB-003 (LinkedIn profile) |
| EWB-012 | Validation System & Weekly Reviews | Awaiting first week of activity |

### 🔲 Backlog (6)
| Ticket | Title | Priority | Phase |
|--------|-------|----------|-------|
| EWB-003 | LinkedIn Profile Overhaul | High | Phase 1 / Week 1 |
| EWB-005 | Warm Outbound Campaign | High | Phase 1 / Week 1–4 |
| EWB-006 | Referral Activation Campaign | High | Phase 1 / Week 2–4 |
| EWB-007 | Sales Enablement Setup | High | Phase 1 / Week 2–3 |
| EWB-010 | A/B Testing PODs Setup | Medium | Phase 2 / Week 5+ |
| EWB-011 | Certification Program — Tier 1 | Low | Phase 2 / Month 2+ |

## Critical Path

```
EWB-003 (LinkedIn Profile) ← NEXT ACTION
  └─► EWB-004 (Content Publishing) — blocked until profile is updated
  └─► EWB-005 (Warm Outbound) — profile is first impression
  └─► EWB-006 (Referrals) — profile is first impression
EWB-007 (Sales Enablement) — can run in parallel via HubSpot MCP
EWB-012 (Weekly Reviews) — start first Friday after activity begins
```

## Workflow

1. New tickets go in `backlog/`
2. Move to `in-progress/` when work begins — update internal `Status:` field
3. Move to `done/` when all acceptance criteria met — update `Status:`, add `Completed:` date
4. Add a row to `decision-log.md` for any decision affecting strategy, architecture, or tooling
5. Keep `Audit Trail` in each ticket current with dated entries

## Related Files
- `decision-log.md` — All project decisions with rationale (22 entries as of 2026-04-20)
- `../EWB-013-completion-report.md` — Detailed infrastructure deployment report
