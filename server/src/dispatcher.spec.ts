import { beforeEach, describe, expect, it, vi } from "vitest";

import type { AppConfig } from "./types.js";

const mockCreateTask = vi.fn();
const mockQueuePath = vi.fn();

vi.mock("@google-cloud/tasks", () => ({
  CloudTasksClient: vi.fn().mockImplementation(() => ({
    createTask: mockCreateTask,
    queuePath: mockQueuePath,
  })),
}));

import { CloudTaskDispatcher, MemoryDispatcher } from "./dispatcher.js";

function buildConfig(overrides: Partial<AppConfig> = {}): AppConfig {
  return {
    nodeEnv: "production",
    port: 8080,
    baseUrl: "https://jonathanlynshue.com",
    staticDir: "/tmp",
    cookieDomain: "jonathanlynshue.com",
    discoveryCallUrl: "https://cal.com/jonathanlynshue/discovery-call",
    leadMagnetUrl: "https://tally.so/r/workflow-audit",
    trackingSecret: "tracking-secret",
    internalApiToken: "internal-token",
    calcomWebhookSecret: null,
    tallyWebhookSecret: null,
    posthogHost: null,
    posthogApiKey: null,
    hubspotToken: null,
    hubspotStageEventMap: {},
    serviceUrl: "https://service.example.com",
    cloudTasksProject: "my-project",
    cloudTasksLocation: "us-central1",
    cloudTasksQueue: "my-queue",
    linkedinAccessToken: null,
    linkedinPersonUrn: null,
    ...overrides,
  };
}

describe("MemoryDispatcher", () => {
  it("reports enabled as false", () => {
    const dispatcher = new MemoryDispatcher();
    expect(dispatcher.enabled).toBe(false);
  });

  it("dispatch() always returns false", async () => {
    const dispatcher = new MemoryDispatcher();
    const result = await dispatcher.dispatch("/internal/tasks/posthog-delivery", { event: { eventId: "x" } });
    expect(result).toBe(false);
  });
});

describe("CloudTaskDispatcher", () => {
  const queuePath = "projects/my-project/locations/us-central1/queues/my-queue";

  beforeEach(() => {
    vi.clearAllMocks();
    mockQueuePath.mockReturnValue(queuePath);
    mockCreateTask.mockResolvedValue([{}]);
  });

  it("dispatch() creates a task with the correct queue path", async () => {
    const dispatcher = new CloudTaskDispatcher(buildConfig());
    await dispatcher.dispatch("/internal/tasks/posthog-delivery", { event: { eventId: "e1" } });

    expect(mockCreateTask).toHaveBeenCalledTimes(1);
    const call = mockCreateTask.mock.calls[0][0];
    expect(call.parent).toBe(queuePath);
  });

  it("dispatch() includes serialized payload in task body", async () => {
    const payload = { event: { eventId: "e1", eventName: "page_viewed" } };
    const dispatcher = new CloudTaskDispatcher(buildConfig());
    await dispatcher.dispatch("/internal/tasks/posthog-delivery", payload);

    const call = mockCreateTask.mock.calls[0][0];
    const body = Buffer.from(call.task.httpRequest.body).toString("utf8");
    expect(JSON.parse(body)).toEqual(payload);
  });

  it("dispatch() returns true on success", async () => {
    const dispatcher = new CloudTaskDispatcher(buildConfig());
    const result = await dispatcher.dispatch("/internal/tasks/posthog-delivery", { event: { eventId: "e1" } });
    expect(result).toBe(true);
  });

  it("dispatch() sets correct url and authorization header", async () => {
    const dispatcher = new CloudTaskDispatcher(buildConfig());
    await dispatcher.dispatch("/internal/tasks/posthog-delivery", { event: { eventId: "e1" } });

    const call = mockCreateTask.mock.calls[0][0];
    expect(call.task.httpRequest.url).toBe("https://service.example.com/internal/tasks/posthog-delivery");
    expect(call.task.httpRequest.headers["Content-Type"]).toBe("application/json");
    expect(call.task.httpRequest.headers["Authorization"]).toBe("Bearer internal-token");
  });

  it("dispatch() returns false when cloud tasks are not configured", async () => {
    const dispatcher = new CloudTaskDispatcher(
      buildConfig({ cloudTasksProject: null, cloudTasksLocation: null, cloudTasksQueue: null }),
    );
    const result = await dispatcher.dispatch("/internal/tasks/posthog-delivery", { event: { eventId: "e1" } });
    expect(result).toBe(false);
    expect(mockCreateTask).not.toHaveBeenCalled();
  });

  it("dispatch() returns false when serviceUrl is null", async () => {
    const dispatcher = new CloudTaskDispatcher(buildConfig({ serviceUrl: null }));
    const result = await dispatcher.dispatch("/internal/tasks/posthog-delivery", { event: { eventId: "e1" } });
    expect(result).toBe(false);
    expect(mockCreateTask).not.toHaveBeenCalled();
  });

  it("reports enabled as true when fully configured", () => {
    const dispatcher = new CloudTaskDispatcher(buildConfig());
    expect(dispatcher.enabled).toBe(true);
  });

  it("dispatch() returns false and logs error on failure", async () => {
    mockCreateTask.mockRejectedValueOnce(new Error("Cloud Tasks unavailable"));
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const dispatcher = new CloudTaskDispatcher(buildConfig());
    const result = await dispatcher.dispatch("/internal/tasks/posthog-delivery", { event: { eventId: "e1" } });

    expect(result).toBe(false);
    expect(consoleSpy).toHaveBeenCalledWith(
      "[CloudTaskDispatcher] failed to dispatch task",
      expect.objectContaining({ pathname: "/internal/tasks/posthog-delivery" }),
    );

    consoleSpy.mockRestore();
  });

  it("reports enabled as false when not configured", () => {
    const dispatcher = new CloudTaskDispatcher(
      buildConfig({ cloudTasksProject: null, cloudTasksLocation: null, cloudTasksQueue: null }),
    );
    expect(dispatcher.enabled).toBe(false);
  });
});
