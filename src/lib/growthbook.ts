/**
 * GrowthBook integration — disabled until VITE_GROWTHBOOK_CLIENT_KEY is set.
 *
 * When A/B testing is needed:
 * 1. Create a GrowthBook project at growthbook.io
 * 2. Set VITE_GROWTHBOOK_CLIENT_KEY in .env / Vite build
 * 3. Uncomment the GrowthBookProvider in App.tsx
 * 4. Use useFeatureValue() in components
 */

export const growthBookEnabled = false;
