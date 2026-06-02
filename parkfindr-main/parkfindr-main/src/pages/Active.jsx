import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import { useParking } from '../context/ParkingContext'
import { calculateCost, formatCurrency } from '../utils/pricing'

export default function Active() {
  const { activeSession } = useParking()

  return (
    <Layout>
      <header className="page-header bg-gradient-to-br from-indigo-50/80 via-sky-50/50 to-white border-b border-indigo-100/50">
        <h1 className="page-title">Active parking</h1>
        <p className="text-[13px] text-gray-500 mt-0.5">Your current session</p>
      </header>

      <div className="px-5 py-6">
        {activeSession ? (
          <div className="bg-white rounded-2xl border border-indigo-100 shadow-sm shadow-indigo-100/30 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500/10 to-sky-500/10 px-5 py-4 border-b border-indigo-50">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[12px] font-medium text-emerald-700 uppercase tracking-wide">Live</span>
              </div>
              <h2 className="text-lg font-semibold text-gray-900 mt-2">{activeSession.locationName}</h2>
              <p className="text-[13px] text-gray-500">{activeSession.locationArea}</p>
            </div>

            <div className="px-5 py-4 space-y-3">
              <div className="flex justify-between text-[14px]">
                <span className="text-gray-500">Slot</span>
                <span className="font-semibold text-indigo-600">{activeSession.slotId}</span>
              </div>
              <div className="flex justify-between text-[14px]">
                <span className="text-gray-500">Vehicle</span>
                <span className="font-medium text-gray-900">{activeSession.vehicleNumber}</span>
              </div>
              <div className="flex justify-between text-[14px]">
                <span className="text-gray-500">Rate</span>
                <span className="font-medium text-gray-900">{formatCurrency(activeSession.hourlyRate)}/hr</span>
              </div>
              <div className="flex justify-between text-[14px]">
                <span className="text-gray-500">Est. so far</span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(
                    calculateCost(activeSession.entryTime, new Date().toISOString(), activeSession.hourlyRate)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-[14px]">
                <span className="text-gray-500">Started</span>
                <span className="font-medium text-gray-900 text-right text-[13px]">
                  {new Date(activeSession.entryTime).toLocaleString('en-IN', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </span>
              </div>
            </div>

            <div className="px-5 pb-5">
              <Link
                to="/active-parking"
                className="btn-primary py-3.5 block text-center"
              >
                Open live timer
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 px-4">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4 text-2xl opacity-70">
              🅿️
            </div>
            <h2 className="text-[17px] font-semibold text-gray-900">No active parking</h2>
            <p className="text-[14px] text-gray-500 mt-2 leading-relaxed max-w-[260px] mx-auto">
              When you start a session, it will show up here with live details.
            </p>
            <Link to="/search" className="btn-primary inline-block mt-6 px-8 py-3 w-auto">
              Find parking
            </Link>
          </div>
        )}
      </div>
    </Layout>
  )
}
