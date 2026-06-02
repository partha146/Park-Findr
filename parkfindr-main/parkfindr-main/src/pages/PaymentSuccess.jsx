import { Link, useLocation } from 'react-router-dom'
import Layout from '../components/Layout'
import { formatCurrency } from '../utils/pricing'

export default function PaymentSuccess() {
  const { state } = useLocation()
  const session = state?.session
  const amount = state?.amount
  const message = state?.message

  return (
    <Layout showNav={false}>
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-[#fafafa]">
        <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-6">
          <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-xl font-semibold text-gray-900">Payment successful</h1>
        {message && <p className="text-[13px] text-gray-600 mt-2 px-2">{message}</p>}
        {state?.demo && <p className="text-xs text-gray-400 mt-1">Demo mode (Razorpay key not set)</p>}
        <p className="text-3xl font-semibold text-gray-900 mt-4">{formatCurrency(amount || session?.paidAmount || 0)}</p>

        {session && (
          <div className="mt-6 bg-white rounded-2xl border border-gray-100 p-5 w-full max-w-sm text-left space-y-2.5 shadow-sm">
            <div className="flex justify-between text-[14px]">
              <span className="text-gray-500">Location</span>
              <span className="font-medium text-gray-900">{session.locationName}</span>
            </div>
            <div className="flex justify-between text-[14px]">
              <span className="text-gray-500">Slot</span>
              <span className="font-medium text-gray-900">{session.slotId}</span>
            </div>
            <div className="flex justify-between text-[14px]">
              <span className="text-gray-500">Vehicle</span>
              <span className="font-medium text-gray-900">{session.vehicleNumber}</span>
            </div>
          </div>
        )}

        <Link to="/bookings" className="btn-primary py-3.5 mt-8 max-w-sm block">
          View bookings
        </Link>
        <Link to="/home" className="mt-3 text-indigo-500 font-medium text-[13px]">
          Back to home
        </Link>
      </div>
    </Layout>
  )
}
