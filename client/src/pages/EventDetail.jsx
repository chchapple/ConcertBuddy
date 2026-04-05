import { useParams, Link } from 'react-router-dom'
import { CalendarDays, MapPin, Users, Ticket, Star } from 'lucide-react'
import { EVENTS, PROFILES } from '../data/mockData'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' })
}

export default function EventDetail() {
  const { id } = useParams()
  const event = EVENTS.find(e => e.id === id)

  if (!event) return <p className="text-gray-400 text-center py-20">Event not found.</p>

  const attendees = PROFILES.slice(1, 4)

  return (
    <div>
      {/* Poster */}
      <img src={event.posterUrl} alt={event.artist} className="w-full h-48 object-cover rounded-2xl mb-5" />

      {/* Title */}
      <h1 className="page-title">{event.artist}</h1>
      <p className="text-gray-400 mt-1 text-sm">{event.description}</p>

      {/* Meta */}
      <div className="flex flex-col gap-2 mt-4 text-sm text-gray-400">
        <span className="flex items-center gap-2"><MapPin size={15} /> {event.venueName} · Chico, CA</span>
        <span className="flex items-center gap-2"><CalendarDays size={15} /> {formatDate(event.eventDate)}</span>
        <span className="flex items-center gap-2"><Users size={15} /> {event.attendeeCount} verified attendees going</span>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-6">
        <Link to={`/events/${id}/swipe`} className="btn-primary flex-1 py-3">
          Browse Attendees
        </Link>
        <a href={event.ticketUrl} className="btn-secondary flex-1 py-3 flex items-center justify-center gap-2">
          <Ticket size={16} /> Get Tickets
        </a>
      </div>

      {/* Attendee preview */}
      <section className="mt-8">
        <h2 className="text-lg font-semibold text-white mb-3">Who's Going</h2>
        <div className="flex flex-col gap-3">
          {attendees.map(p => (
            <div key={p.id} className="card flex items-center gap-4">
              <img src={p.photoUrl} alt={p.displayName} className="w-12 h-12 rounded-full object-cover" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white text-sm">{p.displayName}</p>
                <p className="text-xs text-gray-400 truncate">{p.favoriteGenres.join(' · ')}</p>
              </div>
              {p.avgRating && (
                <span className="flex items-center gap-1 text-xs text-yellow-400">
                  <Star size={12} fill="currentColor" /> {p.avgRating}
                </span>
              )}
            </div>
          ))}
        </div>
        <Link to={`/events/${id}/swipe`} className="block text-center text-brand-400 text-sm mt-3 hover:underline">
          See all attendees →
        </Link>
      </section>
    </div>
  )
}
