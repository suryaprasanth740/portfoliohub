import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import { getDoc, listDocs, setDoc } from '../lib/db'

const ProfileContext = createContext(null)

function defaultProfile(user) {
  return {
    displayName: user.displayName || 'New Developer',
    title: 'Software Developer',
    bio: 'Write a short bio about yourself — what you build, what you love working on.',
    username: (user.email || 'me').split('@')[0].toLowerCase().replace(/[^a-z0-9-]/g, ''),
    avatarUrl: '',
    theme: 'midnight',
    published: false,
    socials: { github: '', linkedin: '', twitter: '', website: '' },
  }
}

export function ProfileProvider({ children }) {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!user) {
      setProfile(null)
      setLoading(false)
      return
    }
    setLoading(true)
    let doc = await getDoc('profiles', user.uid)
    if (!doc) {
      doc = await setDoc('profiles', user.uid, defaultProfile(user))
      doc = { id: user.uid, ...defaultProfile(user) }
    }
    setProfile(doc)
    setLoading(false)
  }, [user])

  useEffect(() => {
    load()
  }, [load])

  const saveProfile = useCallback(
    async (patch) => {
      if (!user) return
      // Enforce unique usernames among other profiles before saving.
      if (patch.username) {
        const clean = patch.username.toLowerCase().replace(/[^a-z0-9-]/g, '')
        const taken = await listDocs('profiles', { username: clean })
        if (taken.some((p) => p.id !== user.uid)) {
          throw new Error('That username is already taken. Try another.')
        }
        patch = { ...patch, username: clean }
      }
      const updated = await setDoc('profiles', user.uid, { ...profile, ...patch })
      setProfile((prev) => ({ ...prev, ...updated }))
      return updated
    },
    [user, profile]
  )

  return (
    <ProfileContext.Provider value={{ profile, loading, saveProfile, reload: load }}>
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfile() {
  const ctx = useContext(ProfileContext)
  if (!ctx) throw new Error('useProfile must be used within ProfileProvider')
  return ctx
}
