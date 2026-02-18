import { addDoc, collection, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

const COOL_LINKS_COLLECTION = "coolLinks";

export interface CoolLinkEntry {
  title: string;
  url: string;
  category: string | null;
  categoryDescription: string | null;
}

/** Link with Firestore document id (for list display and keys). */
export interface CoolLink extends CoolLinkEntry {
  id: string;
}

/**
 * Adds a new link to the "cool links" collection.
 * @throws If Firebase is not configured or the write fails.
 */
export async function addCoolLink(entry: CoolLinkEntry): Promise<void> {
  if (!db) {
    throw new Error("Firebase is not configured. Add VITE_FIREBASE_* env vars.");
  }
  await addDoc(collection(db, COOL_LINKS_COLLECTION), {
    title: entry.title,
    url: entry.url,
    category: entry.category,
    categoryDescription: entry.categoryDescription
  });
}

/**
 * Subscribes to the cool links collection for real-time updates.
 * Calls the callback with the current list whenever the collection changes.
 * @returns Unsubscribe function to stop listening.
 */
export function subscribeCoolLinks(callback: (links: CoolLink[]) => void): () => void {
  if (!db) {
    callback([]);
    return () => {};
  }
  const unsubscribe = onSnapshot(
    collection(db, COOL_LINKS_COLLECTION),
    (snapshot) => {
      const links: CoolLink[] = snapshot.docs.map((doc) => {
        const d = doc.data();
        return {
          id: doc.id,
          title: (d.title as string) ?? "",
          url: (d.url as string) ?? "",
          category: (d.category as string | null) ?? null,
          categoryDescription: (d.categoryDescription as string | null) ?? null
        };
      });
      callback(links);
    },
    (err) => {
      console.error("Cool links subscription error:", err);
      callback([]);
    }
  );
  return unsubscribe;
}
