import { createServer, type IncomingMessage, type ServerResponse } from "node:http";

import { Firestore } from "@google-cloud/firestore";

import { createApp } from "./app.js";
import { loadConfig } from "./config.js";
import { CloudTaskDispatcher } from "./dispatcher.js";
import { FirestoreTrackingStore, MemoryTrackingStore } from "./repository.js";
import { HubSpotApiClient, PostHogApiClient } from "./vendors.js";

async function readRequestBody(request: IncomingMessage): Promise<Buffer | undefined> {
  const chunks: Buffer[] = [];
  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  if (chunks.length === 0) {
    return undefined;
  }
  return Buffer.concat(chunks);
}

async function toFetchRequest(request: IncomingMessage): Promise<Request> {
  const protocol = request.headers["x-forwarded-proto"] ?? "http";
  const host = request.headers.host ?? "localhost:8080";
  const url = `${protocol}://${host}${request.url ?? "/"}`;
  const body = request.method && ["GET", "HEAD"].includes(request.method) ? undefined : await readRequestBody(request);
  return new Request(url, {
    method: request.method,
    headers: request.headers as HeadersInit,
    body,
  });
}

async function writeFetchResponse(response: Response, serverResponse: ServerResponse): Promise<void> {
  serverResponse.statusCode = response.status;
  response.headers.forEach((value, key) => {
    if (key.toLowerCase() === "set-cookie") {
      const existing = serverResponse.getHeader("Set-Cookie");
      if (!existing) {
        serverResponse.setHeader("Set-Cookie", [value]);
        return;
      }
      const cookies = Array.isArray(existing) ? existing : [String(existing)];
      serverResponse.setHeader("Set-Cookie", [...cookies, value]);
      return;
    }
    serverResponse.setHeader(key, value);
  });

  if (!response.body) {
    serverResponse.end();
    return;
  }

  const arrayBuffer = await response.arrayBuffer();
  serverResponse.end(Buffer.from(arrayBuffer));
}

function createStore() {
  if (process.env.USE_MEMORY_STORE === "true") {
    return new MemoryTrackingStore();
  }

  if (!process.env.GOOGLE_CLOUD_PROJECT && !process.env.FIRESTORE_PROJECT_ID) {
    return new MemoryTrackingStore();
  }

  return new FirestoreTrackingStore(
    new Firestore({
      projectId: process.env.FIRESTORE_PROJECT_ID ?? process.env.GOOGLE_CLOUD_PROJECT,
    }),
  );
}

const config = loadConfig();
const store = createStore();
const app = createApp(config, {
  store,
  dispatcher: new CloudTaskDispatcher(config),
  posthog: new PostHogApiClient(config),
  hubspot: new HubSpotApiClient(config),
});

const server = createServer(async (request, response) => {
  try {
    const fetchRequest = await toFetchRequest(request);
    const fetchResponse = await app.handleRequest(fetchRequest);
    await writeFetchResponse(fetchResponse, response);
  } catch (error) {
    response.statusCode = 500;
    response.setHeader("Content-Type", "application/json; charset=utf-8");
    response.end(
      JSON.stringify({
        error: "Internal Server Error",
        detail: error instanceof Error ? error.message : String(error),
      }),
    );
  }
});

server.listen(config.port, () => {
  console.log(`jonathanlynshue-site server listening on :${config.port}`);
});
