import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import PageHeader from '../components/PageHeader'
import { useParking } from '../context/ParkingContext'
import { applyCoupon, formatCurrency, formatDuration } from '../utils/pricing'

export default function BillingSummary() {
  const { pendingBilling, setPendingBilling } = useParking()
  const navigate = useNavigate()
  const [coupon, setCoupon] = useState(pendingBilling?.couponCode || '')

  if (!pendingBilling) {
    navigate('/home')
    return null
  }

  const entry = new Date(pendingBilling.entryTime)
  const exit = new Date(pendingBilling.exitTime)
  const durationMs = exit - entry
  const { discount, finalTotal } = applyCoupon(pendingBilling.totalAmount, coupon)

  function handleProceed() {
    const applied = applyCoupon(pendingBilling.totalAmount, coupon)
    setPendingBilling({
      ...pendingBilling,
      couponCode: coupon || null,
      discount: applied.discount,
      finalTotal: applied.finalTotal,
    })
    navigate('/payment')
  }

  return (
    <Layout showNav={false}>
      <PageHeader title="Billing summary" subtitle="Receipt" />

      <div className="mx-4 bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="text-center border-b border-dashed border-gray-200 pb-4 mb-4">
          <p className="font-semibold text-gray-900 text-lg">ParkFindr</p>
          <p className="text-xs text-gray-400">Bengaluru, India</p>
        </div>

        {[
          { label: 'Location', value: pendingBilling.locationName },
          { label: 'Slot', value: pendingBilling.slotId },
          { label: 'Vehicle', value: pendingBilling.vehicleNumber },
          { label: 'Entry', value: entry.toLocaleString('en-IN') },
          { label: 'Exit', value: exit.toLocaleString('en-IN') },
          { label: 'Duration', value: formatDuration(durationMs) },
          { label: 'Rate', value: `${formatCurrency(pendingBilling.hourlyRate)}/hr` },
        ].map((row) => (
          <div key={row.label} className="flex justify-between py-2 text-[14px] border-b border-gray-50">
            <span className="text-gray-500">{row.label}</span>
            <span className="font-medium text-gray-900">{row.value}</span>
          </div>
        ))}

        <div className="mt-4">
          <label className="text-[13px] font-medium text-gray-600">Coupon code</label>
          <input
            value={coupon}
            onChange={(e) => setCoupon(e.target.value.toUpperCase())}
            placeholder="PARK30, AIRPORT50"
            className="input-field mt-1.5 text-sm"
          />
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
          <div className="flex justify-between text-[14px]">
            <span className="text-gray-500">Subtotal</span>
            <span className="font-medium">{formatCurrency(pendingBilling.totalAmount)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-[14px] text-emerald-600">
              <span>Discount</span>
              <span className="font-medium">-{formatCurrency(discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-lg pt-1">
            <span className="font-semibold text-gray-900">Total</span>
            <span className="font-semibold text-indigo-600">{formatCurrency(finalTotal)}</span>
          </div>
        </div>
      </div>

      <div className="px-4 mt-6">
        <button type="button" onClick={handleProceed} className="btn-primary py-4">
          Proceed to payment
        </button>
      </div>
    </Layout>
  )
}
