/**
 * Bulk seed Cloud Firestore from a JSON file.
 * Usage: node scripts/bulkSeed.js <collectionName> /path/to/seed-data.json
 *
 * Firebase config is read from .env.local (VITE_FIREBASE_* vars).
 * seed-data.json format: { "data": [ { "category", "categoryDescription", "title", "url" }, ... ] }
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, writeBatch } from "firebase/firestore";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, "..", ".env.local");
dotenv.config({ path: envPath });

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

const hasConfig =
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.appId;

if (!hasConfig) {
  console.error(
    "Missing Firebase config. Set VITE_FIREBASE_API_KEY, VITE_FIREBASE_PROJECT_ID, VITE_FIREBASE_APP_ID (and optionally others) in .env.local"
  );
  process.exit(1);
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const args = process.argv.slice(2);
if (args.length !== 2) {
  console.error("Usage: node scripts/bulkSeed.js <collectionName> /path/to/seed-data.json");
  process.exit(1);
}

const [collectionName, dataFilePath] = args;

const fullPath = path.resolve(dataFilePath);
if (!fs.existsSync(fullPath)) {
  console.error(`File not found: ${fullPath}`);
  process.exit(1);
}

let rawData;
try {
  rawData = fs.readFileSync(fullPath, "utf8");
} catch (err) {
  console.error("Failed to read file:", err.message);
  process.exit(1);
}

let seedData;
try {
  seedData = JSON.parse(rawData);
} catch (err) {
  console.error("Failed to parse JSON:", err.message);
  process.exit(1);
}

if (!seedData || !Array.isArray(seedData.data)) {
  console.error("JSON must have a top-level 'data' array.");
  process.exit(1);
}

const BATCH_SIZE = 500;

async function seed() {
  const col = collection(db, collectionName);
  const entries = seedData.data;
  let committed = 0;

  for (let i = 0; i < entries.length; i += BATCH_SIZE) {
    const batch = writeBatch(db);
    const chunk = entries.slice(i, i + BATCH_SIZE);

    for (const entry of chunk) {
      const docRef = doc(col);
      const docData = {
        title: entry.title ?? "",
        url: entry.url ?? "",
        category: entry.category ?? null,
        categoryDescription: entry.categoryDescription ?? null
      };
      batch.set(docRef, docData);
    }

    await batch.commit();
    committed += chunk.length;
    console.log(`Committed ${committed}/${entries.length} documents.`);
  }

  console.log(`Bulk import complete. ${committed} documents written to collection "${collectionName}".`);
}

seed().catch((err) => {
  console.error("Error during bulk import:", err);
  process.exit(1);
});
