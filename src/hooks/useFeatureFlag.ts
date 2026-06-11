import { useState, useEffect } from "react";
import type { HeroPositioning } from "@/types/engagement";

/**
 * Simple feature flag hook.
 *
 * When GrowthBook is enabled (VITE_GROWTHBOOK_CLIENT_KEY is set),
 * replace this with useFeatureValue from @growthbook/growthbook-react.
 *
 * For now, uses URL param ?variant=fractional or localStorage for persistence.
 * This allows manual A/B testing during development and stakeholder review.
 *
 * Usage:
 *   const variant = useFeatureFlag("hero-positioning", "workflow");
 */
export function useFeatureFlag<T extends string>(
  flagName: string,
  defaultValue: T,
): T {
  const [value, setValue] = useState<T>(() => {
    // Check URL param first (for testing: ?variant=fractional)
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlValue = params.get("variant");
      if (urlValue && flagName === "hero-positioning") {
        localStorage.setItem(`ff_${flagName}`, urlValue);
        return urlValue as T;
      }

      // Check localStorage for persistent assignment
      const stored = localStorage.getItem(`ff_${flagName}`);
      if (stored) return stored as T;
    }

    return defaultValue;
  });

  useEffect(() => {
    // Persist the assignment
    localStorage.setItem(`ff_${flagName}`, value);
  }, [flagName, value]);

  return value;
}

/**
 * Convenience hook specifically for hero positioning.
 * Returns "workflow" (control) or "fractional" (variant).
 */
export function useHeroPositioning(): HeroPositioning {
  return useFeatureFlag<HeroPositioning>("hero-positioning", "fractional");
}
