---
date: 2026-04-18
agent: cline
category: execution-plan
tags: [ab-testing, multivariate, experimentation, optimization]
---

# A/B Testing & Multivariate Testing Strategy

## Strategic Context

Testing is not optional — it is how you compress learning cycles and avoid wasting effort on messaging that does not convert. Every channel (website, LinkedIn, outbound) should have active experiments running by Week 5.

**Pattern applied:** `anthropic-harness-design.md` — Plan → Execute → Verify. Every test follows a hypothesis → experiment → measurement → decision loop. `plan-comparison-methodology.md` — "Cherry-pick" winners; do not run tests without clear decision criteria.

## Testing Philosophy

### Principles

1. **Test one variable at a time** unless running a true multivariate design
2. **Define success before running** — no post-hoc interpretation
3. **Minimum sample size matters** — do not call winners on small numbers
4. **Kill losers fast, scale winners slowly** — bias toward action
5. **Document everything** — every test goes in the experiment log (11-validation-experiments.md)

### When to Test vs. When to Ship

- **Test when:** You have two plausible options and enough traffic/volume to get a signal in 2 weeks
- **Ship when:** The choice is obvious, or traffic is too low for statistical significance in a reasonable timeframe

For this business in Phase 1, traffic will be low. Focus on:
- LinkedIn post format tests (immediate feedback via engagement)
- Outbound message tests (small sample, quick signal)
- Website tests only after traffic exceeds ~200 visits/week

## Testing PODs

### POD 1: Website Testing

**Start:** Week 5 (after homepage is live and getting traffic)
**Tool:** GrowthBook (open source, free self-hosted)
**Minimum traffic:** 200 unique visitors/week for meaningful tests

#### Test 1: Hero Headline

| Variant | Headline |
|---------|----------|
| A (Control) | "I build AI workflow systems that remove executive reporting and coordination bottlenecks." |
| B (Pain-led) | "Your weekly leadership update shouldn't take 5 hours to assemble." |
| C (Outcome-led) | "One workflow. Ten business days. Clearer decisions." |

**Primary metric:** CTA click rate
**Secondary metric:** Time on page, scroll depth
**Duration:** 2 weeks minimum or 100 visitors per variant
**Decision rule:** Variant with highest CTA click rate wins. If difference < 5%, keep control.

#### Test 2: CTA Button Text

| Variant | CTA Text |
|---------|----------|
| A (Control) | "Schedule a Discovery Call" |
| B | "Book Your Workflow Review" |
| C | "See If You're a Fit" |

**Primary metric:** CTA click rate
**Duration:** 2 weeks
**Decision rule:** Highest click-through wins

#### Test 3: Proof Strip

| Variant | Treatment |
|---------|-----------|
| A (Control) | Brand logos in grayscale |
| B | Text-only proof points (no logos) |
| C | No proof strip |

**Primary metric:** CTA click rate
**Secondary metric:** Bounce rate
**Duration:** 2 weeks

#### Test 4: Pricing Visibility

| Variant | Treatment |
|---------|-----------|
| A (Control) | Show pricing on homepage |
| B | Hide pricing, reveal on sprint page only |

**Primary metric:** Discovery call booking rate
**Secondary metric:** Sprint page visit rate
**Duration:** 3 weeks (need downstream conversion data)

### Multivariate Matrix (Website)

For when traffic is sufficient (200+/week per variant combination):

| | CTA A | CTA B | CTA C |
|---|-------|-------|-------|
| **Headline A** | A/A | A/B | A/C |
| **Headline B** | B/A | B/B | B/C |
| **Headline C** | C/A | C/B | C/C |

**Total combinations:** 9
**Required traffic:** ~1800 visitors (200 per cell)
**Timeline:** Only run this after you have sufficient traffic — likely Month 3+
**Tool:** GrowthBook multivariate feature

### POD 2: LinkedIn Testing

**Start:** Week 1 (immediate — every post is a test)
**Tool:** LinkedIn native analytics + manual tracking spreadsheet

#### Test 1: Hook Style

| Week | Hook Style | Example |
|------|-----------|---------|
| 1 | Question hook | "What recurring report eats the most time on your team?" |
| 2 | Bold statement | "Most weekly leadership updates are assembled by hand." |
| 3 | Statistic/number | "The 7 hidden steps inside a weekly exec readout:" |
| 4 | Contrarian | "Your stack is not your workflow." |

