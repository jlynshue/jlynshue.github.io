---
date: 2026-04-18
agent: cline
category: execution-plan
tags: [execution, strategy, overview, patterns]
---

# Execution Plan — Executive Workflow Business

## Purpose

This folder translates the strategy documents (00-08) into a step-by-step execution plan with calendars, testing frameworks, technology assessments, and concrete activities across all channels.

## Patterns Used

The following patterns from `memory/patterns/` were applied in building this plan:

| Pattern | Application |
|---------|-------------|
| **output-conventions.md** | File naming (date-first kebab-case), YAML frontmatter on all files, category folder taxonomy |
| **plan-comparison-methodology.md** | "Stabilize before expanding" — website and LinkedIn foundation first, then content expansion. "Cherry-pick over wholesale adoption" — highest-leverage activities per channel. Internal consistency checks across all execution docs |
| **priority-methodology.md** | Unified scoring rubric adapted for activity prioritization. Phase gating from the implementation plan structure. Weighted scoring for deciding what to execute first |
| **priority-os.md** | "Single pane of glass" principle — all execution activities tracked in one system. Morning ritual pattern adapted for weekly execution reviews. Automated brief generation concept applied to KPI dashboards |
| **anthropic-harness-design.md** | Three-agent architecture (Plan → Execute → Verify) mapped to content workflow: plan content → publish → measure results. "Constrain on deliverables, not implementation" applied to content creation |
| **karpathy-techniques-command-surface.md** | Command surface thinking applied to tech stack — every tool should have clear input/output, be scriptable, and composable. Shell-first principle for automation |

## Activity Prioritization Rubric

Adapted from `priority-methodology.md`:

| Factor | Weight | Description |
|--------|--------|-------------|
| Strategic Alignment | 0.30 | Does this directly support the workflow wedge positioning? |
| Revenue Impact | 0.25 | Does this create or accelerate paid conversations? |
| Time Criticality | 0.20 | Is this blocking other high-value activities? |
| Effort Efficiency | 0.15 | Value delivered per hour invested |
| Compound Effect | 0.10 | Does this create assets that compound over time? |

### Score Interpretation

- **4.5–5.0:** Do this week — it is blocking revenue or positioning
- **3.5–4.4:** Do this sprint (2 weeks) — high value, schedule it
- **2.5–3.4:** Do this month — important but not urgent
- **1.5–2.4:** Backlog — do after higher priorities are locked
- **1.0–1.4:** Defer or drop — does not move the needle now

## Execution Folder Index

| File | Purpose | Priority |
|------|---------|----------|
| [01-website-execution.md](./01-website-execution.md) | Website updates, copy, structure, A/B tests | Week 1 start |
| [02-linkedin-execution.md](./02-linkedin-execution.md) | LinkedIn profile, posting cadence, engagement | Week 1 start |
| [03-content-publishing-plan.md](./03-content-publishing-plan.md) | Editorial calendar, content production workflow | Week 1 start |
| [04-social-media-execution.md](./04-social-media-execution.md) | Platform tactics, repurposing, secondary channels | Week 3 start |
| [05-marketing-campaigns.md](./05-marketing-campaigns.md) | Campaigns, lead magnets, outbound, referrals | Week 1 start |
| [06-sales-enablement.md](./06-sales-enablement.md) | Sales assets, CRM, pipeline tracking | Week 2 start |
| [07-ab-testing-strategy.md](./07-ab-testing-strategy.md) | Multivariate testing, A/B testing PODs | Week 3 start |
| [08-certification-strategy.md](./08-certification-strategy.md) | Certifications that matter, timeline, ROI | Month 2 start |
| [09-technology-stack.md](./09-technology-stack.md) | Tools assessment, open source / low cost | Week 1 start |
| [10-90-day-calendar.md](./10-90-day-calendar.md) | Week-by-week execution calendar | Reference doc |
| [11-validation-experiments.md](./11-validation-experiments.md) | Experiment log, hypothesis testing | Ongoing |
| [12-kpi-dashboard.md](./12-kpi-dashboard.md) | Metrics tracking, weekly review | Ongoing |
| [templates/](./templates/) | Reusable templates for posts, reviews, experiments | Reference |

## Execution Phases

### Phase 1: Foundation Lock (Weeks 1–4)

Focus: Get the website, LinkedIn profile, and first content live. Start warm outbound.

Key deliverables:
- Website homepage rewrite with workflow positioning
- LinkedIn profile overhaul
- 12 LinkedIn posts published
- First lead magnet live
- 15+ warm outbound messages sent
- Technology stack set up

### Phase 2: Proof Expansion (Weeks 5–8)

Focus: Build content inventory, start A/B testing, increase outbound, pursue first discovery calls.

Key deliverables:
- Second lead magnet live
- 24 cumulative LinkedIn posts
- First A/B tests running on website
- 30+ warm outbound messages sent
- First discovery calls from social or outbound

### Phase 3: Conversion Pressure (Weeks 9–12)

Focus: Tighten offer messaging, publish case studies, convert discovery calls to diagnostics.

Key deliverables:
- First case study or anonymized engagement story
- Offer-led content sequence
- Diagnostic pitch refined from real objections
- Validation scorecard assessed against 90-day thresholds
- Certification study started

## Weekly Review Cadence

Every Friday, 30 minutes:

1. Review KPI dashboard (12-kpi-dashboard.md)
2. Log experiment results (11-validation-experiments.md)
3. Assess validation signals against 07-validation-signals.md thresholds
4. Plan next week's content and outreach
5. Update this plan if priorities shift

## Decision Standard

Following the strategy's own standard:

> If an execution activity does not strengthen the `Executive Workflow Sprint` positioning or create a path to paid conversations, it should not be prioritized this quarter.
