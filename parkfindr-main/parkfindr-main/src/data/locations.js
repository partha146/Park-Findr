export const CATEGORIES = [
  { id: 'malls', label: 'Popular Malls', icon: 'mall' },
  { id: 'hospitals', label: 'Nearby Hospitals', icon: 'hospital' },
  { id: 'hotels', label: 'Nearby Hotels', icon: 'hotel' },
  { id: 'restaurants', label: 'Top Restaurants', icon: 'restaurant' },
  { id: 'public', label: 'Public Parking', icon: 'parking' },
  { id: 'airport', label: 'Airport', icon: 'airport' },
]

export const LOCATIONS = [
  // Popular Malls — ₹30/hr
  {
    id: 'orion-mall', name: 'Orion Mall', area: 'Rajajinagar', category: 'malls', slots: 42, totalSlots: 65,
    floors: ['B2', 'B1', 'G', 'L1', 'L2'],
    entryFloor: 'G',
  },
  {
    id: 'phoenix-mc', name: 'Phoenix Marketcity', area: 'Whitefield', category: 'malls', slots: 18, totalSlots: 95,
    floors: ['B3', 'B2', 'B1', 'G'],
    entryFloor: 'B1',
  },
  {
    id: 'forum-mall', name: 'Forum Mall', area: 'Koramangala', category: 'malls', slots: 31, totalSlots: 55,
    floors: ['B1', 'G', 'L1'],
    entryFloor: 'B1',
  },
  {
    id: 'garuda-mall', name: 'Garuda Mall', area: 'Magrath Road', category: 'malls', slots: 11, totalSlots: 42,
    floors: ['B2', 'B1'],
    entryFloor: 'B1',
  },
  {
    id: 'ub-city', name: 'UB City', area: 'Vittal Mallya Road', category: 'malls', slots: 14, totalSlots: 38,
    floors: ['B1', 'G'],
    entryFloor: 'B1',
  },
  {
    id: 'mantri-square', name: 'Mantri Square', area: 'Malleshwaram', category: 'malls', slots: 55, totalSlots: 80,
    floors: ['B3', 'B2', 'B1', 'G', 'L1'],
    entryFloor: 'B1',
  },
  {
    id: 'elements-mall', name: 'Elements Mall', area: 'Nagawara', category: 'malls', slots: 28, totalSlots: 70,
    floors: ['B2', 'B1', 'G'],
    entryFloor: 'G',
  },
  {
    id: 'gt-world-mall', name: 'GT World Mall', area: 'Bannerghatta Road', category: 'malls', slots: 22, totalSlots: 58,
    floors: ['B1', 'G', 'L1'],
    entryFloor: 'B1',
  },

  // Nearby Hospitals — ₹20/hr
  { id: 'manipal-hosp', name: 'Manipal Hospital', area: 'Old Airport Road', category: 'hospitals', slots: 24, totalSlots: 45 },
  { id: 'fortis-hosp', name: 'Fortis Hospital', area: 'Bannerghatta Road', category: 'hospitals', slots: 8, totalSlots: 32 },
  { id: 'apollo-hosp', name: 'Apollo Hospital', area: 'Jayanagar', category: 'hospitals', slots: 19, totalSlots: 38 },
  { id: 'narayana-hosp', name: 'Narayana Health', area: 'Bommasandra', category: 'hospitals', slots: 35, totalSlots: 52 },
  { id: 'columbia-asia', name: 'Columbia Asia', area: 'Hebbal', category: 'hospitals', slots: 16, totalSlots: 30 },
  { id: 'sakra-hosp', name: 'Sakra World Hospital', area: 'Marathahalli', category: 'hospitals', slots: 21, totalSlots: 40 },
  { id: 'st-johns', name: "St John's Hospital", area: 'Koramangala', category: 'hospitals', slots: 12, totalSlots: 28 },
  { id: 'cloudnine', name: 'Cloudnine Hospital', area: 'Jayanagar', category: 'hospitals', slots: 9, totalSlots: 22 },

  // Nearby Hotels — ₹30/hr
  { id: 'taj-west', name: 'Taj West End', area: 'Race Course Road', category: 'hotels', slots: 12, totalSlots: 28 },
  { id: 'oberoi', name: 'The Oberoi', area: 'MG Road', category: 'hotels', slots: 8, totalSlots: 22 },
  { id: 'itc-gardenia', name: 'ITC Gardenia', area: 'Residency Road', category: 'hotels', slots: 15, totalSlots: 32 },
  { id: 'marriott-wf', name: 'Marriott', area: 'Whitefield', category: 'hotels', slots: 20, totalSlots: 45 },
  { id: 'leela-palace', name: 'Leela Palace', area: 'HAL Airport Road', category: 'hotels', slots: 18, totalSlots: 40 },
  { id: 'sheraton-grand', name: 'Sheraton Grand', area: 'Brigade Road', category: 'hotels', slots: 11, totalSlots: 26 },
  { id: 'radisson-blu', name: 'Radisson Blu', area: 'Outer Ring Road', category: 'hotels', slots: 24, totalSlots: 50 },

  // Top Restaurants — ₹20/hr
  { id: 'empire-rest', name: 'Empire Restaurant', area: 'Koramangala', category: 'restaurants', slots: 14, totalSlots: 22 },
  { id: 'meghana-foods', name: 'Meghana Foods', area: 'Koramangala', category: 'restaurants', slots: 5, totalSlots: 14 },
  { id: 'church-street', name: 'Church Street Social', area: 'MG Road', category: 'restaurants', slots: 9, totalSlots: 18 },
  { id: 'truffles', name: 'Truffles', area: 'Brigade Road', category: 'restaurants', slots: 7, totalSlots: 16 },
  { id: 'toit', name: 'Toit Brewpub', area: 'Indiranagar', category: 'restaurants', slots: 6, totalSlots: 15 },
  { id: 'brahmins-coffee', name: "Brahmin's Coffee Bar", area: 'Basavanagudi', category: 'restaurants', slots: 4, totalSlots: 10 },
  { id: 'mtr', name: 'MTR', area: 'Lalbagh Road', category: 'restaurants', slots: 8, totalSlots: 14 },
  { id: 'koshys', name: "Koshy's", area: 'St Marks Road', category: 'restaurants', slots: 6, totalSlots: 12 },
  { id: 'byg-brewski', name: 'Byg Brewski', area: 'Hennur Road', category: 'restaurants', slots: 18, totalSlots: 28 },
  { id: 'black-rabbit', name: 'The Black Rabbit', area: 'Indiranagar', category: 'restaurants', slots: 10, totalSlots: 20 },

  // Public Parking — ₹15/hr
  { id: 'mg-road-park', name: 'MG Road Parking', area: 'MG Road', category: 'public', slots: 38, totalSlots: 55 },
  { id: 'cubbon-park', name: 'Cubbon Park Parking', area: 'Cubbon Park', category: 'public', slots: 28, totalSlots: 42 },
  { id: 'lalbagh-park', name: 'Lalbagh Road Parking', area: 'Lalbagh', category: 'public', slots: 22, totalSlots: 38 },
  { id: 'ub-city-park', name: 'UB City Parking', area: 'UB City', category: 'public', slots: 12, totalSlots: 28 },
  { id: 'commercial-st-park', name: 'Commercial Street Parking', area: 'Commercial Street', category: 'public', slots: 15, totalSlots: 30 },
  { id: 'brigade-road-park', name: 'Brigade Road Parking', area: 'Brigade Road', category: 'public', slots: 20, totalSlots: 35 },
  { id: 'indiranagar-park', name: 'Indiranagar 100ft Road Parking', area: 'Indiranagar', category: 'public', slots: 26, totalSlots: 44 },
  { id: 'koramangala-park', name: 'Koramangala Parking', area: 'Koramangala', category: 'public', slots: 32, totalSlots: 48 },

  // Airport — ₹50/hr
  { id: 'kia-t1', name: 'Kempegowda International Airport Terminal 1', area: 'Devanahalli', category: 'airport', slots: 95, totalSlots: 180 },
  { id: 'kia-t2', name: 'Kempegowda International Airport Terminal 2', area: 'Devanahalli', category: 'airport', slots: 110, totalSlots: 200 },
  { id: 'kia-long-stay', name: 'Airport Long Stay Parking', area: 'Devanahalli', category: 'airport', slots: 240, totalSlots: 400 },
  { id: 'kia-short-stay', name: 'Airport Short Stay Parking', area: 'Devanahalli', category: 'airport', slots: 45, totalSlots: 80 },
]

