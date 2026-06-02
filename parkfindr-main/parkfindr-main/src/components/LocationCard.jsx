import { Link } from 'react-router-dom'
import { getSlotBadgeColor } from '../data/locations'
import { getHourlyRate, formatCurrency } from '../utils/pricing'
import { useAuth } from '../context/AuthContext'
import { CategoryIcon, CATEGORY_CARD_STYLES, CATEGORY_ICONS } from './Icons'

const badgeStyles = {
  green: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
  yellow: 'bg-amber-50 text-amber-700 border border-amber-100',
  red: 'bg-red-50 text-red-600 border border-red-100',
}

export default function LocationCard({ location, compact = false }) {
  const { profile } = useAuth()
  const badge = getSlotBadgeColor(location.slots, location.totalSlots)
  const rate = getHourlyRate(profile?.vehicleType || 'Car', location.category)
  const cardStyle = CATEGORY_CARD_STYLES[location.category] || CATEGORY_CARD_STYLES.malls
  const iconType = CATEGORY_ICONS[location.category]

  return (
    <Link
      to={`/slots/${location.id}`}
      className={`block shrink-0 rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:border-gray-200 transition-all ${compact ? 'w-44' : 'w-52'}`}
    >
      <div
        className={`relative h-[88px] flex items-center justify-center overflow-hidden ${cardStyle.gradient}`}
      >
        <div
          className={`w-14 h-14 rounded-2xl bg-white/70 backdrop-blur-sm flex items-center justify-center ring-2 ${cardStyle.ring}`}
        >
          <CategoryIcon type={iconType} className={`w-8 h-8 ${cardStyle.icon}`} />
        </div>
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-sm text-gray-900 leading-tight line-clamp-2">{location.name}</h3>
        <p className="text-xs text-gray-500 mt-0.5">{location.area}</p>
        <div className="flex items-center justify-between mt-2 gap-1">
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${badgeStyles[badge]}`}>
            {location.slots} slots
          </span>
          <span className="text-xs font-medium text-gray-700">{formatCurrency(rate)}/hr</span>
        </div>
      </div>
    </Link>
  )
}
