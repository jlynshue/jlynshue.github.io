# jonathanlynshue.com — Analytics & Measurement Plan

## 1. Measurement Plan

### Business Objectives

| Objective | KPI | Target |
|-----------|-----|--------|
| Generate discovery calls | Discovery call bookings / month | 4+ / month |
| Qualify inbound leads | Lead capture → booking conversion | > 25% |
| Demonstrate thought leadership | Blog engagement (scroll depth, time) | 75%+ reach 50% scroll |
| Validate content positioning | Section engagement by page | Identify drop-off points |
| Optimize CTA placement | CTA click-through rate by placement | > 3% of page views |
| A/B test page layouts | Conversion rate by variant | Statistically significant lift |

### Funnel Stages

```
Awareness         → page_view (any route, with attribution)
Interest          → scroll_depth (50%+), section_view, chat_started
Consideration     → cta_click, search_query, about page visit
Intent            → discovery call redirect (cta_clicked + calendar_redirected)
Conversion        → calendar_booked (Cal.com webhook)
Lead Capture      → lead_captured (Tally webhook)
```

### Attribution Model

- First-touch attribution stored in profile (`firstTouch`)
- Last-touch updated on each qualifying visit (`lastTouch`)
- Full touch history via Firestore event log
- UTM parameters preserved end-to-end (page → redirect → webhook)

---

## 2. Event Taxonomy

### Tier 1: Automatically Tracked (already implemented)

| Event | Trigger | Layer | Properties |
|-------|---------|-------|------------|
| `page_view` | Every route navigation (SPA) | Client (GA4) + Server (PostHog) | `page_path`, `page_title`, `page_location` |
| `scroll_depth` | Scroll past 25/50/75/100% | Client (GA4) | `depth_threshold`, `depth_actual`, `page_path` |
| `cta_click` | CTA button click | Client (GA4) | `cta_name`, `cta_destination` |
| `cta_clicked` | Tracked redirect hit (`/r/*`) | Server (PostHog + Firestore) | `redirect_target`, `ctaId`, `ctaPlacement`, `assetId` |
| `calendar_redirected` | Discovery call redirect | Server | `redirect_destination` |
| `lead_magnet_redirected` | Lead magnet redirect | Server | `redirect_destination` |
| `calendar_booked` | Cal.com webhook | Server | `calcom_trigger_event`, `booking_uid` |
| `lead_captured` | Tally webhook | Server | `tally_event_id`, `form_id` |
| `contact_identified` | Email captured (Cal/Tally) | Server | `source` |
| `experiment_exposed` | A/B variant served | Server | `experiment`, `variation` |

### Tier 2: Section-Level Engagement (to implement)

| Event | Trigger | Properties |
|-------|---------|------------|
| `section_view` | Section scrolls into viewport (50% visible for 1s) | `section_id`, `section_title`, `page_path`, `section_index` |
| `section_time` | User leaves section (or page) | `section_id`, `duration_ms`, `page_path` |

### Tier 3: Interaction Events (to implement)

| Event | Trigger | Properties |
|-------|---------|------------|
| `search_opened` | User opens search overlay (⌘K / click) | `trigger` (`keyboard` / `click`), `page_path` |
| `search_query` | User types in search box (debounced 500ms) | `query`, `result_count`, `page_path` |
| `search_result_click` | User clicks a search result | `query`, `result_title`, `result_path` |
| `chat_started` | First message sent in concierge | `page_path` |
| `chat_message_sent` | Each message sent | `message_length`, `is_first`, `session_message_count` |
| `chat_ai_response` | AI fallback triggered (not canned) | `query_text` (truncated 100 chars) |
| `nav_click` | Topbar nav link clicked | `from_page`, `to_page` |
| `external_link_click` | Any outbound link clicked | `url`, `text`, `page_path` |
| `blog_footnote_click` | Footnote reference clicked | `footnote_id`, `page_path` |
| `lab_card_click` | App or repo card clicked | `card_type` (`app`/`repo`), `card_title`, `url` |
| `about_variant_loaded` | About page variant rendered | `variant` (`hybrid`/`services-led`) |
| `copy_event` | User copies text (Ctrl/Cmd+C) | `page_path`, `content_length` |

### Tier 4: Performance & Technical

