---
date: 2026-04-18
agent: cline
category: execution-plan
tags: [kpi, metrics, dashboard, tracking]
---

# KPI Dashboard & Metrics Tracking

## Strategic Context

**Pattern applied:** `priority-os.md` — Single pane of glass for all metrics. `priority-methodology.md` — Weighted scoring to focus on what matters most.

## Dashboard Structure

### Tier 1: Revenue Metrics (What Pays the Bills)

These are the only metrics that prove the business is working.

| Metric | Month 1 Target | Month 2 Target | Month 3 Target | Actual |
|--------|---------------|---------------|---------------|--------|
| Paid diagnostics sold | 0–1 | 1 | 1+ | |
| Sprints sold | 0 | 0–1 | 1+ | |
| Revenue (cumulative) | $0–$2.5k | $2.5k–$14.5k | $14.5k–$30k+ | |
| Retainer conversations | 0 | 0 | 1+ | |

### Tier 2: Pipeline Metrics (What Leads to Revenue)

These indicate whether revenue is coming.

| Metric | Week Target | Month 1 Target | Month 3 Target | This Week |
|--------|------------|---------------|---------------|-----------|
| Discovery calls booked | 1+ | 3+ | 8+ | |
| Discovery calls completed | 1+ | 3+ | 8+ | |
| Qualified calls (3+ must-haves) | — | 2+ | 5+ | |
| Diagnostic proposals sent | — | 1+ | 2+ | |
| Sprint proposals sent | — | 0 | 1+ | |
| Avg days: contact → diagnostic | — | <14 | <14 | |
| Discovery-to-diagnostic rate | — | >30% | >30% | |
| Diagnostic-to-sprint rate | — | — | >50% | |

### Tier 3: Leading Indicators (What Fills the Pipeline)

These show whether the funnel is healthy.

| Metric | Week Target | Month 1 Target | Month 3 Target | This Week |
|--------|------------|---------------|---------------|-----------|
| Outbound messages sent | 15+ | 40+ | 30+ | |
| Outbound response rate (warm) | >40% | >40% | >40% | |
| Outbound response rate (cold) | >10% | >10% | >15% | |
| Referral asks sent | 3+ | 10 | 5+ | |
| Referrals received | — | 2+ | 3+ | |

### Tier 4: Content & Social Metrics (What Builds the Funnel)

| Metric | Week Target | Month 1 Target | Month 3 Target | This Week |
|--------|------------|---------------|---------------|-----------|
| LinkedIn posts published | 3 | 12 | 12 | |
| Post impressions (avg) | 500+ | 500+ | 2,000+ | |
| Comments from ICP titles | 3+ | 10+ | 30+ | |
| Profile views from ICP | 50+ | 200+ | 600+ | |
| Inbound DMs from buyers | 1+ | 3+ | 10+ | |
| Lead magnet downloads | — | — | 10+ | |
| Website visitors | — | 100+ | 400+ | |
| Website CTA click rate | — | >3% | >5% | |

### Tier 5: Quality Filters

These are not numbers — they are yes/no checks on whether the right things are happening.

| Question | This Week |
|----------|-----------|
| Are inbound conversations about workflow pain specifically? | Yes / No |
| Are buyers in the defined ICP (CIO/COO/Ops, 50-2000 employees)? | Yes / No |
| Is the offer understood without explanation drift? | Yes / No |
| Are people describing you back in workflow language? | Yes / No |
| Are posts creating commercial conversations (not just likes)? | Yes / No |

## Weekly Review Template

### Friday Review (30 minutes)

**1. Numbers Check (10 min)**

Fill in the "This Week" column for all Tier 2–4 metrics above.

**2. Quality Check (5 min)**

Answer the Tier 5 quality filter questions.

**3. Experiment Review (5 min)**

- What experiments were running this week?
- What did you learn?
- Log results in `11-validation-experiments.md`

**4. Content Review (5 min)**

- Which LinkedIn post performed best this week? Why?
- Which post underperformed? Why?
- What topic should you write about next week?

**5. Next Week Planning (5 min)**

- What 3 LinkedIn posts will you publish?
- How many outbound messages will you send?
- Any discovery calls scheduled?
- Any proposals to send?
- What is the single most important thing to accomplish next week?

## Monthly Review Template

### End-of-Month Review (1 hour)

**1. Revenue Review**
- Total revenue this month
- Pipeline value (diagnostic + sprint proposals outstanding)
- Revenue trajectory: on track / behind / ahead

**2. Funnel Review**
- Where is the funnel leaking? (Which stage has the biggest drop-off?)
- What is the conversion rate at each stage?
- Where should you invest more time?

**3. Channel Review**
- Which channel produced the most qualified conversations?
- Which channel underperformed?
- Should you reallocate time between channels?

**4. Content Review**
- Top 3 performing posts (by ICP engagement, not vanity metrics)
- Content themes that resonated
- Content themes that fell flat

**5. A/B Test Review**
- What tests were completed?
- What did you learn?
- What tests are planned for next month?

**6. Validation Check**
- Score against the 30/60/90 day scorecard (from `11-validation-experiments.md`)
- Decision: Continue / Narrow / Pivot?
- If narrowing: What specifically needs to change?

**7. Next Month Priorities**
- Top 3 priorities for next month
- What will you stop doing?
- What will you start doing?

## Reporting Cadence

| Cadence | What | Where | Time |
|---------|------|-------|------|
| Daily | Quick check: any DMs, replies, or bookings? | LinkedIn + HubSpot + Cal.com | 5 min |
| Weekly | Full dashboard review + next week planning | This document | 30 min |
| Monthly | Comprehensive review + strategy adjustment | This document + experiments | 1 hour |
| Quarterly | Full business review + Phase planning | Strategy docs + execution plan | 2 hours |

## Dashboard Tools

| What | Where | How |
|------|-------|-----|
| LinkedIn metrics | LinkedIn native analytics | Manual weekly check |
| Website analytics | PostHog dashboards + Firestore event ledger | Bookmark + weekly check |
| Pipeline tracking | HubSpot CRM | Deal pipeline view |
| Scheduling metrics | Cal.com dashboard | Monthly check |
| A/B test results | Server-side experiment logs / GrowthBook when enabled | Weekly check only when active |
| Experiment log | `11-validation-experiments.md` | Manual update weekly |
| This dashboard | `12-kpi-dashboard.md` | Update every Friday |

## Metric Anti-Patterns

- ❌ Tracking vanity metrics (follower count, total impressions) as primary KPIs
- ❌ Celebrating engagement from non-ICP audiences
- ❌ Ignoring quality filters in favor of volume metrics
- ❌ Not updating the dashboard weekly (the data goes stale and you lose the feedback loop)
- ❌ Tracking too many metrics — focus on the tiers that matter at your current stage

## Stage-Appropriate Focus

| Stage | Primary Focus | Secondary Focus | Ignore For Now |
|-------|--------------|-----------------|----------------|
| Month 1 | Tier 3 (Leading) + Tier 5 (Quality) | Tier 2 (Pipeline) | Tier 1 (Revenue) |
| Month 2 | Tier 2 (Pipeline) + Tier 5 (Quality) | Tier 1 (Revenue) | Tier 4 (Content vanity) |
| Month 3 | Tier 1 (Revenue) + Tier 2 (Pipeline) | Tier 3 (Leading) | Content vanity |

## KPI Standard

> Metrics exist to inform decisions, not to feel productive. If a metric does not change what you do next week, stop tracking it.
