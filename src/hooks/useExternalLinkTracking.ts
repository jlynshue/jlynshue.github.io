import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

export function useExternalLinkTracking() {
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const anchor = (e.target as HTMLElement).closest(
        "a[href]",
      ) as HTMLAnchorElement | null;
      if (!anchor) return;
      const url = anchor.href;
      if (
        url &&
        !url.startsWith(window.location.origin) &&
        !url.startsWith("/")
      ) {
        trackEvent("external_link_click", {
          url,
          text: (anchor.textContent?.trim() ?? "").slice(0, 100),
          page_path: window.location.pathname,
        });
      }
    }

    document.addEventListener("click", handleClick, { capture: true });
    return () =>
      document.removeEventListener("click", handleClick, { capture: true });
  }, []);
}
