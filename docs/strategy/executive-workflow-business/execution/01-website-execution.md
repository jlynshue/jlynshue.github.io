---
date: 2026-04-18
agent: cline
category: execution-plan
tags: [website, execution, conversion, ab-testing]
---

# Website Execution Plan

## Strategic Context

From `03-website-branding.md`: The website is a credibility filter, conversion point, and compact proof dossier. It is not a full agency site, broad portfolio, or generic personal brand page.

**Pattern applied:** `plan-comparison-methodology.md` — "Stabilize before expanding." Get the core homepage right before adding pages.

## Phase 1: Homepage Rewrite (Week 1–2)

### Priority Score: 4.8 / 5.0

This is the single highest-leverage website activity. Every other channel (LinkedIn, outbound, referrals) drives traffic here. If the homepage does not convert, nothing else matters.

### Homepage Narrative Flow

Following the 6-section architecture from strategy:

#### Section 1: Hero

**Headline:**
> I build AI workflow systems that remove executive reporting and coordination bottlenecks.

**Subhead:**
> For CIO, COO, and ops-led teams using Microsoft 365, Jira, Confluence, and Slack or Teams. One workflow. Ten business days. Clearer decisions. Less reporting drag.

**Primary CTA:** `Schedule a Discovery Call`
**Secondary Link:** `See How The Sprint Works`

**Implementation notes:**
- Hero must load above the fold on desktop and mobile
- CTA button should be high-contrast, not subtle
- No stock AI imagery — keep the current editorial, restrained visual style
- Consider adding a subtle trust badge strip below the CTA (e.g., "Trusted by teams at [recognizable brands]")

#### Section 2: Proof Strip

**Purpose:** Establish real operating environment credibility

**Content format:**
- 3–5 recognizable brand logos or one-line proof points
- No vanity overload — keep it sparse and credible
- Example: "Enterprise data governance for a Fortune 500 analytics platform"

**Implementation notes:**
- Grayscale logos on light background
- One line of supporting text per proof point
- No click-through needed — this is a trust signal, not a portfolio

#### Section 3: Problem Section

**Title:** `Where Executive Workflows Break`

**Content blocks (4 pain points):**
1. Reporting stitched together manually from too many systems
2. Decisions delayed because evidence is scattered across docs, tickets, and chat
3. Action items lost between meetings, documents, and messaging
4. AI outputs not trusted because they are not source-linked

**Implementation notes:**
- Use icon + short text format
- Each pain should be recognizable in 5 seconds
- No jargon — buyer language only

#### Section 4: Offer Section

**Title:** `The Executive Workflow Sprint`

**Content:**
- 3-day paid diagnostic ($2.5k)
- 10-day implementation sprint ($12k)
- 1 workflow, max 4 systems
- Source-linked output and handoff

**Implementation notes:**
- Clean card or step format
- Show pricing transparently — this filters out non-buyers
- Include "diagnostic fee credited toward sprint" as a trust signal

#### Section 5: How It Works

**Title:** `From Workflow Friction To Working System`

**Steps:**
1. Discovery Call → qualify the pain
2. Paid Diagnostic → map the workflow, quantify waste
3. 10-Day Sprint → implement one workflow end to end
4. Optional Retainer → stabilize and expand

**Implementation notes:**
- Horizontal or vertical step flow
- Each step gets a one-line description
- Arrow or connector visual between steps

#### Section 6: Engagement Examples

**Purpose:** Prove operating depth with outcome narratives

**Framing:**
- Problem → Systems Involved → Outcome
- Less resume, more problem/outcome
- 2–3 examples maximum

**Implementation notes:**
- Card format with expandable detail
- Include systems handled (M365, Jira, Confluence, etc.)
- Emphasize governance, trust, and operational complexity

#### Section 7: Fit Filter

**Title:** `Best Fit`

**Content:**
- ✅ Right for: ops-heavy teams with recurring reporting or coordination pain, 50–2000 employees, multiple systems already in place
- ❌ Not right for: generic app builds, vague AI strategy requests, low-cost automation, solo founders

**Implementation notes:**
- Two-column or checklist format
- This section reduces unqualified inquiries

#### Section 8: Contact CTA

**Title:** `Schedule a Discovery Call`

**Content:**
- Limited engagements
- Narrow focus on one workflow
- Clear next step

