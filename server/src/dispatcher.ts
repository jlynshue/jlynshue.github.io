import { CloudTasksClient } from "@google-cloud/tasks";

import type { AppConfig } from "./types.js";

/**
 * A no-op task dispatcher used in development/testing. Always reports as disabled and never dispatches.
 */
export class MemoryDispatcher {
  /**
   * Whether this dispatcher is capable of dispatching tasks.
   * @returns {boolean} Always false for MemoryDispatcher.
   */
  get enabled(): boolean {
    return false;
  }

  /**
   * No-op dispatch that always returns false.
   * @param {string} _pathname - The target endpoint pathname (unused).
   * @param {unknown} _payload - The task payload (unused).
   * @returns {Promise<boolean>} Always resolves to false.
   */
  async dispatch(_pathname: string, _payload: unknown): Promise<boolean> {
    return false;
  }
}

/**
 * Dispatches asynchronous tasks via Google Cloud Tasks. Falls back to disabled if Cloud Tasks config is incomplete.
 */
export class CloudTaskDispatcher {
  private readonly client: CloudTasksClient | null;
  private readonly queuePath: string | null;

  /**
   * @param {AppConfig} config - Application configuration containing Cloud Tasks project, location, queue, and service URL.
   */
  constructor(private readonly config: AppConfig) {
    if (config.cloudTasksProject && config.cloudTasksLocation && config.cloudTasksQueue) {
      this.client = new CloudTasksClient();
      this.queuePath = this.client.queuePath(
        config.cloudTasksProject,
        config.cloudTasksLocation,
        config.cloudTasksQueue,
      );
      return;
    }

    this.client = null;
    this.queuePath = null;
  }

  /**
   * Whether this dispatcher is fully configured and capable of dispatching tasks.
   * @returns {boolean} True if Cloud Tasks client, queue path, and service URL are all available.
   */
  get enabled(): boolean {
    return Boolean(this.client && this.queuePath && this.config.serviceUrl);
  }

  /**
   * Dispatches a task to the configured Cloud Tasks queue.
   * @param {string} pathname - The target endpoint pathname on the service URL.
   * @param {unknown} payload - The JSON-serializable task payload.
   * @returns {Promise<boolean>} True if the task was created successfully, false otherwise.
   */
  async dispatch(pathname: string, payload: unknown): Promise<boolean> {
    if (!this.client || !this.queuePath || !this.config.serviceUrl) {
      return false;
    }

    const url = new URL(pathname, this.config.serviceUrl).toString();
    const body = Buffer.from(JSON.stringify(payload));
    try {
      await this.client.createTask({
        parent: this.queuePath,
        task: {
          httpRequest: {
            url,
            httpMethod: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${this.config.internalApiToken}`,
            },
            body,
          },
        },
      });

      return true;
    } catch (err) {
      console.error("[CloudTaskDispatcher] failed to dispatch task", { pathname, err });
      return false;
    }
  }
}
