---
date: 2026-04-21
agent: goose
category: measurement
tags: [analytics, ga4, posthog, dashboard, kpi]
---

# Executive Measurement Plan — jonathanlynshue.com

## 1. Measurement Objectives

| # | Objective | Question It Answers |
|---|-----------|-------------------|
| 1 | **Content performance** | Which LinkedIn posts drive the most profile views, clicks, and engagement? |
| 2 | **Traffic acquisition** | Where do visitors come from? Which channels/campaigns convert? |
| 3 | **Engagement quality** | Do visitors read the page? How deep do they scroll? Which CTAs get clicked? |
| 4 | **Lead generation** | How many discovery calls are booked? What's the conversion funnel? |
| 5 | **Pipeline velocity** | How fast do leads move through the HubSpot pipeline? |

---

## 2. KPIs & Metrics

### Tier 1 — Business Outcomes (Weekly Review)

| KPI | Source | Target (Month 1) | Target (Month 3) |
|-----|--------|:-----------------:|:-----------------:|
| Discovery calls booked | Cal.com + Firestore | 1+/week | 3+/week |
| Leads captured (Tally forms) | Firestore `contacts` | 2+/week | 5+/week |
| HubSpot deals created | HubSpot CRM | 1+/month | 2+/month |
| Revenue from diagnostics/sprints | HubSpot | — | $2.5K+ |

### Tier 2 — Traffic & Engagement (Weekly Review)

| KPI | Source | Target (Month 1) | Target (Month 3) |
|-----|--------|:-----------------:|:-----------------:|
| Unique visitors/week | GA4 | 50+ | 200+ |
| Page views/week | GA4 | 100+ | 500+ |
| Avg. session duration | GA4 | 45s+ | 90s+ |
| Scroll depth ≥75% (homepage) | GA4 `scroll_depth` | 20%+ of visitors | 30%+ |
| CTA click rate (any) | GA4 `cta_click` | 5%+ of visitors | 8%+ |
| Bounce rate | GA4 | <65% | <55% |

### Tier 3 — Content & Channel (Weekly Review)

| KPI | Source | Target (Month 1) | Target (Month 3) |
|-----|--------|:-----------------:|:-----------------:|
| LinkedIn impressions/post | LinkedIn + Buffer | 500+ | 2,000+ |
| LinkedIn engagement rate | LinkedIn | 3%+ | 5%+ |
| LinkedIn profile views/week | LinkedIn | 50+ | 200+ |
| Profile → website click-through | GA4 (utm_source=linkedin) | 10+/week | 50+/week |
| Post saves | LinkedIn | 2+/post | 5+/post |

---

