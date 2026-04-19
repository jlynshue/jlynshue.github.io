---
date: 2026-04-18
agent: cline
category: execution-plan
tags: [sales, enablement, crm, pipeline, discovery]
---

# Sales Enablement Execution Plan

## Strategic Context

From `08-sales-strategy.md`: The fastest path to revenue is clear positioning → warm/adjacent outbound → proof-backed discovery → paid diagnostic → tightly scoped sprint.

**Pattern applied:** `priority-os.md` — Single pane of glass for pipeline tracking. All opportunities tracked in one system with clear stage definitions.

## CRM & Pipeline Setup (Week 2)

### Priority Score: 4.2 / 5.0

### HubSpot Free CRM Configuration

HubSpot Free CRM is already available via MCP integration. Configure it for this specific pipeline.

#### Deal Pipeline Stages

Create a custom deal pipeline called "Executive Workflow Sprint":

| Stage | Definition | Exit Criteria |
|-------|-----------|---------------|
| Identified | Account matches ICP, pain is plausible | Research complete |
| Contacted | Outreach sent (any channel) | Message delivered |
| Engaged | Relevant reply or conversation started | Response received |
| Discovery Scheduled | Call booked | Cal.com confirmation |
| Qualified | Workflow pain, owner, and budget confirmed | 3+ of 5 must-haves met |
| Diagnostic Proposed | Paid diagnostic offered | Proposal sent |
| Diagnostic Sold | Diagnostic closed ($2.5k) | Payment received |
| Sprint Proposed | Sprint proposal sent ($12k) | Proposal delivered |
| Sprint Sold | Sprint closed ($12k) | SOW signed |
| Retainer Candidate | Sprint successful, expansion visible | Client satisfied |

#### Contact Properties (Custom)

Add these custom properties to HubSpot contacts:

| Property | Type | Purpose |
|----------|------|---------|
| `workflow_pain` | Text | Description of their specific workflow bottleneck |
| `systems_stack` | Multi-select | M365, Jira, Confluence, Slack, Teams, Other |
| `icp_fit_score` | Number (1–5) | How well they match the ICP |
| `source_channel` | Dropdown | LinkedIn, Referral, Warm outbound, Cold outbound, Website |
| `qualification_status` | Dropdown | Unqualified, Qualified, Not a fit |

### Qualification Rubric

From strategy — every opportunity checked against five requirements:

| # | Must-Have | How to Verify |
|---|----------|---------------|
| 1 | One recurring workflow pain | Discovery call question 1 |
| 2 | One accountable owner or sponsor | Discovery call question 5 |
| 3 | Existing systems already in place | Discovery call question 2 |
| 4 | Measurable cost of current friction | Discovery call question 4 |
| 5 | Budget path for sub-$15k pilot | Discovery call question 6 |

**Rule:** If 3 or fewer are true, do not push the sprint.

## Discovery Call Preparation

### Pre-Call Checklist

Before every discovery call:

- [ ] Research the company (size, industry, systems used)
- [ ] Check LinkedIn for recent posts about ops/workflow pain
- [ ] Prepare 1–2 hypotheses about their specific workflow challenge
- [ ] Have the qualification rubric ready
- [ ] Have Cal.com link ready for scheduling diagnostic if qualified

### Discovery Call Script

**Duration:** 30 minutes

**Opening (2 min):**
"Thanks for taking the time. I'll keep this focused. I work with operations-heavy teams on a specific problem — recurring executive workflows that are still manually assembled across multiple tools. I'd love to understand what that looks like for your team."

**Core Questions (20 min):**

1. "What recurring workflow is most painful right now?"
   - Listen for: weekly readouts, status updates, decision briefs, cross-functional handoffs

2. "What systems are involved?"
   - Listen for: M365, Jira, Confluence, Slack, Teams — the more fragmented, the better fit

3. "How is it handled today?"
   - Listen for: manual assembly, copy-paste between tools, someone owns it reluctantly

4. "What does it cost in time, trust, or missed action?"
   - Listen for: hours per week, delayed decisions, low trust in outputs, dropped action items

5. "Who owns the outcome?"
   - Listen for: a real person with authority, not "the team" or "we all do"

6. "What would good look like in 30 days?"
   - Listen for: specific, measurable improvement — not vague transformation language

**Assessment (3 min):**
Mentally score against the 5 must-haves.

**Close (5 min):**

If qualified:
"Based on what you've described, this sounds like a strong fit for a Workflow Diagnostic. That's a 3-day paid engagement where I map the workflow, quantify the waste, and deliver a clear implementation recommendation. It's $2,500, and that fee is fully credited if you move to a sprint within 7 days. Would you like to explore that?"

