// Firebase bootstrap.
//
// PortfolioHub runs out of the box against a local mock backend (see db.js,
// storage.js, auth.js) so you can develop and demo without any setup. The
// moment you provide real Firebase config via a .env file (copy .env.example
// to .env and fill in your project's values), every data-access module in
// src/lib switches to talking to real Firestore / Storage / Auth instead —
// no other code in the app needs to change.

import { initializeApp, getApps } from 'firebase/app'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId
)

let app = null
if (isFirebaseConfigured && getApps().length === 0) {
  app = initializeApp(firebaseConfig)
} else if (isFirebaseConfigured) {
  app = getApps()[0]
}

export default app