| Event | Trigger | Properties |
|-------|---------|------------|
| `web_vitals` | Page load complete | `lcp_ms`, `fid_ms`, `cls_score`, `page_path` |
| `error_boundary` | React error boundary catches | `error_message`, `component_stack`, `page_path` |

---

## 3. Section Mapping (for `section_view` tracking)

### Homepage (`/`)

| Section ID | Section Title | Index |
|------------|--------------|-------|
| `hero` | Hero | 0 |
| `strategy` | Strategy Brief | 1 |
| `work` | Case Studies | 2 |
| `projects` | Projects | 3 |
| `approach` | Approach | 4 |
| `contact` | CTA / Contact | 5 |

### Case Study (`/work`)

| Section ID | Section Title | Index |
|------------|--------------|-------|
| `case-head` | Case Header | 0 |
| `stat-band` | Stat Band | 1 |
| `context` | Context / Before-After | 2 |
| `approach` | Approach / Process | 3 |
| `results` | Results / Timeline | 4 |
| `cta` | CTA | 5 |

### Blog Post (`/writing`)

| Section ID | Section Title | Index |
|------------|--------------|-------|
| `post-head` | Post Header | 0 |
| `post-body` | Post Body | 1 |
| `post-pager` | Prev/Next Pager | 2 |

### About (`/about`)

| Section ID | Section Title | Index |
|------------|--------------|-------|
| `case` | Proof / Case Teaser | 0 or 1 (variant-dependent) |
| `services` | Service Pillars | 0 or 1 |
| `bio` | Background | 2 |
| `process` | Engagement Process | 3 |
| `cta` | Final CTA | 4 |

### Lab (`/lab`)

| Section ID | Section Title | Index |
|------------|--------------|-------|
| `lab-head` | Lab Header | 0 |
| `lab-apps` | Apps | 1 |
| `lab-repos` | Repos | 2 |

### Chat (`/chat`)

| Section ID | Section Title | Index |
|------------|--------------|-------|
| `chat-rail` | Info Rail | 0 |
| `chat-main` | Chat Window | 1 |

---

## 4. Implementation Guide

### Phase 1: Section Visibility Tracking (IntersectionObserver)

Create `src/hooks/useSectionTracking.ts`:

```typescript
import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics";

interface SectionConfig {
  id: string;
  title: string;
  index: number;
}

export function useSectionTracking(sections: SectionConfig[]) {
  const timers = useRef<Map<string, number>>(new Map());
  const entered = useRef<Map<string, number>>(new Map());
  const fired = useRef<Set<string>>(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.getAttribute("data-section-id");
          if (!id) continue;

          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            // Start dwell timer
            entered.current.set(id, Date.now());

            // Fire section_view after 1s visible
            if (!fired.current.has(id)) {
              const timer = window.setTimeout(() => {
                const config = sections.find((s) => s.id === id);
                if (!config) return;
                fired.current.add(id);
                trackEvent("section_view", {
                  section_id: id,
                  section_title: config.title,
                  section_index: config.index,
                  page_path: window.location.pathname,
                });
              }, 1000);
              timers.current.set(id, timer);
            }
          } else {
            // Leaving section — fire dwell time
            const enterTime = entered.current.get(id);
            if (enterTime) {
              const duration = Date.now() - enterTime;
              if (duration > 2000) {
                trackEvent("section_time", {
                  section_id: id,
                  duration_ms: duration,
                  page_path: window.location.pathname,
                });
              }
              entered.current.delete(id);
            }

            // Clear pending view timer
            const timer = timers.current.get(id);
            if (timer) {
              clearTimeout(timer);
              timers.current.delete(id);
            }
          }
        }
      },
      { threshold: 0.5 }
    );

    // Observe all sections with data-section-id
    const elements = document.querySelectorAll("[data-section-id]");
    elements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
      timers.current.forEach((t) => clearTimeout(t));
      // Flush any remaining dwell times
      entered.current.forEach((enterTime, id) => {
        const duration = Date.now() - enterTime;
        if (duration > 2000) {
          trackEvent("section_time", {
            section_id: id,
            duration_ms: duration,
            page_path: window.location.pathname,
          });
        }
      });
    };
  }, [sections]);
}
```

**Usage on pages** — add `data-section-id` attributes to sections:

