import { openDB } from 'idb';

const dbName = 'quizDB';
const storeName = 'quizAttempts';

export async function initDB() {
  const db = await openDB(dbName, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
      }
    },
  });
  return db;
}

export async function saveQuizAttempt(attempt) {
  const db = await initDB();
  return db.add(storeName, attempt);
}

export async function getQuizAttempts() {
  const db = await initDB();
  return db.getAll(storeName);
}

export async function clearQuizAttempts() {
  const db = await initDB();
  const tx = db.transaction(storeName, 'readwrite');
  await tx.objectStore(storeName).clear();
  return tx.done;
}