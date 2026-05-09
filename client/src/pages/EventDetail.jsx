import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { CalendarDays, MapPin, Users, CheckCircle2, Star } from 'lucide-react'
import { getEvent, getEventAttendees, registerAttendance, getAttendance } from '../api/index.js'
import { useAuth } from '../context/AuthContext.jsx'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' })
}

function normalizeEvent(e) {
  return {
    ...e,
    venueName: e.venueName ?? e.venues?.name ?? '',
    eventDate: e.eventDate ?? e.event_date,
    posterUrl: e.posterUrl ?? e.poster_url ?? `https://picsum.photos/seed/${e.id}/400/220`,
    ticketUrl: e.ticketUrl ?? e.ticket_url ?? '#',
  }
}

function normalizeProfile(p) {
  return {
    ...p,
    displayName: p.displayName ?? p.display_name,
    photoUrl:    p.photoUrl    ?? p.photo_url,
    avgRating:   p.avgRating   ?? p.avg_rating,
    favoriteGenres: p.favoriteGenres ?? p.favorite_genres ?? [],
  }
}

export default function EventDetail() {
  const { id } = useParams()
  const { session } = useAuth()
  const myId = session?.user?.id
  const [event, setEvent] = useState(null)
  const [attendees, setAttendees] = useState([])
  const [loading, setLoading] = useState(true)
  const [going, setGoing] = useState(false)
  const [markingGoing, setMarkingGoing] = useState(false)

  useEffect(() => {
    Promise.all([getEvent(id), getEventAttendees(id)])
      .then(([ev, att]) => {
        setEvent(normalizeEvent(ev))
        setAttendees(att.map(normalizeProfile))
      })
      .catch(() => { setEvent(null); setAttendees([]) })
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (!myId) return
    getAttendance({ user_id: myId, event_id: id })
      .then(data => setGoing(Array.isArray(data) ? data.length > 0 : !!data))
      .catch(() => {})
  }, [id, myId])

  async function handleMarkGoing() {
    if (!myId || going) return
    setMarkingGoing(true)
    try {
      await registerAttendance({ user_id: myId, event_id: id })
      setGoing(true)
      const att = await getEventAttendees(id)
      setAttendees(att.map(normalizeProfile))
    } catch (_) {}
    setMarkingGoing(false)
  }

  if (loading) return <p className="text-gray-400 text-center py-20">Loading…</p>
  if (!event)   return <p className="text-gray-400 text-center py-20">Event not found.</p>

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
      <div className="mt-6">
        <button
          onClick={handleMarkGoing}
          disabled={going || markingGoing}
          className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition ${
            going
              ? 'bg-green-900/40 border border-green-700 text-green-400 cursor-default'
              : 'btn-primary'
          }`}
        >
          <CheckCircle2 size={18} />
          {going ? "You're Going!" : markingGoing ? 'Saving…' : "Mark as Going"}
        </button>
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
