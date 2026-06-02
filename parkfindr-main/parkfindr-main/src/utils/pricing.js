const CATEGORY_RATES = {
  malls: 30,
  hospitals: 20,
  hotels: 30,
  restaurants: 20,
  public: 15,
  airport: 50,
}

export function getHourlyRate(vehicleType, category) {
  const base = CATEGORY_RATES[category] ?? 20
  if (vehicleType === 'Bike') return Math.max(10, Math.round(base * 0.5))
  return base
}

export function formatCurrency(amount) {
  return `₹${Math.round(amount).toLocaleString('en-IN')}`
}

export function calculateCost(entryTime, exitTime, hourlyRate) {
  const ms = new Date(exitTime) - new Date(entryTime)
  const hours = Math.max(ms / (1000 * 60 * 60), 0.25)
  const billedHours = Math.ceil(hours * 4) / 4
  return billedHours * hourlyRate
}

export function formatDuration(ms) {
  const totalSeconds = Math.floor(ms / 1000)
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function applyCoupon(total, code) {
  if (!code) return { discount: 0, finalTotal: total }
  const upper = code.toUpperCase()
  if (upper === 'PARK30') return { discount: total * 0.3, finalTotal: total * 0.7 }
  if (upper === 'AIRPORT50') return { discount: Math.min(50, total), finalTotal: Math.max(0, total - 50) }
  return { discount: 0, finalTotal: total }
}
