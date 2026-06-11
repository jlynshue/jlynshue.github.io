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
            entered.current.set(id, Date.now());

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

            const timer = timers.current.get(id);
            if (timer) {
              clearTimeout(timer);
              timers.current.delete(id);
            }
          }
        }
      },
      { threshold: 0.5 },
    );

    const elements = document.querySelectorAll("[data-section-id]");
    elements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
      timers.current.forEach((t) => clearTimeout(t));
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