```tsx
<section className="section" id="strategy" data-section-id="strategy">
```

Then call the hook in the page component:

```tsx
useSectionTracking([
  { id: "hero", title: "Hero", index: 0 },
  { id: "strategy", title: "Strategy Brief", index: 1 },
  // ...
]);
```

### Phase 2: Interaction Tracking

Add to `src/lib/analytics.ts`:

```typescript
/** Track search overlay interactions */
export function trackSearchOpen(trigger: "keyboard" | "click") {
  trackEvent("search_opened", { trigger, page_path: window.location.pathname });
}

export function trackSearchQuery(query: string, resultCount: number) {
  trackEvent("search_query", {
    query: query.slice(0, 100),
    result_count: resultCount,
    page_path: window.location.pathname,
  });
}

export function trackSearchResultClick(query: string, resultTitle: string, resultPath: string) {
  trackEvent("search_result_click", { query, result_title: resultTitle, result_path: resultPath });
}

/** Track chat interactions */
export function trackChatStarted() {
  trackEvent("chat_started", { page_path: window.location.pathname });
}

export function trackChatMessage(messageLength: number, isFirst: boolean, sessionCount: number) {
  trackEvent("chat_message_sent", {
    message_length: messageLength,
    is_first: isFirst,
    session_message_count: sessionCount,
  });
}

/** Track navigation */
export function trackNavClick(fromPage: string, toPage: string) {
  trackEvent("nav_click", { from_page: fromPage, to_page: toPage });
}

/** Track external link clicks */
export function trackExternalLink(url: string, text: string) {
  trackEvent("external_link_click", {
    url,
    text: text.slice(0, 100),
    page_path: window.location.pathname,
  });
}

/** Track lab card clicks */
export function trackLabCardClick(cardType: "app" | "repo", cardTitle: string, url: string) {
  trackEvent("lab_card_click", { card_type: cardType, card_title: cardTitle, url });
}

/** Track About page A/B variant */
export function trackAboutVariant(variant: "hybrid" | "services-led") {
  trackEvent("about_variant_loaded", { variant });
}
```

### Phase 3: Wire Interactions into Components

**SearchOverlay.tsx** — add tracking calls:

```tsx
// On open:
trackSearchOpen(wasKeyboard ? "keyboard" : "click");

// On query (debounced):
trackSearchQuery(query, results.length);

// On result click:
trackSearchResultClick(query, item.title, item.path);
```

**Chat.tsx** — add tracking:

```tsx
// On first message:
trackChatStarted();

// On every send:
trackChatMessage(text.length, messages.length === 0, messages.length + 1);
```

**BrandTopbar.tsx** — add nav tracking:

```tsx
// On each Link click:
trackNavClick(activePage, targetPage);
```

**About.tsx** — track variant on mount:

```tsx
useEffect(() => {
  trackAboutVariant(variant);
  // Also fire experiment exposure to server
  fetch(`/r/experiment-exposure?experiment=about-layout&variation=${variant}`);
}, [variant]);
```

### Phase 4: External Link Click Tracking (global)

Create `src/hooks/useExternalLinkTracking.ts`:

```typescript
import { useEffect } from "react";
import { trackExternalLink } from "@/lib/analytics";

export function useExternalLinkTracking() {
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const anchor = (e.target as HTMLElement).closest("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;
      const url = anchor.href;
      if (url && !url.startsWith(window.location.origin) && !url.startsWith("/")) {
        trackExternalLink(url, anchor.textContent?.trim() ?? "");
      }
    }

    document.addEventListener("click", handleClick, { capture: true });
    return () => document.removeEventListener("click", handleClick, { capture: true });
  }, []);
}
```

Call in `App.tsx` or `WallpaperLayout.tsx` (once, globally).

### Phase 5: Web Vitals

Install `web-vitals` and fire on load:

```typescript
import { onLCP, onFID, onCLS } from "web-vitals";
import { trackEvent } from "@/lib/analytics";

export function initWebVitals() {
  onLCP((metric) => trackEvent("web_vitals", { metric_name: "LCP", value_ms: Math.round(metric.value), page_path: window.location.pathname }));
  onFID((metric) => trackEvent("web_vitals", { metric_name: "FID", value_ms: Math.round(metric.value), page_path: window.location.pathname }));
  onCLS((metric) => trackEvent("web_vitals", { metric_name: "CLS", value_ms: Math.round(metric.value * 1000), page_path: window.location.pathname }));
}
```

