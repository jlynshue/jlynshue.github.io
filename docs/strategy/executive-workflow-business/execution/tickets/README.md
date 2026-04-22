# EWB Ticket Board

## Summary

| Status | Count | Tickets |
|--------|:-----:|---------|
| ✅ Done | 10 | EWB-001, 002, 003, 007, 008, 009, 010, 013, 014, 015 |
| 🔵 In Progress | 2 | EWB-004, 012 |
| 🔲 Backlog | 3 | EWB-005, 006, 011 |

## Critical Path

```
EWB-004 (Content publishing — Week 1 live, ongoing)
  └─► EWB-012 (Weekly reviews — start first Friday after publishing)

EWB-005 (Warm outbound) ← independent, human-driven
EWB-006 (Referrals) ← independent, human-driven
EWB-011 (Certifications) ← deferred to Month 2+
```

## Board

### ✅ Done (10)
- **EWB-001** — Technology Stack Deployment
- **EWB-002** — Website Homepage Rewrite
- **EWB-003** — LinkedIn Profile Overhaul (R3/R5 deferred)
- **EWB-007** — Sales Enablement Setup (HubSpot pipeline)
- **EWB-008** — Social Media Channels Setup
- **EWB-009** — Website Supporting Pages (Sprint + Diagnostic)
- **EWB-010** — A/B Testing PODs Setup (infra ready, SDK dormant)
- **EWB-013** — Firebase + Cloud Run Infrastructure
- **EWB-014** — Branch Merge to Main
- **EWB-015** — UI Automation MCP Assessment

### 🔵 In Progress (2)
- **EWB-004** — Content Publishing System (Week 1 posts live + scheduled)
- **EWB-012** — Validation System & Weekly Reviews

### 🔲 Backlog (3)
- **EWB-005** — Warm Outbound Campaign
- **EWB-006** — Referral Activation
- **EWB-011** — Certification Strategy (MS-102 + ACP-620)

## Workflow
1. Tickets move: `backlog/` → `in-progress/` → `done/`
2. Update internal `Status:` field when moving
3. Add audit trail entry for every status change
4. Related files: `decision-log.md`, `../content/`, `../tracking/`

## Related Documentation
- [EWB-013 Completion Report](../EWB-013-completion-report.md)
- [Sprint Harness Plan](../sprint-harness-plan.md)
- [Next Phase Plan (Aider + GitHub)](../next-phase-plan-aider-github.md)
- [Executive Measurement Plan](../content/executive-measurement-plan.md)
- [Executive Content Research Plan](../content/executive-content-research-plan.md)
