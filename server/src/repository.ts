import { Firestore } from "@google-cloud/firestore";

import type {
  ContactRecord,
  DeliveryStatus,
  NormalizedEvent,
  TrackingProfile,
  TrackingStore,
} from "./types.js";

function contactDocId(email: string): string {
  return encodeURIComponent(email.toLowerCase());
}

export class MemoryTrackingStore implements TrackingStore {
  profiles = new Map<string, TrackingProfile>();
  events = new Map<string, NormalizedEvent>();
  contacts = new Map<string, ContactRecord>();
  cursors = new Map<string, string>();

  async getProfile(anonymousId: string): Promise<TrackingProfile | null> {
    return this.profiles.get(anonymousId) ?? null;
  }

  async saveProfile(profile: TrackingProfile): Promise<void> {
    this.profiles.set(profile.anonymousId, profile);
  }

  async saveEvent(event: NormalizedEvent): Promise<void> {
    this.events.set(event.eventId, event);
  }

  async updateEventDelivery(eventId: string, patch: Partial<DeliveryStatus>): Promise<void> {
    const existing = this.events.get(eventId);
    if (!existing) {
      return;
    }
    existing.delivery = {
      ...existing.delivery,
      ...patch,
      updatedAt: patch.updatedAt ?? new Date().toISOString(),
    };
    this.events.set(eventId, existing);
  }

  async saveContact(contact: ContactRecord): Promise<void> {
    this.contacts.set(contact.email.toLowerCase(), contact);
  }

  async getContact(email: string): Promise<ContactRecord | null> {
    return this.contacts.get(email.toLowerCase()) ?? null;
  }

  async getCursor(key: string): Promise<string | null> {
    return this.cursors.get(key) ?? null;
  }

  async setCursor(key: string, value: string): Promise<void> {
    this.cursors.set(key, value);
  }
}

export class FirestoreTrackingStore implements TrackingStore {
  constructor(private readonly firestore: Firestore) {}

  async getProfile(anonymousId: string): Promise<TrackingProfile | null> {
    const snapshot = await this.firestore.collection("profiles").doc(anonymousId).get();
    return snapshot.exists ? (snapshot.data() as TrackingProfile) : null;
  }

  async saveProfile(profile: TrackingProfile): Promise<void> {
    await this.firestore.collection("profiles").doc(profile.anonymousId).set(profile, { merge: true });
  }

  async saveEvent(event: NormalizedEvent): Promise<void> {
    await this.firestore.collection("events").doc(event.eventId).set(event, { merge: true });
  }

  async updateEventDelivery(eventId: string, patch: Partial<DeliveryStatus>): Promise<void> {
    await this.firestore.collection("events").doc(eventId).set(
      {
        delivery: {
          ...patch,
          updatedAt: patch.updatedAt ?? new Date().toISOString(),
        },
      },
      { merge: true },
    );
  }

  async saveContact(contact: ContactRecord): Promise<void> {
    await this.firestore.collection("contacts").doc(contactDocId(contact.email)).set(contact, { merge: true });
  }

  async getContact(email: string): Promise<ContactRecord | null> {
    const snapshot = await this.firestore.collection("contacts").doc(contactDocId(email)).get();
    return snapshot.exists ? (snapshot.data() as ContactRecord) : null;
  }

  async getCursor(key: string): Promise<string | null> {
    const snapshot = await this.firestore.collection("meta").doc(key).get();
    return snapshot.exists ? String(snapshot.data()?.value ?? "") : null;
  }

  async setCursor(key: string, value: string): Promise<void> {
    await this.firestore.collection("meta").doc(key).set({ value }, { merge: true });
  }
}
