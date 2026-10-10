import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthChange, signIn, signOutUser, signUp } from '../lib/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined) // undefined = still resolving

  useEffect(() => {
    const unsubscribe = onAuthChange(setUser)
    return unsubscribe
  }, [])

  const value = {
    user: user || null,
    loading: user === undefined,
    signIn,
    signUp,
    signOut: signOutUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
