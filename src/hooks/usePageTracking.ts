import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView, initScrollDepthTracking } from "@/lib/analytics";

/**
 * Fires a GA4 page_view on every React Router navigation
 * and initializes scroll depth tracking per page.
 */
export function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname + location.search);

    const cleanupScroll = initScrollDepthTracking();
    return cleanupScroll;
  }, [location.pathname, location.search]);
}
