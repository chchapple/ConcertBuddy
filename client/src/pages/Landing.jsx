import { Link } from 'react-router-dom'
import { Music2, Users, MessageCircle, Shield } from 'lucide-react'

const FEATURES = [
  { icon: Music2,        title: 'Find Your Show',    desc: 'Browse upcoming Chico-area concerts and see who else is going.' },
  { icon: Users,         title: 'Meet Attendees',    desc: 'Swipe through verified ticket holders attending the same event.' },
  { icon: MessageCircle, title: 'Chat & Coordinate', desc: 'Match and message to plan your meet-up before the show.' },
  { icon: Shield,        title: 'Stay Safe',         desc: 'Ticket verification, ratings, and moderation built-in.' },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center gap-8 px-6 py-16 text-center">
        <div className="flex items-center gap-3 text-brand-400">
          <Music2 size={48} />
        </div>
        <h1 className="text-5xl font-extrabold text-white leading-tight">
          Concert<span className="text-brand-400">Buddy</span>
        </h1>
        <p className="max-w-sm text-gray-400 text-lg">
          Find and connect with other solo concert-goers at the same show.
          No more going alone.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
          <Link to="/signup" className="btn-primary flex-1 py-3 text-base">
            Get Started
          </Link>
          <Link to="/events" className="btn-secondary flex-1 py-3 text-base">
            Browse Events
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-900 px-6 py-12">
        <div className="max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card flex gap-4">
              <div className="mt-1 shrink-0 rounded-xl bg-brand-900 p-2 text-brand-400">
                <Icon size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">{title}</h3>
                <p className="text-sm text-gray-400">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-xs text-gray-600">
        © 2026 ConcertBuddy · Chico, CA · MVP
      </footer>
    </div>
  )
}
