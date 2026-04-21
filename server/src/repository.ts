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

/**
 * An in-memory implementation of TrackingStore for development and testing.
 * Data is stored in Maps and does not persist across restarts.
 */
export class MemoryTrackingStore implements TrackingStore {
  profiles = new Map<string, TrackingProfile>();
  events = new Map<string, NormalizedEvent>();
  contacts = new Map<string, ContactRecord>();
  cursors = new Map<string, string>();

  /**
   * Retrieves a tracking profile by anonymous ID.
   * @param {string} anonymousId - The anonymous visitor identifier.
   * @returns {Promise<TrackingProfile | null>} The profile, or null if not found.
   */
  async getProfile(anonymousId: string): Promise<TrackingProfile | null> {
    return this.profiles.get(anonymousId) ?? null;
  }

  /**
   * Saves or overwrites a tracking profile.
   * @param {TrackingProfile} profile - The profile to store.
   * @returns {Promise<void>}
   */
  async saveProfile(profile: TrackingProfile): Promise<void> {
    this.profiles.set(profile.anonymousId, profile);
  }

  /**
   * Saves a normalized event.
   * @param {NormalizedEvent} event - The event to store.
   * @returns {Promise<void>}
   */
  async saveEvent(event: NormalizedEvent): Promise<void> {
    this.events.set(event.eventId, event);
  }

  /**
   * Patches the delivery status of an existing event.
   * @param {string} eventId - The event identifier.
   * @param {Partial<DeliveryStatus>} patch - The delivery status fields to merge.
   * @returns {Promise<void>}
   */
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

  /**
   * Saves or overwrites a contact record.
   * @param {ContactRecord} contact - The contact to store.
   * @returns {Promise<void>}
   */
  async saveContact(contact: ContactRecord): Promise<void> {
    this.contacts.set(contact.email.toLowerCase(), contact);
  }

  /**
   * Retrieves a contact record by email address.
   * @param {string} email - The contact email (case-insensitive).
   * @returns {Promise<ContactRecord | null>} The contact, or null if not found.
   */
  async getContact(email: string): Promise<ContactRecord | null> {
    return this.contacts.get(email.toLowerCase()) ?? null;
  }

  /**
   * Retrieves a cursor value by key.
   * @param {string} key - The cursor key.
   * @returns {Promise<string | null>} The cursor value, or null if not set.
   */
  async getCursor(key: string): Promise<string | null> {
    return this.cursors.get(key) ?? null;
  }

  /**
   * Sets a cursor value by key.
   * @param {string} key - The cursor key.
   * @param {string} value - The cursor value to store.
   * @returns {Promise<void>}
   */
  async setCursor(key: string, value: string): Promise<void> {
    this.cursors.set(key, value);
  }
}

/**
 * A Firestore-backed implementation of TrackingStore for production use.
 * Data is persisted in Firestore collections: profiles, events, contacts, and meta.
 */
export class FirestoreTrackingStore implements TrackingStore {
  /**
   * @param {Firestore} firestore - The Firestore client instance.
   */
  constructor(readonly firestore: Firestore) {}

  /**
   * Retrieves a tracking profile by anonymous ID from the "profiles" collection.
   * @param {string} anonymousId - The anonymous visitor identifier.
   * @returns {Promise<TrackingProfile | null>} The profile, or null if not found.
   */
  async getProfile(anonymousId: string): Promise<TrackingProfile | null> {
    const snapshot = await this.firestore.collection("profiles").doc(anonymousId).get();
    return snapshot.exists ? (snapshot.data() as TrackingProfile) : null;
  }

  /**
   * Saves or merges a tracking profile into the "profiles" collection.
   * @param {TrackingProfile} profile - The profile to store.
   * @returns {Promise<void>}
   */
  async saveProfile(profile: TrackingProfile): Promise<void> {
    await this.firestore.collection("profiles").doc(profile.anonymousId).set(profile, { merge: true });
  }

  /**
   * Saves or merges a normalized event into the "events" collection.
   * @param {NormalizedEvent} event - The event to store.
   * @returns {Promise<void>}
   */
  async saveEvent(event: NormalizedEvent): Promise<void> {
    await this.firestore.collection("events").doc(event.eventId).set(event, { merge: true });
  }

  /**
   * Patches the delivery status of an event in the "events" collection using a merge write.
   * @param {string} eventId - The event identifier.
   * @param {Partial<DeliveryStatus>} patch - The delivery status fields to merge.
   * @returns {Promise<void>}
   */
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

  /**
   * Saves or merges a contact record into the "contacts" collection.
   * @param {ContactRecord} contact - The contact to store.
   * @returns {Promise<void>}
   */
  async saveContact(contact: ContactRecord): Promise<void> {
    await this.firestore.collection("contacts").doc(contactDocId(contact.email)).set(contact, { merge: true });
  }

  /**
   * Retrieves a contact record by email from the "contacts" collection.
   * @param {string} email - The contact email (case-insensitive).
   * @returns {Promise<ContactRecord | null>} The contact, or null if not found.
   */
  async getContact(email: string): Promise<ContactRecord | null> {
    const snapshot = await this.firestore.collection("contacts").doc(contactDocId(email)).get();
    return snapshot.exists ? (snapshot.data() as ContactRecord) : null;
  }

  /**
   * Retrieves a cursor value by key from the "meta" collection.
   * @param {string} key - The cursor key.
   * @returns {Promise<string | null>} The cursor value, or null if not set.
   */
  async getCursor(key: string): Promise<string | null> {
    const snapshot = await this.firestore.collection("meta").doc(key).get();
    return snapshot.exists ? String(snapshot.data()?.value ?? "") : null;
  }

  /**
   * Sets a cursor value by key in the "meta" collection.
   * @param {string} key - The cursor key.
   * @param {string} value - The cursor value to store.
   * @returns {Promise<void>}
   */
  async setCursor(key: string, value: string): Promise<void> {
    await this.firestore.collection("meta").doc(key).set({ value }, { merge: true });
  }
}