**Primary metric:** Impressions + comment count
**Secondary metric:** Profile visits, saves
**Decision rule:** Double down on the hook style that generates most ICP-relevant comments

#### Test 2: Post Length

| Variant | Length | When |
|---------|--------|------|
| Short | 3–5 lines | Week 1–2 |
| Medium | 8–12 lines | Week 2–3 |
| Long | 15–20 lines | Week 3–4 |

**Metric:** Impressions, engagement rate, saves
**Decision rule:** Optimal length = highest engagement rate from ICP titles

#### Test 3: CTA Placement

| Variant | CTA Position |
|---------|-------------|
| A | No CTA (just insight) |
| B | Soft CTA at end (question to drive comments) |
| C | Direct CTA (link to site or scheduling) |

**Metric:** Comments, DMs, site visits
**Decision rule:** Best CTA position = most qualified conversations generated

#### Test 4: Posting Time

| Slot | Time (ET) | Rationale |
|------|-----------|-----------|
| A | 7:30 AM | Before work commute |
| B | 9:00 AM | Start of business day |
| C | 12:00 PM | Lunch break scrolling |
| D | 5:00 PM | End of day wind-down |

**Test across 4 weeks:** Rotate posting times, measure impressions at 24 hours
**Decision rule:** Pick the 2 slots with highest first-hour engagement

### POD 3: Outbound Testing

**Start:** Week 1
**Tool:** HubSpot email tracking + manual spreadsheet

#### Test 1: Subject Line

| Variant | Subject | When |
|---------|---------|------|
| A | "Quick question about [company]" | Week 1 |
| B | "Workflow friction in ops teams" | Week 2 |
| C | "[Specific pain] at [company]" | Week 3 |

**Metric:** Open rate, reply rate
**Sample:** 10 messages per variant
**Decision rule:** Highest reply rate wins

#### Test 2: Pain Framing

| Variant | Lead Sentence |
|---------|---------------|
| A | Reference to reporting pain | 
| B | Reference to coordination pain |
| C | Reference to trust/AI adoption pain |

**Metric:** Reply rate, positive reply sentiment
**Decision rule:** Framing that generates most "yes, we have that problem" replies

#### Test 3: Proof Attachment

| Variant | Attachment |
|---------|-----------|
| A | No attachment |
| B | Lead magnet (Executive Workflow Audit) |
| C | Relevant LinkedIn post link |

**Metric:** Reply rate, CTA click rate
**Decision rule:** Highest qualified reply rate

## Statistical Rigor

### Minimum Sample Sizes

| Channel | Minimum per variant | Confidence level |
|---------|-------------------|-----------------|
| Website (CTA click) | 200 visitors | 95% |
| LinkedIn (engagement) | 5 posts per variant | Directional only |
| Outbound (reply rate) | 10 messages per variant | Directional only |

### Decision Framework

| Signal Strength | Sample Size | Action |
|----------------|-------------|--------|
| Strong (>20% difference) | Any | Implement winner immediately |
| Moderate (10–20% difference) | Minimum met | Implement winner, monitor for 2 more weeks |
| Weak (<10% difference) | Minimum met | Keep control, test a bolder variant |
| Inconclusive | Below minimum | Continue test or increase sample |

### Anti-Patterns

- ❌ Calling a winner after 3 days of website traffic
- ❌ Testing 5 variables simultaneously without multivariate design
- ❌ Running tests without defining success criteria first
- ❌ Ignoring quality of engagement (ICP title matters more than raw numbers)
- ❌ Testing trivial differences (button color) before message-market fit

## Test Tracking

All tests are logged in `11-validation-experiments.md` with:
- Date range
- Hypothesis
- Variants
- Primary metric
- Sample size
- Result
- Decision
- Next action

## Testing Calendar

| Week | Website | LinkedIn | Outbound |
|------|---------|----------|----------|
| 1 | — (building) | Hook style A | Subject line A |
| 2 | — (building) | Hook style B, length test | Subject line B |
| 3 | Deploy analytics | Hook style C, CTA test | Subject line C, pain framing |
| 4 | Baseline data | Hook style D, time test | Proof attachment test |
| 5 | Hero headline test | Analyze and double down | Analyze and double down |
| 6 | CTA button test | Continue winning format | Continue winning approach |
| 7 | Proof strip test | Iterate | Iterate |
| 8 | Pricing visibility test | Iterate | Iterate |

## Testing Success Standard

> Testing is working when it produces clear, actionable insights that improve conversion rates at each funnel stage — not when it produces interesting data that does not change behavior.