**Implementation notes:**
- Full-width CTA section
- Cal.com embed or link
- No contact form — direct to scheduling

### Homepage Copy Checklist

Before publishing, verify every section against:

- [ ] Does it lead with buyer pain, not your resume?
- [ ] Does it use workflow language more than technology language?
- [ ] Is every section tied to one recurring bottleneck?
- [ ] Does it prefer specificity over breadth?
- [ ] Are named tools used only when they help qualification?
- [ ] Does every proof point support trust, speed, or clarity?

## Phase 2: Supporting Pages (Week 3–4)

### Workflow Sprint Page

**Priority Score: 3.8 / 5.0**

Dedicated page for `See How The Sprint Works` CTA.

**Content:**
- Expanded sprint scope and delivery model
- Day-by-day breakdown (from 01-product-strategy.md)
- Default workflow types
- What is included / excluded
- Customer outcomes with measurable targets
- CTA: `Schedule a Discovery Call`

### Workflow Diagnostic Page

**Priority Score: 3.5 / 5.0**

**Content:**
- What the diagnostic covers
- 3-day timeline
- Deliverables (workflow map, bottleneck analysis, trust review, implementation recommendation)
- Pricing ($2.5k, credited toward sprint)
- CTA: `Schedule a Discovery Call`

## Phase 3: Optimization (Week 5+)

### A/B Testing Integration

See `07-ab-testing-strategy.md` for full testing framework.

**Initial tests:**
1. Hero headline: canonical line vs. pain-led variant vs. outcome-led variant
2. CTA text: "Schedule a Discovery Call" vs. "Book Your Workflow Review" vs. "See If You're a Fit"
3. Proof strip: with logos vs. without logos vs. text-only proof points
4. Pricing visibility: show pricing on homepage vs. reveal on sprint page only

### Analytics Setup

**Required (Week 1):**
- Firebase Hosting for static delivery and same-domain rewrites
- Cloud Run collector for HTML page views, tracked CTA redirects, and webhook ingestion
- Server-side PostHog capture for page views, referral sources, CTA clicks, bookings, and lead capture
- Cal.com and Tally webhooks connected to HubSpot attribution sync

**Optional (Week 3+):**
- Server-side experiment assignment once baseline traffic exists
- Client-side tools like Hotjar only if you explicitly accept frontend instrumentation later

### Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| Homepage → CTA click rate | > 5% | PostHog `cta_clicked` from `/r/discovery-call` |
| Sprint page visit rate | > 15% of homepage visitors | PostHog `page_viewed` grouped by path |
| Discovery call booking rate | > 2% of homepage visitors | Cal.com webhook + PostHog `calendar_booked` |
| Lead magnet capture rate | > 3% of landing-page visitors | Tally webhook + PostHog `lead_captured` |
| Qualified lead rate | > 30% of discovery calls | HubSpot stage sync + PostHog lifecycle events |

## Services Reframe

From strategy: Current site services are too broad. Collapse into workflow-centered frame.

### Replace

Old broad categories → New focused structure:

1. **Executive Workflow Sprint** — remove one recurring reporting or coordination bottleneck
2. **Workflow Diagnostic** — map, quantify, and scope the right fix
3. **Workflow Tuning Retainer** — stabilize and extend working systems

### Support Capabilities (not front-door services)

These appear as proof/credibility, not as sellable services:
- Executive systems design
- Cross-system integration
- Analytics and governance
- Automation architecture
- Technical delivery

## Technical Implementation Notes

### Current Stack

- React 18 + React Router 6 (SPA)
- TypeScript + Vite
- TailwindCSS 3
- Firebase Hosting + Cloud Run
- PostHog + HubSpot server-side measurement

### Required Changes

1. Update homepage component with new section architecture
2. Add sprint page route
3. Add diagnostic page route
4. Replace direct CTA links with tracked redirect endpoints
5. Integrate Cal.com and Tally webhook ingestion on Cloud Run
6. Remove browser analytics tags and rely on server-side pageview capture
7. Update meta tags and OG images for social sharing

### Mobile Considerations

- Hero CTA must be visible without scrolling on mobile
- Proof strip should stack vertically on mobile
- All sections should be readable on 375px width
- Schedule button should be sticky on mobile (consider fixed bottom CTA)
