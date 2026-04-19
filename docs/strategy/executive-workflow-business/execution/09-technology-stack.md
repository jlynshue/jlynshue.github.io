---
date: 2026-04-18
agent: cline
category: execution-plan
tags: [technology, tools, open-source, stack]
---

# Technology Stack Assessment

## Strategic Context

The tech stack for executing this business should follow three principles:

1. **Low cost or free** — preserve capital for revenue-generating activities
2. **Open source preferred** — avoid vendor lock-in, enable customization
3. **Composable and scriptable** — tools should integrate cleanly and support automation

**Pattern applied:** `karpathy-techniques-command-surface.md` — Every tool should have a clear input/output interface, be scriptable, and composable. `priority-os.md` — Single pane of glass where possible.

> 2026-04-19 update: website hosting and analytics now run through Firebase Hosting + Cloud Run + PostHog with server-side tracking. Earlier Plausible and browser-tag assumptions are superseded.

## Stack Overview

```
┌─────────────────────────────────────────────────────────┐
│                    EXECUTION STACK                        │
├───────────────┬──────────────┬──────────────────────────┤
│   ATTRACT     │   CONVERT    │   DELIVER & MEASURE      │
├───────────────┼──────────────┼──────────────────────────┤
│ LinkedIn      │ Cal.com      │ HubSpot CRM (free)       │
│ Buffer        │ Website      │ Firebase + Cloud Run     │
│ Obsidian      │ Tally        │ GrowthBook               │
│               │ Resend       │ PostHog                  │
│               │              │ Notion / Obsidian        │
└───────────────┴──────────────┴──────────────────────────┘
```

## Detailed Tool Assessment

### Analytics & Tracking

#### Firebase Hosting + Cloud Run + PostHog ⭐ PRIMARY

| Attribute | Detail |
|-----------|--------|
| **Purpose** | Same-domain hosting, server-side page tracking, redirect capture, webhook ingestion, and attribution sync |
| **Cost** | Usage-based; expected to stay low at Phase 1 traffic |
| **Open source** | PostHog is open source; Firebase Hosting and Cloud Run are managed infrastructure |
| **Why this** | Preserves first-party attribution, supports real backend tracking, avoids frontend tags, and connects cleanly to HubSpot |
| **Alternative considered** | GitHub Pages + Plausible/GA4 — insufficient for server-side redirects, webhook ingestion, and same-domain measurement |
| **Setup effort** | 1–2 days for Firebase, Cloud Run, Firestore, Cloud Tasks, secrets, and preview deployment |
| **When to set up** | Week 1 before traffic acquisition starts |

**Key features needed:**
- HTML pageview capture on homepage, sprint page, diagnostic page, and other SPA routes
- Tracked redirect endpoints for CTA clicks and lead magnets
- Webhook ingestion for `Cal.com` bookings and `Tally` submissions
- Hourly HubSpot stage sync for downstream lifecycle events

### Scheduling

#### Cal.com ⭐ PRIMARY

