import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { useParking } from '../context/ParkingContext'
import { calculateCost, formatCurrency, formatDuration } from '../utils/pricing'

export default function ActiveParking() {
  const { activeSession, endParking } = useParking()
  const navigate = useNavigate()
  const [elapsed, setElapsed] = useState(0)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    if (!activeSession) {
      navigate('/home')
      return
    }
    const entry = new Date(activeSession.entryTime).getTime()
    const tick = () => setElapsed(Date.now() - entry)
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [activeSession, navigate])

  if (!activeSession) return null

  const liveCost = calculateCost(activeSession.entryTime, new Date().toISOString(), activeSession.hourlyRate)

  async function handleExit() {
    setExiting(true)
    await endParking()
    navigate('/billing')
    setExiting(false)
  }

  return (
    <Layout showNav={false}>
      {/* Header with back button */}
      <div className="flex items-center justify-between px-5 pt-5 pb-2">
        <button
          type="button"
          onClick={() => navigate('/active')}
          className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors"
          aria-label="Back"
        >
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <span className="text-[13px] font-medium text-gray-400">Session active</span>
        <div className="w-9" />
      </div>

      <div className="min-h-[calc(100vh-60px)] flex flex-col items-center justify-center px-6 bg-[#fafafa]">
        <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-widest">Active parking</p>
        <h2 className="text-lg font-semibold text-gray-900 text-center mt-2">{activeSession.locationName}</h2>
        <p className="text-indigo-500 text-[13px] font-medium mt-0.5">Slot {activeSession.slotId}</p>

        <div className="my-10 text-center">
          <p className="text-5xl font-semibold tracking-wider font-mono text-gray-900">{formatDuration(elapsed)}</p>
          <p className="text-gray-400 text-[13px] mt-2">Elapsed time</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-8 py-5 text-center w-full max-w-xs">
          <p className="text-gray-400 text-[11px] font-medium uppercase tracking-wide">Live estimate</p>
          <p className="text-3xl font-semibold text-indigo-600 mt-1">{formatCurrency(liveCost)}</p>
          <p className="text-gray-400 text-[12px] mt-1">@ {formatCurrency(activeSession.hourlyRate)}/hr</p>
        </div>

        <button
          type="button"
          onClick={handleExit}
          disabled={exiting}
          className="mt-10 w-full max-w-xs py-3.5 rounded-lg bg-white border border-red-200 text-red-600 font-medium text-[15px] hover:bg-red-50 transition-colors disabled:opacity-60"
        >
          {exiting ? 'Processing…' : 'Exit parking'}
        </button>
      </div>
    </Layout>
  )
}
