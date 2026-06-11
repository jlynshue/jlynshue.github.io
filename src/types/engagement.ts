export interface EngagementTier {
  id: string;
  title: string;
  subtitle: string;
  priceRange: string;
  duration: string;
  description: string;
  deliverables: string[];
  idealFor: string;
  cta: string;
  ctaLink: string;
  highlighted?: boolean;
}

export interface HeroVariant {
  headline: string;
  subheadline: string;
  cta: string;
  ctaLink: string;
  secondaryCta?: string;
  secondaryCtaLink?: string;
}

export type HeroPositioning = "workflow" | "fractional";

export interface FeatureFlags {
  "hero-positioning": HeroPositioning;
  "nav-structure": "original" | "fractional";
}