## 3. Data Sources & Collection Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌────────────────────┐
│   Browser        │     │   LinkedIn API   │     │   Cal.com / Tally  │
│   (Client-side)  │     │   (Server-side)  │     │   (Webhooks)       │
└────────┬────────┘     └────────┬────────┘     └────────┬───────────┘
         │                       │                        │
    GA4 gtag.js             Firestore                Cloud Run
    ─ page_view            linkedin_queue            /webhooks/*
    ─ cta_click            (post metrics)            ─ calcom
    ─ scroll_depth                                   ─ tally
         │                       │                        │
         ▼                       ▼                        ▼
   ┌──────────┐          ┌──────────────┐          ┌──────────────┐
   │   GA4    │          │  Firestore   │          │  Firestore   │
   │ G-4HKLK  │          │  events /    │          │  events /    │
   │ WE5ZD    │          │  contacts    │          │  contacts    │
   └──────────┘          └──────────────┘          └──────────────┘
         │                       │                        │
         │                       ▼                        │
         │               ┌──────────────┐                 │
         │               │   PostHog    │◄────────────────┘
         │               │  (server →   │
         │               │   PostHog)   │
         │               └──────────────┘
         │                       │
         ▼                       ▼
   ┌─────────────────────────────────────────────┐
   │           Dashboard Layer                    │
   │  GA4 Reports  │  Looker Studio  │  PostHog  │
   └─────────────────────────────────────────────┘
```

### What Each System Captures

| System | What It Captures | Collection Method |
|--------|-----------------|-------------------|
| **GA4** (G-4HKLKWE5ZD) | Page views, CTA clicks, scroll depth, traffic sources, devices, geography | Client-side gtag.js |
| **Firestore** | Tracking profiles, all server events, contacts, linkedin queue | Server-side (Cloud Run) |
| **PostHog** | All server events (duplicated from Firestore for analysis) | Server-side API calls |
| **HubSpot** | Contacts, deals, pipeline stages, deal amounts | CRM + webhook upserts |
| **LinkedIn** | Post metrics, comments, profile views | LinkedIn analytics (manual) |
| **Cal.com** | Bookings, cancellations, reschedulings | Webhook → Firestore |
| **Tally** | Form submissions (lead captures) | Webhook → Firestore |

---

## 4. GA4 Implementation (Completed)

### Tags Installed

| Tag | Location | Purpose |
|-----|----------|---------|
| `gtag.js` loader | `index.html` `<head>` | Loads GA4 library |
| `gtag('config', 'G-4HKLKWE5ZD')` | `index.html` | Initializes with `send_page_view: false` |

### Custom Events Tracked

| Event | Trigger | Parameters | Implementation |
|-------|---------|------------|----------------|
| `page_view` | Every React Router navigation | `page_path`, `page_title`, `page_location` | `usePageTracking` hook in `App.tsx` |
| `cta_click` | Click on any CTA button | `cta_name`, `cta_destination` | `onClick={handleCTAClick(...)}` on 6 buttons |
| `scroll_depth` | User scrolls past 25/50/75/100% | `depth_threshold`, `depth_actual`, `page_path` | `initScrollDepthTracking()` in analytics.ts |

### CTA Click Tracking Points

| Component | Placement | cta_name | cta_destination |
|-----------|-----------|----------|-----------------|
| HeroSection | hero | `discovery_call` | /r/discovery-call |
| HeroSection | hero | `sprint_page` | /sprint |
| AboutSection | contact-section | `discovery_call` | /r/discovery-call |
| Footer | footer | `discovery_call` | /r/discovery-call |
| Diagnostic page | diagnostic-page | `discovery_call` | /r/discovery-call |
| Sprint page | sprint-page | `discovery_call` | /r/discovery-call |

### Privacy Considerations

- No cookie consent banner required (GA4 first-party cookies only + US audience)
- Server-side tracking (Firestore/PostHog) uses first-party `jls_aid` cookie — no third-party trackers
- No PII is sent to GA4 (email, name stay in Firestore/HubSpot only)
- GA4 IP anonymization is enabled by default in v4

---

## 5. PostHog Credentials

PostHog is already configured for server-side event capture:

| Setting | Value |
|---------|-------|
| Host | `https://us.i.posthog.com` |
| API Key | Set as GitHub secret `POSTHOG_API_KEY` |
| Events sent | All server-side events (page views via /r/ routes, CTA clicks, webhook events) |

> **Note:** PostHog credentials are stored as GitHub secrets and Cloud Run env vars. They are never exposed in client-side code. If you need to access the PostHog dashboard, log in at [app.posthog.com](https://app.posthog.com) with the account that created the project.

---

## 6. Dashboard Specification

### Dashboard 1: Weekly Executive Overview (GA4 / Looker Studio)

**Audience:** Jon (weekly review)
**Refresh:** Real-time (GA4 auto-updates)
**Access:** GA4 → Reports → Looker Studio (linked)

| Widget | Metric | Visualization | Data Source |
|--------|--------|---------------|-------------|
| **Visitors** | Users (unique) | Scorecard + sparkline | GA4 |
| **Page Views** | Total page views | Scorecard + sparkline | GA4 |
| **Top Pages** | Page views by page_path | Bar chart (horizontal) | GA4 |
| **Traffic Sources** | Sessions by source/medium | Pie chart | GA4 |
| **CTA Clicks** | cta_click events by placement | Bar chart | GA4 |
| **Scroll Depth** | % of users reaching 75%+ | Gauge | GA4 |
| **Device Breakdown** | Sessions by device category | Donut chart | GA4 |
| **Geography** | Sessions by country/city | Map | GA4 |

### Dashboard 2: Content Performance (LinkedIn + GA4)

**Audience:** Jon (weekly review)
**Refresh:** Weekly (manual LinkedIn data + auto GA4)

| Widget | Metric | Visualization | Data Source |
|--------|--------|---------------|-------------|
| **Post Impressions** | Impressions per post | Table (sortable) | LinkedIn analytics (manual) |
| **Engagement Rate** | (Likes + Comments + Shares) / Impressions | Bar chart | LinkedIn analytics |
| **Profile Views** | Weekly profile views | Line chart (trend) | LinkedIn analytics |
| **LinkedIn → Website** | Sessions with utm_source=linkedin | Scorecard | GA4 |
| **Post → CTA** | cta_click events from linkedin traffic | Funnel | GA4 |
| **Top Post by Clicks** | Post with most website click-throughs | Highlight card | GA4 + LinkedIn |

### Dashboard 3: Lead Pipeline (Firestore + HubSpot)

**Audience:** Jon (weekly review)
**Refresh:** Real-time (Firestore) + hourly (HubSpot sync)

| Widget | Metric | Visualization | Data Source |
|--------|--------|---------------|-------------|
| **Leads Captured** | Tally form submissions (week) | Scorecard | Firestore `contacts` |
| **Calls Booked** | Cal.com bookings (week) | Scorecard | Firestore `events` (calendar_booked) |
| **Pipeline Deals** | Active deals by stage | Horizontal funnel | HubSpot |
| **Deal Value** | Total pipeline value ($) | Scorecard | HubSpot |
| **Lead Sources** | attribution_source breakdown | Donut chart | Firestore `events` |
| **Conversion Funnel** | Visit → CTA Click → Booking → Deal | Funnel chart | GA4 + Firestore + HubSpot |
| **Time to First Response** | Avg days: lead → discovery call | Scorecard | HubSpot deal stages |

---

## 7. GA4 Reports to Configure

### Custom Explorations (Build in GA4 UI)

1. **CTA Click Analysis**
   - Dimensions: `cta_name`, `cta_destination`, `page_path`
   - Metrics: Event count, Users
   - Technique: Free-form table

2. **Scroll Depth by Page**
   - Dimensions: `page_path`, `depth_threshold`
   - Metrics: Event count
   - Technique: Pivot table (page × threshold)

3. **Conversion Funnel**
   - Steps: `page_view` → `cta_click` → `calendar_redirected`
   - Technique: Funnel exploration

4. **Traffic Quality by Source**
   - Dimensions: `source`, `medium`, `campaign`
   - Metrics: Sessions, Avg session duration, CTA clicks
   - Technique: Free-form table

### GA4 Conversions to Mark

| Event | Mark as Conversion? | Why |
|-------|:-------------------:|-----|
| `cta_click` (where cta_name = discovery_call) | ✅ Yes | Primary conversion action |
| `scroll_depth` (threshold = 75) | ⚠️ Optional | Engagement signal |
| `page_view` (page = /sprint or /diagnostic) | ⚠️ Optional | Product page interest |

---

## 8. Implementation Next Steps

| # | Task | Owner | Status |
|---|------|-------|--------|
| 1 | GA4 property created + gtag.js installed | Goose | ✅ Done |
| 2 | page_view on route change (SPA) | Goose | ✅ Done |
| 3 | cta_click on all 6 CTA buttons | Goose | ✅ Done |
| 4 | scroll_depth tracking (25/50/75/100%) | Goose | ✅ Done |
| 5 | Deploy to production (PR #13) | Goose | ✅ Done |
| 6 | Mark `cta_click` as conversion in GA4 UI | Jon | ⬜ Manual (GA4 → Admin → Conversions) |
| 7 | Create custom explorations in GA4 | Jon/Goose | ⬜ Next session |
| 8 | Build Looker Studio dashboard (linked to GA4) | Jon/Goose | ⬜ Week 2 |
| 9 | Set up PostHog dashboards | Jon/Goose | ⬜ Week 2 |
| 10 | Weekly review template referencing dashboard | Jon | ⬜ EWB-012 first review |

---

## 9. Frequency & Review Cadence

| Review | Frequency | Metrics Reviewed | Action |
|--------|-----------|-----------------|--------|
| **Quick check** | Daily (2 min) | GA4 real-time: active users, page views | Spot anomalies |
| **Content review** | Post each post (Tue/Wed/Fri) | LinkedIn impressions + engagement within 24h | Identify top-performing formats |
| **Weekly review** | Friday (30 min, EWB-012) | All Tier 1 + Tier 2 KPIs | Adjust content, outbound, experiments |
| **Monthly scorecard** | Last Friday of month | Full funnel: traffic → leads → deals → revenue | Continue/narrow/pivot decision |
