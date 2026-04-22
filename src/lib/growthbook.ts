import { GrowthBook, GrowthBookProvider } from "@growthbook/growthbook-react";

const clientKey = import.meta.env.VITE_GROWTHBOOK_CLIENT_KEY || "";

/**
 * Only create a real GrowthBook instance if a client key is configured.
 * Without a key, gb.init() throws and useFeatureValue() crashes the app.
 */
const gb = clientKey
  ? new GrowthBook({
      apiHost: "https://cdn.growthbook.io",
      clientKey,
      enableDevMode: import.meta.env.DEV,
      trackingCallback: (experiment, result) => {
        fetch(
          "/r/experiment-exposure?" +
            new URLSearchParams({
              experiment: experiment.key,
              variation: String(result.variationId),
            }),
        ).catch(() => {});
      },
    })
  : null;

export function initGrowthBook() {
  if (gb) {
    gb.init({ streaming: true });
  }
  return gb;
}

/** Whether GrowthBook is available (has a valid client key). */
export const growthBookEnabled = gb !== null;

export { gb, GrowthBookProvider };
