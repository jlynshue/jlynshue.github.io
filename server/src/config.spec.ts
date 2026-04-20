import { describe, it, expect, afterEach, vi } from "vitest";
import { buildConfig } from "./config.js";

describe("buildConfig", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns correct defaults when env vars are missing", () => {
    const config = buildConfig();

    expect(config.port).toBe(8080);
    expect(config.nodeEnv).toBe("test");
    expect(config.staticDir).toMatch(/dist$/);
  });

  it("reads PORT from environment", () => {
    vi.stubEnv("PORT", "3000");

    const config = buildConfig();

    expect(config.port).toBe(3000);
  });

  it("reads BASE_URL from environment", () => {
    vi.stubEnv("BASE_URL", "https://example.com");

    const config = buildConfig();

    expect(config.baseUrl).toBe("https://example.com");
  });

  it("reads TRACKING_SECRET from environment", () => {
    vi.stubEnv("TRACKING_SECRET", "my-secret");

    const config = buildConfig();

    expect(config.trackingSecret).toBe("my-secret");
  });

  it("parses HUBSPOT_STAGE_EVENT_MAP_JSON when set", () => {
    vi.stubEnv(
      "HUBSPOT_STAGE_EVENT_MAP_JSON",
      JSON.stringify({ "123": "diagnostic_sold", "456": "sprint_sold" }),
    );

    const config = buildConfig();

    expect(config.hubspotStageEventMap).toEqual({
      "123": "diagnostic_sold",
      "456": "sprint_sold",
    });
  });
});
