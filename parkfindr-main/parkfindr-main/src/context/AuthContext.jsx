import { createContext, useContext, useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, db, isFirebaseConfigured } from '../firebase'

const AuthContext = createContext(null)

const DEMO_USER_KEY = 'parkfindr_demo_user'
const DEMO_USERS_KEY = 'parkfindr_demo_users'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      const stored = localStorage.getItem(DEMO_USER_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        setUser({ uid: parsed.uid, email: parsed.email, displayName: parsed.fullName })
        setProfile(parsed)
      }
      setLoading(false)
      return
    }

    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      if (firebaseUser && db) {
        const snap = await getDoc(doc(db, 'users', firebaseUser.uid))
        setProfile(snap.exists() ? snap.data() : null)
      } else {
        setProfile(null)
      }
      setLoading(false)
    })
    return unsub
  }, [])

  async function signup({ fullName, email, password, vehicleNumber, vehicleType }) {
    const userData = {
      fullName,
      email,
      vehicleNumber,
      vehicleType,
      totalVisits: 0,
      hoursParked: 0,
      amountSpent: 0,
      createdAt: new Date().toISOString(),
    }

    if (!isFirebaseConfigured || !auth) {
      const uid = `demo_${Date.now()}`
      const demo = { uid, ...userData }
      const allUsers = JSON.parse(localStorage.getItem(DEMO_USERS_KEY) || '{}')
      allUsers[email.toLowerCase()] = demo
      localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(allUsers))
      localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demo))
      setUser({ uid, email, displayName: fullName })
      setProfile(demo)
      return demo
    }

    const cred = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(cred.user, { displayName: fullName })
    await setDoc(doc(db, 'users', cred.user.uid), { ...userData, uid: cred.user.uid })
    setProfile({ uid: cred.user.uid, ...userData })
    return cred.user
  }

  async function login(email, password) {
    if (!isFirebaseConfigured || !auth) {
      const allUsers = JSON.parse(localStorage.getItem(DEMO_USERS_KEY) || '{}')
      const found = allUsers[email.toLowerCase()]
      if (!found) throw new Error('No account found for this email. Please sign up first.')
      localStorage.setItem(DEMO_USER_KEY, JSON.stringify(found))
      setUser({ uid: found.uid, email: found.email, displayName: found.fullName })
      setProfile(found)
      return found
    }
    const cred = await signInWithEmailAndPassword(auth, email, password)
    return cred.user
  }

  async function logout() {
    if (!isFirebaseConfigured || !auth) {
      localStorage.removeItem(DEMO_USER_KEY)
      setUser(null)
      setProfile(null)
      return
    }
    await signOut(auth)
    setProfile(null)
  }

  async function updateProfileData(updates) {
    if (!user) return
    const merged = { ...profile, ...updates }
    setProfile(merged)
    if (!isFirebaseConfigured || !db) {
      localStorage.setItem(DEMO_USER_KEY, JSON.stringify(merged))
      return
    }
    await setDoc(doc(db, 'users', user.uid), merged, { merge: true })
  }

  const value = {
    user,
    profile,
    loading,
    signup,
    login,
    logout,
    updateProfile: updateProfileData,
    isAuthenticated: Boolean(user),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
