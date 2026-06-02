import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import { OFFERS } from '../data/locations'
import { useParking } from '../context/ParkingContext'

const TIPS = [
  { title: 'Book early at malls', text: 'Weekend slots at Phoenix Marketcity fill up by 11 AM.' },
  { title: 'Airport parking', text: 'Use code AIRPORT50 for flat ₹50 off on weekend airport parking.' },
  { title: 'UPI cashback', text: 'Pay via UPI to get ₹20 cashback on your next session.' },
  { title: 'First booking', text: 'New users get 30% off with code PARK30 on first booking.' },
]

export default function Board() {
  const { activeSession } = useParking()

  return (
    <Layout>
      <header className="page-header">
        <h1 className="page-title">Board</h1>
        <p className="text-[13px] text-gray-500 mt-0.5">Offers, tips & updates</p>
      </header>

      {activeSession && (
        <div className="mx-4 mb-4">
          <Link
            to="/active-parking"
            className="block bg-primary-soft border border-indigo-100 text-indigo-700 rounded-xl p-4 text-[14px] font-medium text-center"
          >
            Active: {activeSession.locationName} · Slot {activeSession.slotId}
          </Link>
        </div>
      )}

      <section className="px-4 mb-6">
        <h2 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Active offers</h2>
        <div className="space-y-3">
          {OFFERS.map((offer) => (
            <div key={offer.id} className={`rounded-2xl border p-4 bg-gradient-to-br ${offer.gradient}`}>
              <p className="text-[14px] font-bold text-gray-800">{offer.title}</p>
              <p className="text-[12px] text-gray-600 mt-1">{offer.subtitle}</p>
              {offer.code && (
                <span className={`inline-block mt-2 text-[11px] font-medium px-2.5 py-1 rounded-md border ${offer.chipClass}`}>
                  {offer.code}
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 pb-4">
        <h2 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Parking tips</h2>
        <div className="space-y-3">
          {TIPS.map((tip) => (
            <div key={tip.title} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm shadow-gray-100/50">
              <h3 className="font-semibold text-gray-900 text-[14px]">{tip.title}</h3>
              <p className="text-[13px] text-gray-500 mt-1 leading-relaxed">{tip.text}</p>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  )
}
