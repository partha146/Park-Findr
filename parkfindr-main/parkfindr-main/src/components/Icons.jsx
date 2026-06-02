const iconClass = 'w-6 h-6'

export function CategoryIcon({ type, className = iconClass }) {
  const props = { className, fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', strokeWidth: 1.5 }

  switch (type) {
    case 'mall':
      return (
        <svg {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6" />
        </svg>
      )
    case 'hospital':
      return (
        <svg {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m-8-8h16M4 21h16a1 1 0 001-1V8L12 3 3 8v12a1 1 0 001 1z" />
        </svg>
      )
    case 'hotel':
      return (
        <svg {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 21V9l9-6 9 6v12M7 21v-4h4v4M13 21v-4h4v4" />
        </svg>
      )
    case 'restaurant':
      return (
        <svg {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 3v8M12 3v8M16 3v8M6 11h12v2a6 6 0 01-6 6 6 6 0 01-6-6v-2zM12 19v2" />
        </svg>
      )
    case 'parking':
      return (
        <svg {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7h4a3 3 0 010 6H9M5 21h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      )
    case 'airport':
      return (
        <svg {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2 12h20M12 2l4 8-4 2-4-2 4-8zM6 20l6-4 6 4" />
        </svg>
      )
    default:
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" />
        </svg>
      )
  }
}

export function NavIcon({ name, className = 'w-6 h-6' }) {
  const props = { className, fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', strokeWidth: 2 }

  const icons = {
    home: <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M5 10v10h14V10" />,
    search: <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />,
    bookings: <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />,
    active: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 17V7h4a3 3 0 010 6H9M12 3v2m0 14v2M5 12H3m18 0h-2"
      />
    ),
    profile: <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />,
  }

  return <svg {...props}>{icons[name]}</svg>
}

/** Gradient + icon styling for location card headers */
export const CATEGORY_CARD_STYLES = {
  malls: {
    gradient: 'bg-gradient-to-br from-blue-100 via-blue-50 to-sky-100',
    icon: 'text-blue-600',
    ring: 'ring-blue-200/60',
  },
  hospitals: {
    gradient: 'bg-gradient-to-br from-emerald-100 via-green-50 to-teal-50',
    icon: 'text-emerald-600',
    ring: 'ring-emerald-200/60',
  },
  hotels: {
    gradient: 'bg-gradient-to-br from-purple-100 via-violet-50 to-fuchsia-50',
    icon: 'text-purple-600',
    ring: 'ring-purple-200/60',
  },
  restaurants: {
    gradient: 'bg-gradient-to-br from-orange-100 via-amber-50 to-orange-50',
    icon: 'text-orange-600',
    ring: 'ring-orange-200/60',
  },
  public: {
    gradient: 'bg-gradient-to-br from-gray-200 via-gray-100 to-slate-100',
    icon: 'text-gray-600',
    ring: 'ring-gray-300/60',
  },
  airport: {
    gradient: 'bg-gradient-to-br from-teal-100 via-cyan-50 to-teal-50',
    icon: 'text-teal-600',
    ring: 'ring-teal-200/60',
  },
}

export const CATEGORY_ICONS = {
  malls: 'mall',
  hospitals: 'hospital',
  hotels: 'hotel',
  restaurants: 'restaurant',
  public: 'parking',
  airport: 'airport',
}
