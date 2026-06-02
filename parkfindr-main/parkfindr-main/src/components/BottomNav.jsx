import { NavLink } from 'react-router-dom'
import { NavIcon } from './Icons'
import { useParking } from '../context/ParkingContext'

const tabs = [
  { to: '/home', label: 'Home', icon: 'home' },
  { to: '/search', label: 'Search', icon: 'search' },
  { to: '/active', label: 'Active', icon: 'active' },
  { to: '/bookings', label: 'Bookings', icon: 'bookings' },
  { to: '/profile', label: 'Profile', icon: 'profile' },
]

export default function BottomNav() {
  const { activeSession } = useParking()

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2.75rem)] max-w-[380px] pointer-events-none">
      <div className="pointer-events-auto bg-white rounded-[999px] shadow-[0_8px_32px_rgba(15,23,42,0.12)] border border-gray-100/90 px-2 py-2">
        <div className="flex justify-between items-center">
          {tabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
                `relative flex flex-col items-center justify-center gap-0.5 min-w-[52px] py-2 px-1.5 rounded-[999px] transition-all duration-200 ${
                  isActive ? 'bg-indigo-50' : ''
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className="relative">
                    <NavIcon
                      name={tab.icon}
                      className={`w-[21px] h-[21px] transition-colors ${
                        isActive ? 'text-indigo-500' : 'text-gray-400'
                      }`}
                    />
                    {tab.icon === 'active' && activeSession && !isActive && (
                      <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white" />
                    )}
                  </span>
                  <span
                    className={`text-[9px] font-medium transition-colors leading-none ${
                      isActive ? 'text-indigo-600' : 'text-gray-400'
                    }`}
                  >
                    {tab.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  )
}
