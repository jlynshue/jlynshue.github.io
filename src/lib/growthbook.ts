import { GrowthBook, GrowthBookProvider } from "@growthbook/growthbook-react";

const gb = new GrowthBook({
  apiHost: "https://cdn.growthbook.io",
  clientKey: import.meta.env.VITE_GROWTHBOOK_CLIENT_KEY || "",
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
});

export function initGrowthBook() {
  gb.init({ streaming: true });
  return gb;
}

export { gb, GrowthBookProvider };
