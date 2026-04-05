import { Link, useLocation } from 'react-router-dom'
import { Music2, CalendarDays, Heart, User } from 'lucide-react'

const NAV_ITEMS = [
  { to: '/events',  label: 'Discover', icon: CalendarDays },
  { to: '/matches', label: 'Matches',  icon: Heart },
  { to: '/profile', label: 'Profile',  icon: User },
]

export default function Navbar() {
  const { pathname } = useLocation()

  return (
    <>
      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-gray-950/90 backdrop-blur border-b border-gray-800">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/events" className="flex items-center gap-2 text-brand-400 font-bold text-lg">
            <Music2 size={22} />
            ConcertBuddy
          </Link>
          <Link to="/admin/reports" className="text-xs text-gray-500 hover:text-gray-300 transition">
            Admin
          </Link>
        </div>
      </header>

      {/* Bottom nav (mobile-first) */}
      <nav className="fixed bottom-0 inset-x-0 z-50 bg-gray-950/95 backdrop-blur border-t border-gray-800">
        <div className="max-w-2xl mx-auto flex">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
            const active = pathname.startsWith(to)
            return (
              <Link
                key={to}
                to={to}
                className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 text-xs transition ${
                  active ? 'text-brand-400' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                <Icon size={20} />
                {label}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Bottom nav spacer */}
      <div className="h-16" />
    </>
  )
}
