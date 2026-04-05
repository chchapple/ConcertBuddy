import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, MessageCircle } from 'lucide-react'
import { getMatches } from '../api/index.js'
import { MATCHES as MOCK_MATCHES, CURRENT_USER } from '../data/mockData'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function timeAgo(iso) {
  const diff = (Date.now() - new Date(iso)) / 1000
  if (diff < 60)    return 'just now'
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

function normalizeMatch(m) {
  const other = m.user1?.id === CURRENT_USER.id ? m.user2 : m.user1
  return {
    ...m,
    profile: m.profile ?? (other ? { id: other.id, displayName: other.display_name, photoUrl: other.photo_url, avgRating: other.avg_rating } : null),
    eventArtist: m.eventArtist ?? m.events?.artist ?? '',
    eventDate: m.eventDate ?? m.events?.event_date ?? '',
    lastMessage: m.lastMessage ?? '',
    lastMessageAt: m.lastMessageAt ?? m.created_at,
  }
}

export default function Matches() {
  const [matches, setMatches] = useState(MOCK_MATCHES)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMatches(CURRENT_USER.id)
      .then(data => setMatches(data.map(normalizeMatch)))
      .catch(() => setMatches(MOCK_MATCHES))
      .finally(() => setLoading(false))
  }, [])

  const active = matches.filter(m => m.active)

  return (
    <div>
      <h1 className="page-title mb-4">My Matches</h1>

      {active.length === 0 ? (
        <div className="card text-center py-16 flex flex-col items-center gap-4">
          <MessageCircle size={40} className="text-gray-600" />
          <p className="text-gray-400">No matches yet.</p>
          <p className="text-sm text-gray-500">Browse attendees at an upcoming event to connect!</p>
          <Link to="/events" className="btn-primary">Discover Events</Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {active.map(match => (
            <Link
              key={match.id}
              to={`/matches/${match.id}/chat`}
              className="card flex items-center gap-4 hover:border-brand-700 transition-colors"
            >
              <img
                src={match.profile.photoUrl}
                alt={match.profile.displayName}
                className="w-14 h-14 rounded-full object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-white">{match.profile.displayName}</p>
                  <span className="text-xs text-gray-500">{timeAgo(match.lastMessageAt)}</span>
                </div>
                <p className="text-xs text-brand-400 flex items-center gap-1 mt-0.5">
                  <CalendarDays size={11} /> {match.eventArtist} · {formatDate(match.eventDate)}
                </p>
                <p className="text-sm text-gray-400 truncate mt-1">{match.lastMessage}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
