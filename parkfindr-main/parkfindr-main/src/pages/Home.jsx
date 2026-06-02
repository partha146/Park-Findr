import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import OfferCarousel from '../components/OfferCarousel'
import SectionScroll from '../components/SectionScroll'
import { CATEGORIES, getLocationsByCategory } from '../data/locations'
import { useAuth } from '../context/AuthContext'
import { useParking } from '../context/ParkingContext'
import { formatCurrency } from '../utils/pricing'

const STATS = [
  {
    label: 'Total Visits',
    key: 'totalVisits',
    border: 'border-l-indigo-400',
    iconBg: 'bg-indigo-50',
    iconColor: 'text-indigo-500',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
    ),
  },
  {
    label: 'Hours Parked',
    key: 'hoursParked',
    border: 'border-l-sky-400',
    iconBg: 'bg-sky-50',
    iconColor: 'text-sky-500',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    ),
  },
  {
    label: 'Amount Spent',
    key: 'amountSpent',
    border: 'border-l-violet-400',
    iconBg: 'bg-violet-50',
    iconColor: 'text-violet-500',
    isCurrency: true,
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 8c-2.5 0-4 1.5-4 3.5S9.5 15 12 15s4-1.5 4-3.5S14.5 8 12 8zm0 0V5m0 10v4M5 12H3m18 0h-2" />
    ),
  },
]

export default function Home() {
  const { profile } = useAuth()
  const { activeSession } = useParking()
  const firstName = profile?.fullName?.split(' ')[0] || 'there'

  return (
    <Layout>
      <header className="bg-gradient-to-br from-indigo-50 via-sky-50/80 to-white px-5 pt-6 pb-5 border-b border-indigo-100/40">
        <p className="text-[13px] text-indigo-600/80 font-medium">Good day,</p>
        <h1 className="text-[22px] font-semibold text-gray-900 tracking-tight mt-0.5">{firstName}</h1>
        <div className="flex items-center gap-1 mt-1.5 text-gray-500 text-[13px]">
          <svg className="w-3.5 h-3.5 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
              clipRule="evenodd"
            />
          </svg>
          Bengaluru, Karnataka
        </div>

        <Link
          to="/search"
          className="flex items-center gap-3 mt-4 bg-white/80 backdrop-blur-sm border border-white shadow-sm shadow-indigo-100/30 rounded-xl px-4 py-3 text-gray-400 text-[14px] hover:border-indigo-100 transition-colors"
        >
          <svg className="w-[18px] h-[18px] shrink-0 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Search parking near you
        </Link>
      </header>

      {activeSession && (
        <Link
          to="/active"
          className="mx-4 mt-3 mb-1 flex items-center gap-3 bg-white border border-indigo-100 rounded-xl px-4 py-3 text-[13px] text-indigo-700 font-medium shadow-sm shadow-indigo-50"
        >
          <span className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-base">🅿️</span>
          <span className="flex-1">
            Active at {activeSession.locationName}
            <span className="block text-[12px] text-indigo-500/90 font-normal">Slot {activeSession.slotId}</span>
          </span>
          <span className="text-indigo-300">›</span>
        </Link>
      )}

      <div className="grid grid-cols-3 gap-2.5 px-4 mt-4 mb-5">
        {STATS.map((stat) => {
          const raw = profile?.[stat.key] ?? 0
          const value = stat.isCurrency ? formatCurrency(raw) : raw
          return (
            <div
              key={stat.label}
              className={`bg-white rounded-xl p-3 border border-gray-100 border-l-[3px] ${stat.border} shadow-sm shadow-gray-100/40`}
            >
              <div className={`w-7 h-7 rounded-lg ${stat.iconBg} flex items-center justify-center mb-2`}>
                <svg className={`w-3.5 h-3.5 ${stat.iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {stat.icon}
                </svg>
              </div>
              <p className="text-sm font-semibold text-gray-900 leading-tight">{value}</p>
              <p className="text-[10px] text-gray-500 font-medium mt-0.5 leading-tight">{stat.label}</p>
            </div>
          )
        })}
      </div>

      <div className="px-4 mb-5">
        <OfferCarousel />
      </div>

      {CATEGORIES.map((cat) => (
        <SectionScroll
          key={cat.id}
          title={cat.label}
          categoryId={cat.id}
          locations={getLocationsByCategory(cat.id)}
        />
      ))}
    </Layout>
  )
}
