import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  onSnapshot,
  deleteDoc,
  updateDoc,
  query,
  orderBy
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore with custom database ID specified in config
export const db = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Generic Cloud Firestore collection real-time subscriber
export function subscribeCollection<T extends { id: string }>(
  collectionName: string,
  onData: (items: T[]) => void,
  fallbackInitialData: T[] = []
) {
  const colRef = collection(db, collectionName);
  
  const unsubscribe = onSnapshot(
    colRef,
    async (snapshot) => {
      if (snapshot.empty && fallbackInitialData.length > 0) {
        // Seed initial benchmark/mock data if collection is completely empty
        try {
          for (const item of fallbackInitialData) {
            await setDoc(doc(db, collectionName, item.id), item, { merge: true });
          }
        } catch (err) {
          console.error(`Error seeding initial ${collectionName} data:`, err);
        }
      } else {
        const items: T[] = [];
        snapshot.forEach((docSnap) => {
          items.push({ ...(docSnap.data() as T), id: docSnap.id });
        });
        onData(items);
      }
    },
    (error) => {
      console.error(`Firestore subscription error on ${collectionName}:`, error);
      // Fallback to local data if offline or error
      onData(fallbackInitialData);
    }
  );

  return unsubscribe;
}

// Save or Update a single document in Firestore
export async function saveDocument<T extends { id: string }>(collectionName: string, item: T): Promise<void> {
  try {
    const docRef = doc(db, collectionName, item.id);
    await setDoc(docRef, item, { merge: true });
  } catch (err) {
    console.error(`Error saving document in ${collectionName}:`, err);
    throw err;
  }
}

// Delete a document from Firestore
export async function removeDocument(collectionName: string, id: string): Promise<void> {
  try {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
  } catch (err) {
    console.error(`Error removing document ${id} from ${collectionName}:`, err);
    throw err;
  }
}
