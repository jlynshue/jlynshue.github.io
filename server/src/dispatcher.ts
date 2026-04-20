import { CloudTasksClient } from "@google-cloud/tasks";

import type { AppConfig } from "./types.js";

export class MemoryDispatcher {
  get enabled(): boolean {
    return false;
  }

  async dispatch(_pathname: string, _payload: unknown): Promise<boolean> {
    return false;
  }
}

export class CloudTaskDispatcher {
  private readonly client: CloudTasksClient | null;
  private readonly queuePath: string | null;

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

  get enabled(): boolean {
    return Boolean(this.client && this.queuePath && this.config.serviceUrl);
  }

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