| Attribute | Detail |
|-----------|--------|
| **Purpose** | Discovery call scheduling — zero-friction booking |
| **Cost** | $0 (self-hosted) or $0 (free tier hosted, 1 event type) |
| **Open source** | Yes — [github.com/calcom/cal.com](https://github.com/calcom/cal.com) |
| **Why this** | Open source Calendly alternative, embeddable, custom branding, integrations |
| **Alternative considered** | Calendly — works but closed source, free tier limited |
| **Setup effort** | 1 hour — configure event type, connect calendar, embed on site |
| **When to set up** | Week 1 |

**Configuration:**
- Event type: "Discovery Call — Executive Workflow"
- Duration: 30 minutes
- Buffer: 15 minutes before and after
- Availability: [set your preferred windows]
- Confirmation email: Include brief agenda and prep questions
- Embed: On website CTA sections and LinkedIn profile

### CRM & Pipeline

#### HubSpot Free CRM ⭐ PRIMARY

| Attribute | Detail |
|-----------|--------|
| **Purpose** | Contact management, deal pipeline, email tracking |
| **Cost** | $0 (free CRM) |
| **Open source** | No (but free tier is generous) |
| **Why this** | Already integrated via MCP, robust free tier, deal pipeline, contact properties |
| **Alternative considered** | Attio, Folk — newer but less mature; Twenty CRM — open source but early-stage |
| **Setup effort** | 2 hours — configure pipeline, custom properties, import contacts |
| **When to set up** | Week 2 |

**Free tier includes:**
- Unlimited contacts
- Deal pipeline (custom stages)
- Email tracking
- Meeting scheduling
- Basic reporting
- Mobile app

See `06-sales-enablement.md` for detailed pipeline configuration.

### A/B Testing

#### GrowthBook ⭐ PRIMARY

| Attribute | Detail |
|-----------|--------|
| **Purpose** | Website A/B testing, feature flags, multivariate testing |
| **Cost** | $0 (self-hosted) or $0 (free cloud tier, 10k users/month) |
| **Open source** | Yes — [github.com/growthbook/growthbook](https://github.com/growthbook/growthbook) |
| **Why this** | Open source and flexible, but should sit on top of the server-side measurement stack rather than browser event tags |
| **Alternative considered** | PostHog — excellent but heavier; Optimizely — expensive; VWO — expensive |
| **Setup effort** | 2–4 hours once server-side experiment assignment is designed |
| **When to set up** | Week 6+ after baseline traffic and conversion paths are stable |

**Key features:**
- Visual editor for simple tests
- Server-assigned variants or feature flags for programmatic tests
- Bayesian statistical engine
- Multivariate test support
- Feature flags for gradual rollouts

### Social Media Management

#### Buffer (Free Tier)

| Attribute | Detail |
|-----------|--------|
| **Purpose** | Schedule LinkedIn posts in advance |
| **Cost** | $0 (free tier: 3 channels, 10 scheduled posts per channel) |
| **Open source** | No |
| **Why this** | Simple LinkedIn scheduling, free tier sufficient for 3 posts/week |
| **Alternative considered** | Native LinkedIn scheduling (works but less flexible); Typefully (good but paid for LinkedIn) |
| **Setup effort** | 15 minutes |
| **When to set up** | Week 1 |

**Note:** Free tier limits to 10 queued posts. With 3 posts/week, this means scheduling ~3 weeks ahead. Upgrade to $6/month if needed.

### Email & Notifications

#### Resend + React Email

| Attribute | Detail |
|-----------|--------|
| **Purpose** | Transactional emails (discovery confirmations, follow-ups) and eventual newsletter |
| **Cost** | $0 (free tier: 3,000 emails/month) |
| **Open source** | React Email is open source — [github.com/resend/react-email](https://github.com/resend/react-email) |
| **Why this** | Modern email delivery, beautiful templates with React, generous free tier |
| **Alternative considered** | Buttondown — simple newsletter ($9/month); Mailgun — transactional only |
| **Setup effort** | 1 hour (when needed) |
| **When to set up** | Month 3 (only when newsletter or automated follow-ups are needed) |

### Lead Capture

#### Tally

| Attribute | Detail |
|-----------|--------|
| **Purpose** | Lead magnet download forms, contact forms, survey forms |
| **Cost** | $0 (free tier: unlimited forms, unlimited submissions) |
| **Open source** | No (but generous free tier) |
| **Why this** | Clean forms, no branding on free tier, webhook support, embeddable |
| **Alternative considered** | Typeform — expensive; Google Forms — unprofessional look |
| **Setup effort** | 30 minutes per form |
| **When to set up** | Week 2 (for first lead magnet) |

### Link Tracking

#### Dub.co

| Attribute | Detail |
|-----------|--------|
| **Purpose** | Shortened links with click tracking for outbound and social |
| **Cost** | $0 (free tier: 25 links/month, 1,000 clicks/month) |
| **Open source** | Yes — [github.com/dubinc/dub](https://github.com/dubinc/dub) |
| **Why this** | Open source, custom domains, click analytics, QR codes |
| **Alternative considered** | Bit.ly — works but less control; Short.io — paid |
| **Setup effort** | 15 minutes |
| **When to set up** | Week 1 (for CTA links in outbound) |

### Content & Editorial Management

#### Obsidian (Already in use)

| Attribute | Detail |
|-----------|--------|
| **Purpose** | Editorial calendar, content drafts, idea capture, knowledge management |
| **Cost** | $0 |
| **Open source** | Partially (free, but not fully open source) |
| **Why this** | Already in the workflow, local-first, markdown, extensible |
| **Setup effort** | Create an "Editorial" folder in Obsidian vault |
| **When to set up** | Week 1 |

### Document & Proposal Creation

#### Google Workspace or Notion

| Attribute | Detail |
|-----------|--------|
| **Purpose** | Proposal templates, diagnostic deliverables, client-facing documents |
| **Cost** | $0 (Google Docs free) or $0 (Notion free personal) |
| **Setup effort** | Create templates from 06-sales-enablement.md |
| **When to set up** | Week 2 |

### Design & Visual Assets

#### Canva (Free Tier)

| Attribute | Detail |
|-----------|--------|
| **Purpose** | LinkedIn banner, lead magnet PDFs, simple graphics |
| **Cost** | $0 (free tier) |
| **When to set up** | Week 1 (for LinkedIn banner and first lead magnet) |

## Setup Priority & Timeline

| Week | Tool | Action | Time |
|------|------|--------|------|
| 1 | Firebase + Cloud Run + PostHog | Deploy site, rewrites, collector, secrets | 1–2 days |
| 1 | Cal.com | Set up scheduling, embed on site | 1 hour |
| 1 | Buffer | Connect LinkedIn, schedule first posts | 15 min |
| 1 | Dub.co | Create account, set up first links | 15 min |
| 1 | Obsidian | Create editorial calendar structure | 30 min |
| 1 | Canva | Create LinkedIn banner | 30 min |
| 2 | HubSpot | Configure pipeline, custom properties | 2 hours |
| 2 | Tally | Create lead magnet download form | 30 min |
| 5 | GrowthBook | Install SDK, configure first test | 2 hours |
| 8+ | Resend | Set up when newsletter is ready | 1 hour |

## Monthly Cost Summary

| Tool | Monthly Cost | Annual Cost |
|------|-------------|-------------|
| Firebase + Cloud Run + PostHog | Usage-based | Variable |
| Cal.com (hosted free) | $0 | $0 |
| HubSpot (free CRM) | $0 | $0 |
| GrowthBook (free cloud) | $0 | $0 |
| Buffer (free) | $0 | $0 |
| Tally (free) | $0 | $0 |
| Dub.co (free) | $0 | $0 |
| Canva (free) | $0 | $0 |
| **Total** | **Low and usage-based** | **Variable** |

**Note:** The analytics and hosting layer now scales with usage instead of a fixed Plausible subscription. Review spend only after real traffic arrives.

## Stack Upgrade Triggers

Only upgrade tools when:

| Trigger | Action |
|---------|--------|
| Traffic or event volume grows materially | Review Cloud Run concurrency, Firestore indexes, and PostHog retention/pricing |
| Pipeline > 20 active deals | Consider HubSpot Starter ($20/month) |
| Newsletter > 500 subscribers | Consider Resend paid tier ($20/month) |
| A/B tests need > 10k users/month | Consider GrowthBook paid or self-host |
| Content scheduling > 10 posts/week | Consider Buffer paid ($6/month) |

## Anti-Patterns

- ❌ Paying for tools before you need them
- ❌ Using complex tools when simple ones work
- ❌ Adding tools that don't integrate with the rest of the stack
- ❌ Spending time on tool configuration instead of revenue activities
- ❌ Using a tool because it's trendy rather than because it solves a problem

## Technology Stack Decision Rule

> Every tool in the stack must either directly support revenue generation (attract → convert → deliver) or reduce the time cost of execution. If a tool does neither, do not adopt it.
