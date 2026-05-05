import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Music2, MessageCircle, User, Shield, Layers } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

const USER_NAV = [
  { to: '/events',   icon: Music2,        label: 'Discover'   },
  { to: '/stack',    icon: Layers,        label: 'Card Stack' },
  { to: '/messages', icon: MessageCircle, label: 'Messages'   },
  { to: '/profile',  icon: User,          label: 'Profile'    },
]

const ADMIN_NAV = [
  { to: '/admin', icon: Shield, label: 'Admin Panel' },
]

export default function Navbar() {
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const nav = profile?.is_admin ? ADMIN_NAV : USER_NAV

  async function handleSignOut() { await signOut(); navigate('/') }

  return (
    <>
      <header className="sticky top-0 z-50 bg-gray-950/90 backdrop-blur border-b border-gray-800">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to={profile?.is_admin ? '/admin' : '/events'}
            className="flex items-center gap-2 text-brand-400 font-bold text-lg">
            <Music2 size={22} /> ConcertBuddy
          </Link>
          <button onClick={handleSignOut} className="text-xs text-gray-500 hover:text-gray-300 transition">
            Sign Out
          </button>
        </div>
      </header>

      <nav className="fixed bottom-0 inset-x-0 z-50 bg-gray-950/95 backdrop-blur border-t border-gray-800">
        <div className="max-w-2xl mx-auto flex">
          {nav.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 text-xs transition ${
                pathname.startsWith(to) ? 'text-brand-400' : 'text-gray-500 hover:text-gray-300'
              }`}>
              <Icon size={20} />
              {label}
            </Link>
          ))}
        </div>
      </nav>

      <div className="h-16" />
    </>
  )
}
