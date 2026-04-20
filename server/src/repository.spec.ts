import { describe, expect, it } from "vitest";

import { MemoryTrackingStore } from "./repository.js";
import type { ContactRecord, NormalizedEvent, TrackingProfile } from "./types.js";

function makeProfile(overrides: Partial<TrackingProfile> = {}): TrackingProfile {
  return {
    anonymousId: "anon-1",
    sessionId: "session-1",
    sessionStartedAt: "2026-04-19T10:00:00.000Z",
    sessionLastSeenAt: "2026-04-19T10:05:00.000Z",
    firstTouch: {
      path: "/",
      referrer: null,
      utmSource: null,
      utmMedium: null,
      utmCampaign: null,
      utmContent: null,
      occurredAt: "2026-04-19T10:00:00.000Z",
    },
    lastTouch: {
      path: "/about",
      referrer: null,
      utmSource: null,
      utmMedium: null,
      utmCampaign: null,
      utmContent: null,
      occurredAt: "2026-04-19T10:05:00.000Z",
    },
    lastPath: "/about",
    ...overrides,
  };
}

function makeEvent(overrides: Partial<NormalizedEvent> = {}): NormalizedEvent {
  return {
    eventId: "evt-1",
    eventName: "page_viewed",
    occurredAt: "2026-04-19T10:00:00.000Z",
    anonymousId: "anon-1",
    sessionId: "session-1",
    path: "/",
    referrer: null,
    utmSource: null,
    utmMedium: null,
    utmCampaign: null,
    utmContent: null,
    ctaId: null,
    ctaPlacement: null,
    assetId: null,
    contactEmail: null,
    hubspotContactId: null,
    hubspotDealId: null,
    dealStage: null,
    value: null,
    properties: {},
    delivery: { posthogStatus: "pending", updatedAt: "2026-04-19T10:00:00.000Z" },
    ...overrides,
  };
}

function makeContact(overrides: Partial<ContactRecord> = {}): ContactRecord {
  return {
    email: "test@example.com",
    anonymousId: "anon-1",
    hubspotContactId: null,
    createdAt: "2026-04-19T10:00:00.000Z",
    updatedAt: "2026-04-19T10:00:00.000Z",
    firstTouch: null,
    lastTouch: null,
    latestLeadAsset: null,
    latestCtaId: null,
    latestCtaPlacement: null,
    ...overrides,
  };
}

describe("MemoryTrackingStore", () => {
  describe("saveProfile / getProfile", () => {
    it("returns null for a missing profile", async () => {
      const store = new MemoryTrackingStore();
      expect(await store.getProfile("nonexistent")).toBeNull();
    });

    it("saves and retrieves a profile by anonymousId", async () => {
      const store = new MemoryTrackingStore();
      const profile = makeProfile();
      await store.saveProfile(profile);
      expect(await store.getProfile("anon-1")).toEqual(profile);
    });

    it("overwrites an existing profile on re-save", async () => {
      const store = new MemoryTrackingStore();
      await store.saveProfile(makeProfile());
      const updated = makeProfile({ lastPath: "/contact" });
      await store.saveProfile(updated);
      expect(await store.getProfile("anon-1")).toEqual(updated);
    });
  });

  describe("saveEvent", () => {
    it("saves an event and stores it by eventId", async () => {
      const store = new MemoryTrackingStore();
      const event = makeEvent();
      await store.saveEvent(event);
      expect(store.events.get("evt-1")).toEqual(event);
    });

    it("stores multiple events independently", async () => {
      const store = new MemoryTrackingStore();
      await store.saveEvent(makeEvent({ eventId: "evt-1" }));
      await store.saveEvent(makeEvent({ eventId: "evt-2", eventName: "cta_clicked" }));
      expect(store.events.size).toBe(2);
      expect(store.events.get("evt-2")?.eventName).toBe("cta_clicked");
    });
  });

  describe("updateEventDelivery", () => {
    it("updates delivery status on an existing event", async () => {
      const store = new MemoryTrackingStore();
      await store.saveEvent(makeEvent());
      await store.updateEventDelivery("evt-1", {
        posthogStatus: "sent",
        updatedAt: "2026-04-19T10:01:00.000Z",
      });
      const updated = store.events.get("evt-1");
      expect(updated?.delivery.posthogStatus).toBe("sent");
      expect(updated?.delivery.updatedAt).toBe("2026-04-19T10:01:00.000Z");
    });

    it("does nothing when the event does not exist", async () => {
      const store = new MemoryTrackingStore();
      await store.updateEventDelivery("missing", { posthogStatus: "sent" });
      expect(store.events.size).toBe(0);
    });

    it("merges partial delivery fields without overwriting others", async () => {
      const store = new MemoryTrackingStore();
      await store.saveEvent(
        makeEvent({
          delivery: {
            posthogStatus: "sent",
            hubspotStatus: "pending",
            updatedAt: "2026-04-19T10:00:00.000Z",
          },
        }),
      );
      await store.updateEventDelivery("evt-1", {
        hubspotStatus: "sent",
        updatedAt: "2026-04-19T10:02:00.000Z",
      });
      const delivery = store.events.get("evt-1")?.delivery;
      expect(delivery?.posthogStatus).toBe("sent");
      expect(delivery?.hubspotStatus).toBe("sent");
    });
  });

  describe("saveContact / getContact", () => {
    it("returns null for a missing contact", async () => {
      const store = new MemoryTrackingStore();
      expect(await store.getContact("nobody@example.com")).toBeNull();
    });

    it("saves and retrieves a contact by email", async () => {
      const store = new MemoryTrackingStore();
      const contact = makeContact();
      await store.saveContact(contact);
      expect(await store.getContact("test@example.com")).toEqual(contact);
    });

    it("performs case-insensitive email lookup", async () => {
      const store = new MemoryTrackingStore();
      await store.saveContact(makeContact({ email: "Hello@Example.COM" }));
      expect(await store.getContact("hello@example.com")).toMatchObject({ email: "Hello@Example.COM" });
    });
  });

  describe("getCursor / setCursor", () => {
    it("returns null for a missing cursor", async () => {
      const store = new MemoryTrackingStore();
      expect(await store.getCursor("unknown-key")).toBeNull();
    });

    it("sets and retrieves a cursor value", async () => {
      const store = new MemoryTrackingStore();
      await store.setCursor("hubspot-deals", "2026-04-19T10:00:00.000Z");
      expect(await store.getCursor("hubspot-deals")).toBe("2026-04-19T10:00:00.000Z");
    });

    it("overwrites an existing cursor value", async () => {
      const store = new MemoryTrackingStore();
      await store.setCursor("hubspot-deals", "old-value");
      await store.setCursor("hubspot-deals", "new-value");
      expect(await store.getCursor("hubspot-deals")).toBe("new-value");
    });
  });
});
