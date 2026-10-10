// Auth abstraction. Same call shape whether PortfolioHub is running against
// the local mock backend or a real Firebase project — components never
// import `firebase/auth` directly.

import app, { isFirebaseConfigured } from './firebase'
import { localCollection, uid } from './localStore'

const SESSION_KEY = 'portfoliohub:session'
let listeners = []
let firebaseAuthMod = null

async function getFirebaseAuth() {
  if (!firebaseAuthMod) {
    firebaseAuthMod = await import('firebase/auth')
  }
  return { auth: firebaseAuthMod.getAuth(app), mod: firebaseAuthMod }
}

function notify(user) {
  listeners.forEach((cb) => cb(user))
}

function getSessionUser() {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function setSessionUser(user) {
  if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user))
  else localStorage.removeItem(SESSION_KEY)
  notify(user)
}

export async function signUp({ email, password, displayName }) {
  if (isFirebaseConfigured) {
    const { auth, mod } = await getFirebaseAuth()
    const cred = await mod.createUserWithEmailAndPassword(auth, email, password)
    if (displayName) await mod.updateProfile(cred.user, { displayName })
    return { uid: cred.user.uid, email: cred.user.email, displayName }
  }
  const existing = localCollection.query('users', (u) => u.email === email)
  if (existing.length) throw new Error('An account with that email already exists.')
  const user = { id: uid(), email, password, displayName: displayName || email.split('@')[0] }
  localCollection.insert('users', user)
  const publicUser = { uid: user.id, email: user.email, displayName: user.displayName }
  setSessionUser(publicUser)
  return publicUser
}

export async function signIn({ email, password }) {
  if (isFirebaseConfigured) {
    const { auth, mod } = await getFirebaseAuth()
    const cred = await mod.signInWithEmailAndPassword(auth, email, password)
    return { uid: cred.user.uid, email: cred.user.email, displayName: cred.user.displayName }
  }
  const match = localCollection
    .query('users', (u) => u.email === email && u.password === password)
    .at(0)
  if (!match) throw new Error('Invalid email or password.')
  const publicUser = { uid: match.id, email: match.email, displayName: match.displayName }
  setSessionUser(publicUser)
  return publicUser
}

export async function signOutUser() {
  if (isFirebaseConfigured) {
    const { auth, mod } = await getFirebaseAuth()
    await mod.signOut(auth)
    return
  }
  setSessionUser(null)
}

export function onAuthChange(callback) {
  if (isFirebaseConfigured) {
    let unsub = () => {}
    getFirebaseAuth().then(({ auth, mod }) => {
      unsub = mod.onAuthStateChanged(auth, (fbUser) => {
        callback(
          fbUser
            ? { uid: fbUser.uid, email: fbUser.email, displayName: fbUser.displayName }
            : null
        )
      })
    })
    return () => unsub()
  }
  listeners.push(callback)
  // Fire immediately with current session, mirroring Firebase's initial callback.
  callback(getSessionUser())
  return () => {
    listeners = listeners.filter((cb) => cb !== callback)
  }
}

export function currentUser() {
  return getSessionUser()
}