If not qualified:
"Appreciate you sharing this. Based on what I'm hearing, [specific reason] makes this not the strongest fit for the sprint right now. [Optional: suggest what might help, or offer to reconnect later.]"

If ambiguous:
"I'd like to think on this and send you a brief note with my honest assessment of whether this is a fit. I'll follow up by [specific day]."

### Post-Call Follow-Up

**Within 24 hours:**

1. Send a concise recap email
2. Restate the workflow problem in the buyer's own language
3. Recommend either: no fit, diagnostic, or "let me think and follow up"
4. Include clear CTA and timeline

**Follow-Up Email Template:**

```
Subject: Following up — [their workflow pain in their words]

Hi [name],

Thanks for the conversation today. Here's what I took away:

**The pain:** [restate in their language]
**The cost:** [time, trust, or missed-action impact they mentioned]
**The systems involved:** [list their stack]

Based on this, I think a Workflow Diagnostic would be the right next step. 
In 3 business days, I'd deliver:
- A workflow map of the current state
- A bottleneck and waste analysis
- A recommended target workflow with implementation path

The investment is $2,500, fully credited toward the sprint if you proceed 
within 7 days.

If you'd like to move forward, here's my calendar: [link]

Happy to answer any questions in the meantime.

[name]
```

## Proposal Templates

### Diagnostic Proposal (1-page)

**Sections:**
1. Problem Statement (in buyer's language)
2. Diagnostic Scope (3 days, what's included)
3. Deliverables (workflow map, bottleneck analysis, recommendation)
4. Investment ($2,500, credited toward sprint)
5. Timeline
6. Next Step (sign and schedule kickoff)

### Sprint Proposal (2-page)

**Sections:**
1. Current-State Problem (from diagnostic findings)
2. Future-State Workflow Outcome
3. Systems Included (max 4)
4. Outputs Delivered (working workflow, runbook, adoption handoff)
5. Scope Boundaries (what's excluded)
6. Timeline (10 business days)
7. Investment ($12,000, 60/40 payment structure)
8. Success Criteria
9. Next Step (sign SOW)

## Objection Handling Quick Reference

| Objection | Response |
|-----------|----------|
| "We already have the tools." | "That's usually the point. The problem is the workflow between tools, not the absence of tools." |
| "We're still figuring out our AI strategy." | "The sprint is deliberately narrow — you don't need a full AI strategy to prove value on one workflow." |
| "Can you just give us a roadmap?" | "The diagnostic delivers a decision-ready workflow spec, not a vague strategy deck." |
| "Can this be bigger?" | "Possibly later. The first step is intentionally one workflow so it can be implemented and measured quickly." |
| "We need to think about budget." | "The diagnostic is the budget-light way to reduce uncertainty before a larger commitment." |
| "We've been burned by AI projects before." | "That's exactly why this is scoped to one workflow with source-linked outputs and clear success criteria." |

## Sales Assets Inventory

### Required (Create by Week 3)

| Asset | Format | Purpose | Status |
|-------|--------|---------|--------|
| One-page offer summary | PDF | Attach to follow-ups | [ ] To create |
| Discovery call prep sheet | Internal doc | Pre-call research | [ ] To create |
| Diagnostic proposal template | Google Doc / PDF | Formal diagnostic proposal | [ ] To create |
| Sprint proposal template | Google Doc / PDF | Formal sprint proposal | [ ] To create |
| Post-call follow-up template | Email template | Standardize follow-ups | [ ] To create |

### Nice-To-Have (Create by Week 6)

| Asset | Format | Purpose | Status |
|-------|--------|---------|--------|
| Diagnostic brief sample | PDF (anonymized) | Make the diagnostic tangible | [ ] To create |
| Case study | PDF or web page | Social proof | [ ] After first engagement |
| ROI calculator | Spreadsheet | Quantify reporting waste | [ ] After first diagnostic |
| FAQ document | PDF or web page | Handle common questions | [ ] To create |

## Sales Metrics

| Metric | Target | Tracking |
|--------|--------|----------|
| Discovery-to-diagnostic rate | > 30% | HubSpot pipeline |
| Diagnostic-to-sprint rate | > 50% | HubSpot pipeline |
| Average sales cycle (contact to diagnostic) | < 14 days | HubSpot deal age |
| Average sales cycle (diagnostic to sprint) | < 10 days | HubSpot deal age |
| Sprint-to-retainer rate | > 40% | HubSpot pipeline |
| Common objection frequency | Track top 3 | Weekly review notes |

## Sales Standard

From strategy:

> If the buyer conversation is drifting away from a recurring workflow bottleneck and toward generic consulting, tighten the scope or walk away.
