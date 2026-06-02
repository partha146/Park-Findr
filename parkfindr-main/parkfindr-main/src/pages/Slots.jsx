import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Layout from '../components/Layout'
import PageHeader from '../components/PageHeader'
import { getLocationById } from '../data/locations'
import { useParking } from '../context/ParkingContext'
import { generateFloorSlots, generateSlots, getFloorDistance, seedFloorOccupied } from '../utils/slots'
import { isFirebaseConfigured } from '../firebase'

// ─── Floor tab pill ────────────────────────────────────────────────────────────
function FloorTab({ label, isActive, availableCount, isEntry, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex-shrink-0 flex flex-col items-center px-3.5 py-2 rounded-xl transition-all duration-200 ${
        isActive
          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
          : 'bg-white text-gray-600 border border-gray-100'
      }`}
    >
      {isEntry && (
        <span
          className={`text-[8px] font-bold uppercase tracking-wider mb-0.5 ${
            isActive ? 'text-indigo-200' : 'text-indigo-400'
          }`}
        >
          Entry
        </span>
      )}
      <span className="text-[13px] font-semibold leading-none">{label}</span>
      <span
        className={`text-[10px] mt-0.5 font-medium ${
          isActive ? 'text-indigo-200' : availableCount > 0 ? 'text-emerald-500' : 'text-red-400'
        }`}
      >
        {availableCount} free
      </span>
    </button>
  )
}

// ─── Slot button ───────────────────────────────────────────────────────────────
function SlotButton({ slot, isClosest, onClick }) {
  const available = slot.status === 'available'
  return (
    <button
      type="button"
      disabled={!available}
      onClick={() => available && onClick(slot)}
      className={`relative aspect-square rounded-xl font-semibold text-[12px] flex flex-col items-center justify-center gap-0.5 transition-transform active:scale-95 ${
        available
          ? isClosest
            ? 'bg-amber-400 text-white shadow-sm shadow-amber-200/60 ring-2 ring-amber-300'
            : 'bg-emerald-500 text-white shadow-sm shadow-emerald-200/50'
          : 'bg-red-100 text-red-300 cursor-not-allowed'
      }`}
    >
      <span>{slot.label}</span>
      {isClosest && available && (
        <span className="text-[8px] font-bold text-amber-100 leading-none">★</span>
      )}
    </button>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function Slots() {
  const { locationId } = useParams()
  const navigate = useNavigate()
  const location = getLocationById(locationId)
  const { loadOccupiedSlots, subscribeToSlots, seedSlotsIfEmpty } = useParking()

  const hasFloors = Boolean(location?.floors?.length)
  const floors = location?.floors ?? []
  const entryFloor = location?.entryFloor ?? floors[0]

  // Tabs: 'closest' + each floor name
  const ALL_TABS = hasFloors ? ['closest', ...floors] : ['slots']
  const [activeTab, setActiveTab] = useState(hasFloors ? 'closest' : 'slots')

  // slotsByFloor: { [floor]: slot[] }
  const [slotsByFloor, setSlotsByFloor] = useState({})
  const [legacySlots, setLegacySlots] = useState([])
  const [loading, setLoading] = useState(true)
  const unsubRef = useRef(null)

  useEffect(() => {
    if (!location) return

    // Cleanup previous listener
    if (unsubRef.current) {
      unsubRef.current()
      unsubRef.current = null
    }

    if (isFirebaseConfigured && hasFloors) {
      // ── Firestore real-time path ──────────────────────────────────────────
      // 1. Seed slots in Firestore if this location hasn't been seeded yet
      //    (same seed for ALL phones — consistent initial state)
      seedSlotsIfEmpty(location.id, floors).then(() => {
        // 2. Subscribe to live updates — fires on every phone when any slot changes
        unsubRef.current = subscribeToSlots(location.id, (firestoreMap) => {
          // firestoreMap: { floor: { slotId: 'occupied' | 'available' } }
          const result = {}
          for (const floor of floors) {
            const floorMap = firestoreMap[floor] ?? {}
            const occupiedSet = new Set(
              Object.entries(floorMap)
                .filter(([, status]) => status === 'occupied')
                .map(([slotId]) => slotId)
            )
            result[floor] = generateFloorSlots(floor, occupiedSet)
          }
          setSlotsByFloor(result)
          setLoading(false)
        })
      })
    } else if (isFirebaseConfigured && !hasFloors) {
      // Legacy single-floor with Firestore
      seedSlotsIfEmpty(location.id, []).then(() => {
        unsubRef.current = subscribeToSlots(location.id, (firestoreMap) => {
          const floorMap = firestoreMap['main'] ?? {}
          const occupiedSet = new Set(
            Object.entries(floorMap)
              .filter(([, status]) => status === 'occupied')
              .map(([slotId]) => slotId)
          )
          setLegacySlots(generateSlots(occupiedSet))
          setLoading(false)
        })
      })
    } else if (hasFloors) {
      // ── Demo/localStorage fallback (floors) ──────────────────────────────
      const result = {}
      for (const floor of floors) {
        const key = `parkfindr_occupied_${location.id}_${floor}`
        let occupied
        const stored = localStorage.getItem(key)
        if (stored) {
          occupied = new Set(JSON.parse(stored))
        } else {
          occupied = seedFloorOccupied(floor)
          localStorage.setItem(key, JSON.stringify([...occupied]))
        }
        result[floor] = generateFloorSlots(floor, occupied)
      }
      setSlotsByFloor(result)
      setLoading(false)
    } else {
      // ── Demo/localStorage fallback (legacy) ──────────────────────────────
      loadOccupiedSlots(location.id).then((occupied) => {
        setLegacySlots(generateSlots(occupied))
        setLoading(false)
      })
    }

    return () => {
      if (unsubRef.current) {
        unsubRef.current()
        unsubRef.current = null
      }
    }
  }, [location?.id])  // eslint-disable-line react-hooks/exhaustive-deps

  // "Closest to entry" = available slots on the entry floor, sorted by row proximity, then other floors sorted by distance
  const closestSlots = useMemo(() => {
    if (!hasFloors || !Object.keys(slotsByFloor).length) return []
    const entryIdx = floors.indexOf(entryFloor)

    // All available slots, decorated with total proximity
    const all = floors.flatMap((floor) => {
      const floorDist = Math.abs(floors.indexOf(floor) - entryIdx)
      return (slotsByFloor[floor] ?? [])
        .filter((s) => s.status === 'available')
        .map((s) => ({ ...s, totalScore: floorDist * 1000 + s.proximityScore }))
    })
    return all.sort((a, b) => a.totalScore - b.totalScore).slice(0, 20)
  }, [slotsByFloor, floors, entryFloor, hasFloors])

  if (!location) {
    return (
      <Layout showNav={false}>
        <div className="p-8 text-center">
          <p className="text-gray-500 text-sm">Location not found</p>
          <Link to="/home" className="text-indigo-500 font-medium mt-4 inline-block text-sm">
            Go Home
          </Link>
        </div>
      </Layout>
    )
  }

  function handleSelectSlot(slot) {
    navigate(`/parking-entry/${location.id}/${encodeURIComponent(slot.id)}`)
  }

  // Compute stats for the stats bar
  const totalAvailable = hasFloors
    ? Object.values(slotsByFloor).reduce((sum, arr) => sum + arr.filter((s) => s.status === 'available').length, 0)
    : legacySlots.filter((s) => s.status === 'available').length

  const totalSlots = hasFloors
    ? Object.values(slotsByFloor).reduce((sum, arr) => sum + arr.length, 0)
    : legacySlots.length

  // Slots to show in grid
  const activeFloorSlots = hasFloors && activeTab !== 'closest' ? slotsByFloor[activeTab] ?? [] : []
  const closestTopSlot = closestSlots[0]

  return (
    <Layout showNav={false}>
      <PageHeader title={location.name} subtitle={location.area} backTo="/home" />

      {/* Stats bar */}
      <div className="mx-4 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex justify-around">
        <div className="text-center">
          <p className="text-2xl font-semibold text-emerald-600">{loading ? '—' : totalAvailable}</p>
          <p className="text-[11px] text-gray-500 font-medium mt-0.5">Available</p>
        </div>
        <div className="w-px bg-gray-100" />
        <div className="text-center">
          <p className="text-2xl font-semibold text-red-500">{loading ? '—' : totalSlots - totalAvailable}</p>
          <p className="text-[11px] text-gray-500 font-medium mt-0.5">Occupied</p>
        </div>
        <div className="w-px bg-gray-100" />
        <div className="text-center">
          <p className="text-2xl font-semibold text-gray-900">{loading ? '—' : totalSlots}</p>
          <p className="text-[11px] text-gray-500 font-medium mt-0.5">Total</p>
        </div>
      </div>

      {hasFloors && !loading && (
        <div className="px-4 mt-4">
          {/* Floor tab row */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {/* Closest to Entry special tab */}
            <button
              type="button"
              onClick={() => setActiveTab('closest')}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-[12px] font-semibold transition-all duration-200 ${
                activeTab === 'closest'
                  ? 'bg-amber-400 text-white shadow-md shadow-amber-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}
            >
              <span>⚡</span>
              <span>Closest to Entry</span>
            </button>

            {/* Floor tabs */}
            {floors.map((floor) => {
              const floorSlots = slotsByFloor[floor] ?? []
              const avail = floorSlots.filter((s) => s.status === 'available').length
              return (
                <FloorTab
                  key={floor}
                  label={floor}
                  isActive={activeTab === floor}
                  availableCount={avail}
                  isEntry={floor === entryFloor}
                  onClick={() => setActiveTab(floor)}
                />
              )
            })}
          </div>
        </div>
      )}

      <div className="px-4 py-4">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-indigo-200 border-t-indigo-500 rounded-full animate-spin" />
          </div>
        ) : activeTab === 'closest' && hasFloors ? (
          /* ── Closest to Entry view ── */
          <>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[13px] font-medium text-gray-600">
                ⚡ Best spots — least walking from entry
              </span>
            </div>
            {closestSlots.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-sm">No available slots right now</p>
              </div>
            ) : (
              <div className="space-y-3">
                {closestSlots.map((slot, idx) => {
                  const floorDist = getFloorDistance(slot.floor, entryFloor, floors)
                  const isTop = idx === 0
                  return (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => handleSelectSlot(slot)}
                      className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl border transition-all active:scale-[0.98] ${
                        isTop
                          ? 'bg-amber-50 border-amber-200 shadow-sm shadow-amber-100'
                          : 'bg-white border-gray-100'
                      }`}
                    >
                      {/* Rank */}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold flex-shrink-0 ${
                          isTop ? 'bg-amber-400 text-white' : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {isTop ? '★' : idx + 1}
                      </div>
                      {/* Info */}
                      <div className="flex-1 text-left">
                        <p className="text-[14px] font-semibold text-gray-900">
                          {slot.label}
                          {isTop && (
                            <span className="ml-2 text-[10px] font-bold text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded-full">
                              BEST
                            </span>
                          )}
                        </p>
                        <p className="text-[12px] text-gray-400 mt-0.5">
                          Floor {slot.floor}
                          {floorDist === 0 ? ' · Same as entry 🚗' : ` · ${floorDist} floor${floorDist > 1 ? 's' : ''} from entry`}
                        </p>
                      </div>
                      {/* Arrow */}
                      <svg className="w-4 h-4 text-gray-300 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </button>
                  )
                })}
              </div>
            )}
          </>
        ) : (
          /* ── Floor grid view ── */
          <>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[13px] font-medium text-gray-600">
                {hasFloors ? `Floor ${activeTab} — Select a slot` : 'Select a slot'}
              </p>
              {hasFloors && activeTab === entryFloor && (
                <span className="text-[11px] font-medium text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">
                  Entry floor
                </span>
              )}
            </div>
            <div className="grid grid-cols-5 gap-2">
              {(hasFloors ? activeFloorSlots : legacySlots).map((slot) => (
                <SlotButton
                  key={slot.id}
                  slot={slot}
                  isClosest={closestTopSlot?.id === slot.id}
                  onClick={handleSelectSlot}
                />
              ))}
            </div>

            {/* Legend */}
            <div className="flex gap-4 justify-center mt-5 text-[11px] font-medium text-gray-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-emerald-500" /> Available
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-amber-400" /> Best spot
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-red-100 border border-red-200" /> Occupied
              </span>
            </div>
          </>
        )}
      </div>
    </Layout>
  )
}
