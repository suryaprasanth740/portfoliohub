// Data-access layer. Every dashboard/portfolio component calls these
// functions instead of talking to Firestore or localStorage directly, so
// switching from the local mock backend to a real Firebase project (by
// setting the VITE_FIREBASE_* env vars — see .env.example) requires no
// changes anywhere else in the app.

import app, { isFirebaseConfigured } from './firebase'
import { localCollection, uid } from './localStore'

let firestoreMod = null
async function getFirestore() {
  if (!firestoreMod) {
    const mod = await import('firebase/firestore')
    firestoreMod = { db: mod.getFirestore(app), mod }
  }
  return firestoreMod
}

/** Fetch a single document by id. Returns null if it doesn't exist. */
export async function getDoc(collectionName, id) {
  if (!id) return null
  if (isFirebaseConfigured) {
    const { db, mod } = await getFirestore()
    const snap = await mod.getDoc(mod.doc(db, collectionName, id))
    return snap.exists() ? { id: snap.id, ...snap.data() } : null
  }
  return localCollection.get(collectionName, id)
}

/**
 * List documents in a collection, optionally filtered.
 * `filter` is a plain object of exact-match field/value pairs (kept simple
 * on purpose — it maps 1:1 onto Firestore `where('field', '==', value)`).
 */
export async function listDocs(collectionName, filter = {}) {
  if (isFirebaseConfigured) {
    const { db, mod } = await getFirestore()
    const constraints = Object.entries(filter).map(([field, value]) =>
      mod.where(field, '==', value)
    )
    const q = mod.query(mod.collection(db, collectionName), ...constraints)
    const snap = await mod.getDocs(q)
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
  }
  const keys = Object.keys(filter)
  return localCollection.query(collectionName, (record) =>
    keys.every((k) => record[k] === filter[k])
  )
}

/** Create a new document with an auto id. Returns the created record. */
export async function addDoc(collectionName, data) {
  const record = { ...data, createdAt: data.createdAt || new Date().toISOString() }
  if (isFirebaseConfigured) {
    const { db, mod } = await getFirestore()
    const ref = await mod.addDoc(mod.collection(db, collectionName), record)
    return { id: ref.id, ...record }
  }
  return localCollection.insert(collectionName, { id: uid(), ...record })
}

/** Create or fully replace a document at a known id. */
export async function setDoc(collectionName, id, data) {
  if (isFirebaseConfigured) {
    const { db, mod } = await getFirestore()
    await mod.setDoc(mod.doc(db, collectionName, id), data, { merge: true })
    return { id, ...data }
  }
  return localCollection.upsert(collectionName, id, data)
}

/** Patch fields on an existing document. */
export async function updateDoc(collectionName, id, patch) {
  const withTimestamp = { ...patch, updatedAt: new Date().toISOString() }
  if (isFirebaseConfigured) {
    const { db, mod } = await getFirestore()
    await mod.updateDoc(mod.doc(db, collectionName, id), withTimestamp)
    return { id, ...withTimestamp }
  }
  return localCollection.update(collectionName, id, withTimestamp)
}

export async function deleteDoc(collectionName, id) {
  if (isFirebaseConfigured) {
    const { db, mod } = await getFirestore()
    await mod.deleteDoc(mod.doc(db, collectionName, id))
    return
  }
  localCollection.remove(collectionName, id)
}
