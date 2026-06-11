/**
 * Google Analytics 4 integration for jonathanlynshue.com
 *
 * GA4 Property: G-4HKLKWE5ZD
 *
 * We load gtag.js in index.html with `send_page_view: false` so we can
 * fire page_view manually on each React Router navigation (SPA).
 *
 * Custom events tracked:
 *   - page_view          (every route change)
 *   - cta_click          (discovery call, lead magnet CTA buttons)
 *   - scroll_depth       (25%, 50%, 75%, 100%)
 *   - lead_captured      (Tally form submission — fired by server webhook)
 *   - experiment_exposed (GrowthBook A/B test — existing /r/experiment-exposure route)
 */

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

const GA_ID = "G-4HKLKWE5ZD";

/** Send a GA4 page_view event for the current route. */
export function trackPageView(path: string, title?: string) {
  if (typeof window.gtag !== "function") return;
  window.gtag("event", "page_view", {
    page_path: path,
    page_title: title ?? document.title,
    page_location: window.location.href,
  });
}

/** Send a custom GA4 event. */
export function trackEvent(
  eventName: string,
  params: Record<string, string | number | boolean> = {},
) {
  if (typeof window.gtag !== "function") return;
  window.gtag("event", eventName, params);
}

/** Track CTA clicks (discovery call, lead magnet, etc.) */
export function trackCTAClick(ctaName: string, destination: string) {
  trackEvent("cta_click", {
    cta_name: ctaName,
    cta_destination: destination,
  });
}

/**
 * Initialize scroll depth tracking.
 * Fires events at 25%, 50%, 75%, and 100% thresholds.
 */
export function initScrollDepthTracking() {
  const thresholds = [25, 50, 75, 100];
  const fired = new Set<number>();

  function handleScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return;

    const percent = Math.round((scrollTop / docHeight) * 100);

    for (const threshold of thresholds) {
      if (percent >= threshold && !fired.has(threshold)) {
        fired.add(threshold);
        trackEvent("scroll_depth", {
          depth_threshold: threshold,
          depth_actual: percent,
          page_path: window.location.pathname,
        });
      }
    }
  }

  window.addEventListener("scroll", handleScroll, { passive: true });

  // Return cleanup function
  return () => window.removeEventListener("scroll", handleScroll);
}

/** Track fractional positioning interactions */
export function trackFractionalEvent(
  action: string,
  label?: string,
  variant?: string,
) {
  trackEvent("fractional_interaction", {
    action,
    label: label ?? "",
    variant: variant ?? "fractional",
  });
}

/** Track engagement tier views on How I Work page */
export function trackEngagementTierView(tierName: string, priceRange: string) {
  trackEvent("engagement_tier_view", {
    tier_name: tierName,
    price_range: priceRange,
  });
}

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

export function trackSearchResultClick(
  query: string,
  resultTitle: string,
  resultPath: string,
) {
  trackEvent("search_result_click", {
    query,
    result_title: resultTitle,
    result_path: resultPath,
  });
}

/** Track chat interactions */
export function trackChatStarted() {
  trackEvent("chat_started", { page_path: window.location.pathname });
}

export function trackChatMessage(
  messageLength: number,
  isFirst: boolean,
  sessionCount: number,
) {
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
export function trackLabCardClick(
  cardType: "app" | "repo",
  cardTitle: string,
  url: string,
) {
  trackEvent("lab_card_click", { card_type: cardType, card_title: cardTitle, url });
}

/** Track About page A/B variant */
export function trackAboutVariant(variant: string) {
  trackEvent("about_variant_loaded", { variant });
}

export { GA_ID };
