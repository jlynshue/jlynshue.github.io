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

export { GA_ID };
