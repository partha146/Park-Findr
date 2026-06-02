import Layout from '../components/Layout'
import { useParking } from '../context/ParkingContext'
import { formatCurrency } from '../utils/pricing'

export default function Bookings() {
  const { bookings } = useParking()

  return (
    <Layout>
      <header className="page-header">
        <h1 className="page-title">My Bookings</h1>
        <p className="text-[13px] text-gray-500 mt-0.5">Past parking sessions</p>
      </header>

      <div className="px-4 space-y-3 pb-4">
        {bookings.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-3xl mb-3 opacity-60">🅿️</p>
            <p className="text-gray-600 font-medium text-sm">No bookings yet</p>
            <p className="text-gray-400 text-[13px] mt-1">Your parking history will appear here</p>
          </div>
        ) : (
          bookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm shadow-gray-100/50">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900 text-[15px]">{booking.locationName}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{booking.locationArea}</p>
                </div>
                <span className="text-sm font-semibold text-indigo-600">
                  {formatCurrency(booking.paidAmount ?? booking.totalAmount ?? 0)}
                </span>
              </div>
              <div className="flex gap-4 mt-3 text-xs text-gray-600">
                <span className="font-medium bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                  Slot {booking.slotId}
                </span>
                <span>{booking.vehicleNumber}</span>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                {new Date(booking.entryTime).toLocaleDateString('en-IN')} ·{' '}
                {booking.paymentMethod ? `Paid via ${booking.paymentMethod.toUpperCase()}` : 'Completed'}
              </p>
            </div>
          ))
        )}
      </div>
    </Layout>
  )
}