export const OFFERS = [
  {
    id: 1,
    title: '30% off first booking',
    subtitle: 'New to ParkFindr? Save on your first session.',
    code: 'PARK30',
    gradient: 'from-sky-100 via-blue-50 to-indigo-100',
    chipClass: 'bg-white/90 text-sky-800 border-sky-200/80 shadow-sm',
    accent: 'text-sky-700',
  },
  {
    id: 2,
    title: '₹20 UPI cashback',
    subtitle: 'Pay via UPI on your next parking session.',
    code: null,
    gradient: 'from-emerald-100 via-teal-50 to-green-100',
    chipClass: '',
    accent: 'text-emerald-700',
  },
  {
    id: 3,
    title: 'Airport weekend deal',
    subtitle: 'Flat ₹50 off Kempegowda airport parking.',
    code: 'AIRPORT50',
    gradient: 'from-amber-100 via-orange-50 to-rose-50',
    chipClass: 'bg-white/90 text-amber-800 border-amber-200/80 shadow-sm',
    accent: 'text-amber-800',
  },
]

export const CATEGORY_SECTION_STYLES = {
  malls: { bg: 'bg-blue-50/50', border: 'border-blue-100/80', title: 'text-blue-900' },
  hospitals: { bg: 'bg-emerald-50/40', border: 'border-emerald-100/80', title: 'text-emerald-900' },
  hotels: { bg: 'bg-purple-50/40', border: 'border-purple-100/80', title: 'text-purple-900' },
  restaurants: { bg: 'bg-orange-50/40', border: 'border-orange-100/80', title: 'text-orange-900' },
  public: { bg: 'bg-gray-50/60', border: 'border-gray-200/80', title: 'text-gray-800' },
  airport: { bg: 'bg-teal-50/50', border: 'border-teal-100/80', title: 'text-teal-900' },
}

export function getLocationsByCategory(categoryId) {
  return LOCATIONS.filter((l) => l.category === categoryId)
}

export function getLocationById(id) {
  return LOCATIONS.find((l) => l.id === id)
}

export function getSlotBadgeColor(slots, totalSlots) {
  const ratio = slots / totalSlots
  if (ratio > 0.4) return 'green'
  if (ratio > 0.15) return 'yellow'
  return 'red'
}
