import { useState } from 'react'
import Layout from '../components/Layout'
import PageHeader from '../components/PageHeader'
import { getLocationById } from '../data/locations'
import { useAuth } from '../context/AuthContext'
import { useParking } from '../context/ParkingContext'
import { formatCurrency, getHourlyRate } from '../utils/pricing'
import { useNavigate, useParams } from 'react-router-dom'

export default function ParkingEntry() {
  const { locationId, slotId } = useParams()
  const navigate = useNavigate()
  const location = getLocationById(locationId)
  const { profile } = useAuth()
  const { startParking, activeSession } = useParking()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const entryTime = new Date().toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })

  const hourlyRate = location ? getHourlyRate(profile?.vehicleType || 'Car', location.category) : 0

  // Parse floor from slot ID (e.g. "B2-A3" → floor "B2", label "A3")
  const slotParts = slotId?.includes('-') ? slotId.split('-') : null
  const slotFloor = slotParts ? slotParts[0] : null
  const slotLabel = slotParts ? slotParts[1] : slotId

  async function handleStart() {
    if (activeSession) {
      setError('You already have an active parking session')
      return
    }
    setLoading(true)
    setError('')
    try {
      await startParking({
        location,
        slotId,
        vehicleNumber: profile.vehicleNumber,
      })
      navigate('/active-parking')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!location) {
    return (
      <Layout showNav={false}>
        <p className="p-8 text-center text-gray-500 text-sm">Invalid location</p>
      </Layout>
    )
  }

  return (
    <Layout showNav={false}>
      <PageHeader title="Parking Entry" backTo={`/slots/${locationId}`} />

      <div className="px-4 py-6 space-y-3">
        {error && (
          <p className="text-[13px] text-red-600 bg-red-50 border border-red-100 p-3 rounded-lg">{error}</p>
        )}

        {[
          { label: 'Vehicle number', value: profile?.vehicleNumber },
          { label: 'Location', value: location.name },
          { label: 'Area', value: location.area },
          { label: 'Slot', value: slotLabel },
          ...(slotFloor ? [{ label: 'Floor', value: slotFloor }] : []),
          { label: 'Entry time', value: entryTime },
          { label: 'Rate', value: `${formatCurrency(hourlyRate)}/hour` },
        ].map((row) => (
          <div key={row.label} className="bg-white rounded-xl p-4 border border-gray-100">
            <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">{row.label}</p>
            <p className="text-[15px] font-medium text-gray-900 mt-1">{row.value}</p>
          </div>
        ))}

        <button
          type="button"
          onClick={handleStart}
          disabled={loading}
          className="btn-primary mt-4 py-4"
        >
          {loading ? 'Starting…' : 'Start parking'}
        </button>
      </div>
    </Layout>
  )
}
