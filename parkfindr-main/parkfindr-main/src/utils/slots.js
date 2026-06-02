const SLOT_LETTERS = ['A', 'B', 'C', 'D', 'E']
const SLOTS_PER_ROW = 10

// Generate slots for a single floor: A1-A10, B1-B10 etc.
export function generateFloorSlots(floor, occupiedSet = new Set()) {
  const slots = []
  for (const letter of SLOT_LETTERS) {
    for (let n = 1; n <= SLOTS_PER_ROW; n++) {
      const id = `${floor}-${letter}${n}`
      // Row A slots (A1–A5) are closest to the stairwell/entry ramp
      const proximityScore = SLOT_LETTERS.indexOf(letter) * SLOTS_PER_ROW + (n - 1)
      slots.push({
        id,
        label: `${letter}${n}`,
        floor,
        status: occupiedSet.has(id) ? 'occupied' : 'available',
        proximityScore,
      })
    }
  }
  return slots
}

// Seed random occupied slots for a given floor in demo mode
export function seedFloorOccupied(floor, count = null) {
  const occupied = new Set()
  const total = SLOT_LETTERS.length * SLOTS_PER_ROW
  const num = count ?? Math.floor(Math.random() * 20) + 5
  while (occupied.size < Math.min(num, total)) {
    const letter = SLOT_LETTERS[Math.floor(Math.random() * SLOT_LETTERS.length)]
    const n = Math.floor(Math.random() * SLOTS_PER_ROW) + 1
    occupied.add(`${floor}-${letter}${n}`)
  }
  return occupied
}

// Legacy: flat 20-slot grid for non-floor locations (A1–A20)
const LEGACY_SLOT_IDS = Array.from({ length: 20 }, (_, i) => `A${i + 1}`)

export function generateSlots(occupiedSet = new Set()) {
  return LEGACY_SLOT_IDS.map((id) => ({
    id,
    label: id,
    floor: null,
    status: occupiedSet.has(id) ? 'occupied' : 'available',
    proximityScore: parseInt(id.slice(1)) - 1,
  }))
}

// Get floor distance from entry (used for "Closest to Entry" sorting)
export function getFloorDistance(floor, entryFloor, floors) {
  const entryIdx = floors.indexOf(entryFloor)
  const floorIdx = floors.indexOf(floor)
  return Math.abs(floorIdx - entryIdx)
}

export { LEGACY_SLOT_IDS as SLOT_IDS }