---

## 5. GA4 Custom Dimensions (configure in GA4 Admin)

| Dimension Name | Scope | Parameter |
|----------------|-------|-----------|
| Section ID | Event | `section_id` |
| Section Title | Event | `section_title` |
| CTA Name | Event | `cta_name` |
| CTA Destination | Event | `cta_destination` |
| Search Query | Event | `query` |
| Chat Session Count | Event | `session_message_count` |
| A/B Variant | Event | `variant` |
| Scroll Depth | Event | `depth_threshold` |
| Card Type | Event | `card_type` |
| From Page | Event | `from_page` |

---

## 6. Reporting Views (GA4 Explorations)

### Funnel Analysis
```
page_view → scroll_depth(50%) → section_view(cta) → cta_click → calendar_booked
```

### Content Engagement
- Scroll depth distribution by page
- Section dwell time (section_time) by section_id
- Blog completion rate (scroll_depth = 100% on /writing)

### Conversion Attribution
- First-touch source → calendar_booked
- CTA placement performance (click rate by placement)
- A/B test: about_variant_loaded → cta_click → calendar_booked

### Search Effectiveness
- Top queries with zero results
- Search → navigation paths
- Search trigger distribution (keyboard vs click)

---

## 7. Dual-Layer Architecture Summary

```
┌─────────────────────────────────────────────────────────────┐
│  CLIENT (Browser)                                           │
│                                                             │
│  GA4 (gtag.js)          ←  page_view, scroll_depth,        │
│  G-4HKLKWE5ZD              cta_click, section_view,        │
│                             section_time, search_*,         │
│                             chat_*, nav_click,              │
│                             external_link_click,            │
│                             web_vitals, about_variant       │
└───────────────────────────────────┬─────────────────────────┘
                                    │ (no PII client-side)
                                    │
┌───────────────────────────────────▼─────────────────────────┐
│  SERVER (Cloud Run)                                         │
│                                                             │
│  page_viewed        →  Firestore + PostHog (via Cloud Tasks)│
│  cta_clicked        →  Firestore + PostHog                  │
│  calendar_redirected→  Firestore + PostHog                  │
│  calendar_booked    →  Firestore + PostHog + HubSpot        │
│  lead_captured      →  Firestore + PostHog + HubSpot        │
│  contact_identified →  Firestore + PostHog + HubSpot        │
│  experiment_exposed →  Firestore + PostHog                  │
│                                                             │
│  Identity: jls_aid (1yr) + jls_sid (30min) cookies          │
│  Attribution: UTM params preserved through redirect chain   │
└─────────────────────────────────────────────────────────────┘
```

---

## 8. Implementation Priority & Effort

| Phase | Events | Effort | Impact |
|-------|--------|--------|--------|
| 1. Section tracking | `section_view`, `section_time` | 2-3 hours | HIGH — reveals content engagement |
| 2. Search tracking | `search_opened`, `search_query`, `search_result_click` | 1 hour | MEDIUM — shows intent signals |
| 3. Chat tracking | `chat_started`, `chat_message_sent` | 30 min | MEDIUM — concierge effectiveness |
| 4. Nav + external | `nav_click`, `external_link_click` | 1 hour | LOW — navigation patterns |
| 5. About A/B | `about_variant_loaded` + exposure | 30 min | HIGH — conversion optimization |
| 6. Web vitals | `web_vitals` | 30 min | LOW — performance monitoring |
| 7. GA4 config | Custom dimensions + explorations | 1 hour | HIGH — unlocks reporting |

**Recommended order:** Phase 5 → 1 → 2 → 3 → 7 → 4 → 6

---

## 9. Privacy & Compliance

- **No third-party client scripts** beyond GA4 gtag.js
- **Server-side tracking** for conversion events (no client-side PostHog/HubSpot)
- **First-party cookies only**: `jls_aid` (anonymous ID), `jls_sid` (session)
- **No PII in GA4**: all identity resolution happens server-side
- **Cookie consent**: add banner if targeting EU visitors (currently US-focused)
- **Data retention**: GA4 set to 14 months; Firestore events indefinite (review quarterly)
