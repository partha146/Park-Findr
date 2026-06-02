import { createContext, useContext, useEffect, useState } from 'react'
import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db, isFirebaseConfigured } from '../firebase'
import { useAuth } from './AuthContext'
import { calculateCost, getHourlyRate } from '../utils/pricing'
import { seedFloorOccupied } from '../utils/slots'

const ParkingContext = createContext(null)
const DEMO_SESSIONS_KEY = 'parkfindr_sessions'
const DEMO_ACTIVE_KEY = 'parkfindr_active'

export function ParkingProvider({ children }) {
  const { user, profile, updateProfile } = useAuth()
  const [activeSession, setActiveSession] = useState(null)
  const [bookings, setBookings] = useState([])
  const [pendingBilling, setPendingBilling] = useState(null)
  const [occupiedSlots, setOccupiedSlots] = useState({})

  useEffect(() => {
    if (!user) {
      setActiveSession(null)
      setBookings([])
      return
    }

    if (!isFirebaseConfigured || !db) {
      const active = localStorage.getItem(`${DEMO_ACTIVE_KEY}_${user.uid}`)
      setActiveSession(active ? JSON.parse(active) : null)
      const sessions = localStorage.getItem(`${DEMO_SESSIONS_KEY}_${user.uid}`)
      const parsed = sessions ? JSON.parse(sessions) : []
      setBookings(parsed.filter((s) => s.status === 'paid'))
      return
    }

    const activeQ = query(
      collection(db, 'parkingSessions'),
      where('userId', '==', user.uid),
      where('status', '==', 'active')
    )
    const unsubActive = onSnapshot(activeQ, (snap) => {
      if (!snap.empty) {
        const docSnap = snap.docs[0]
        setActiveSession({ id: docSnap.id, ...docSnap.data() })
      } else {
        setActiveSession(null)
      }
    })

    const bookingsQ = query(
      collection(db, 'parkingSessions'),
      where('userId', '==', user.uid),
      where('status', '==', 'paid'),
      orderBy('exitTime', 'desc')
    )
    const unsubBookings = onSnapshot(bookingsQ, (snap) => {
      setBookings(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    })

    return () => {
      unsubActive()
      unsubBookings()
    }
  }, [user])

  // ─── Seed random occupied slots into Firestore if this location has none yet ───
  async function seedSlotsIfEmpty(locationId, floors) {
    if (!isFirebaseConfigured || !db) return

    const SLOT_LETTERS = ['A', 'B', 'C', 'D', 'E']
    const SLOTS_PER_ROW = 10

    const existingSnap = await getDocs(
      query(collection(db, 'slotStates'), where('locationId', '==', locationId))
    )

    if (!existingSnap.empty) return // already seeded — don't re-seed

    // Write random occupied/available slots per floor to Firestore
    const writes = []
    const floorsToSeed = floors && floors.length > 0 ? floors : ['main']

    for (const floor of floorsToSeed) {
      const occupiedSet = seedFloorOccupied(floor)
      for (const letter of SLOT_LETTERS) {
        for (let n = 1; n <= SLOTS_PER_ROW; n++) {
          const slotId = floor === 'main' ? `A${n}` : `${floor}-${letter}${n}`
          const status = occupiedSet.has(slotId) ? 'occupied' : 'available'
          writes.push(
            addDoc(collection(db, 'slotStates'), {
              locationId,
              floor,
              slotId,
              status,
              seeded: true,
              updatedAt: new Date().toISOString(),
            })
          )
        }
      }
    }
    await Promise.all(writes)
  }

  // ─── Real-time listener: fires instantly on all phones when any slot changes ──
  function subscribeToSlots(locationId, onUpdate) {
    if (!isFirebaseConfigured || !db) return () => {}

    const q = query(
      collection(db, 'slotStates'),
      where('locationId', '==', locationId)
    )
    return onSnapshot(q, (snap) => {
      // Build { floor: { slotId: status } } map
      const map = {}
      snap.docs.forEach((d) => {
        const data = d.data()
        if (!map[data.floor]) map[data.floor] = {}
        map[data.floor][data.slotId] = data.status
      })
      onUpdate(map)
    })
  }

  async function loadOccupiedSlots(locationId) {
    if (!isFirebaseConfigured || !db) {
      const key = `parkfindr_occupied_${locationId}`
      const stored = localStorage.getItem(key)
      return stored ? new Set(JSON.parse(stored)) : seedOccupied()
    }
    const q = query(
      collection(db, 'parkingSessions'),
      where('locationId', '==', locationId),
      where('status', '==', 'active')
    )
    const snap = await getDocs(q)
    const occupied = new Set(snap.docs.map((d) => d.data().slotId))
    setOccupiedSlots((prev) => ({ ...prev, [locationId]: occupied }))
    return occupied
  }

  function seedOccupied() {
    const occupied = new Set()
    const count = Math.floor(Math.random() * 8) + 3
    for (let i = 0; i < count; i++) {
      occupied.add(`A${Math.floor(Math.random() * 20) + 1}`)
    }
    return occupied
  }

  async function startParking({ location, slotId, vehicleNumber }) {
    if (!user || !profile) throw new Error('Not authenticated')

    const hourlyRate = getHourlyRate(profile.vehicleType, location.category)
    const session = {
      userId: user.uid,
      locationId: location.id,
      locationName: location.name,
      locationArea: location.area,
      category: location.category,
      slotId,
      vehicleNumber,
      vehicleType: profile.vehicleType,
      hourlyRate,
      entryTime: new Date().toISOString(),
      status: 'active',
      couponCode: null,
    }

    if (!isFirebaseConfigured || !db) {
      const id = `session_${Date.now()}`
      const full = { id, ...session }
      localStorage.setItem(`${DEMO_ACTIVE_KEY}_${user.uid}`, JSON.stringify(full))
      const key = `parkfindr_occupied_${location.id}`
      const occ = seedOccupied()
      occ.add(slotId)
      localStorage.setItem(key, JSON.stringify([...occ]))
      setActiveSession(full)
      return full
    }

    // Write parking session to Firestore
    const ref = await addDoc(collection(db, 'parkingSessions'), session)
    const full = { id: ref.id, ...session }
    setActiveSession(full)

    // Mark slot as occupied in slotStates → instantly visible on ALL other phones
    const slotSnap = await getDocs(
      query(
        collection(db, 'slotStates'),
        where('locationId', '==', location.id),
        where('slotId', '==', slotId)
      )
    )
    if (!slotSnap.empty) {
      await updateDoc(doc(db, 'slotStates', slotSnap.docs[0].id), {
        status: 'occupied',
        bookedBy: user.uid,
        sessionId: ref.id,
        updatedAt: new Date().toISOString(),
      })
    }

    return full
  }

  async function endParking(couponCode = null) {
    if (!activeSession) return null

    const exitTime = new Date().toISOString()
    const total = calculateCost(activeSession.entryTime, exitTime, activeSession.hourlyRate)

    const completed = {
      ...activeSession,
      exitTime,
      totalAmount: total,
      couponCode,
      status: 'pendingPayment',
    }

    setPendingBilling(completed)

    if (!isFirebaseConfigured || !db) {
      localStorage.removeItem(`${DEMO_ACTIVE_KEY}_${user.uid}`)
      const sessions = JSON.parse(localStorage.getItem(`${DEMO_SESSIONS_KEY}_${user.uid}`) || '[]')
      sessions.unshift({ ...completed, id: activeSession.id })
      localStorage.setItem(`${DEMO_SESSIONS_KEY}_${user.uid}`, JSON.stringify(sessions))
      setBookings(sessions.filter((s) => s.status === 'paid'))
      setActiveSession(null)
      return completed
    }

    await updateDoc(doc(db, 'parkingSessions', activeSession.id), {
      exitTime,
      totalAmount: total,
      couponCode,
      status: 'pendingPayment',
    })

    // Free the slot → instantly available again on all other phones
    const slotSnap = await getDocs(
      query(
        collection(db, 'slotStates'),
        where('locationId', '==', activeSession.locationId),
        where('slotId', '==', activeSession.slotId)
      )
    )
    if (!slotSnap.empty) {
      await updateDoc(doc(db, 'slotStates', slotSnap.docs[0].id), {
        status: 'available',
        bookedBy: null,
        sessionId: null,
        updatedAt: new Date().toISOString(),
      })
    }

    setActiveSession(null)

    return completed
  }

  async function completePayment(paymentMethod, finalAmount) {
    if (!pendingBilling) return
    const paid = { ...pendingBilling, paymentMethod, paidAmount: finalAmount, paidAt: new Date().toISOString() }

    const exitTime = new Date(pendingBilling.exitTime)
    const entryTime = new Date(pendingBilling.entryTime)
    const hoursAdded = (exitTime - entryTime) / 3600000

    const prevVisits = profile?.totalVisits || 0
    const prevHours = profile?.hoursParked || 0
    const prevAmount = profile?.amountSpent || 0

    const nextVisits = prevVisits + 1
    const nextHours = Math.round((prevHours + hoursAdded) * 10) / 10
    const nextAmount = prevAmount + finalAmount

    if (isFirebaseConfigured && db && pendingBilling.id) {
      await updateDoc(doc(db, 'parkingSessions', pendingBilling.id), {
        paymentMethod,
        paymentStatus: 'paid',
        paidAmount: finalAmount,
        paidAt: paid.paidAt,
        status: 'paid',
      })

      await updateProfile({
        totalVisits: nextVisits,
        hoursParked: nextHours,
        amountSpent: nextAmount,
      })
    } else if (user) {
      const sessions = JSON.parse(localStorage.getItem(`${DEMO_SESSIONS_KEY}_${user.uid}`) || '[]')
      const idx = sessions.findIndex((s) => s.id === pendingBilling.id)
      if (idx >= 0) {
        sessions[idx] = { ...sessions[idx], ...paid, paymentStatus: 'paid', status: 'paid' }
        localStorage.setItem(`${DEMO_SESSIONS_KEY}_${user.uid}`, JSON.stringify(sessions))
        setBookings(sessions.filter((s) => s.status === 'paid'))
      }

      await updateProfile({
        totalVisits: nextVisits,
        hoursParked: nextHours,
        amountSpent: nextAmount,
      })
    }

    setPendingBilling(null)
    return paid
  }

  const value = {
    activeSession,
    bookings,
    pendingBilling,
    setPendingBilling,
    occupiedSlots,
    loadOccupiedSlots,
    subscribeToSlots,
    seedSlotsIfEmpty,
    startParking,
    endParking,
    completePayment,
  }

  return <ParkingContext.Provider value={value}>{children}</ParkingContext.Provider>
}

export function useParking() {
  const ctx = useContext(ParkingContext)
  if (!ctx) throw new Error('useParking must be used within ParkingProvider')
  return ctx
}
