import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, MapPin, Users, Search } from 'lucide-react'
import { getEvents } from '../api/index.js'
import { EVENTS as MOCK_EVENTS } from '../data/mockData'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
}

function normalize(e) {
  return {
    ...e,
    venueName: e.venueName ?? e.venues?.name ?? '',
    eventDate: e.eventDate ?? e.event_date,
    posterUrl: e.posterUrl ?? e.poster_url ?? `https://picsum.photos/seed/${e.id}/400/220`,
    attendeeCount: e.attendeeCount ?? 0,
  }
}

export default function Events() {
  const [query, setQuery] = useState('')
  const [venueFilter, setVenueFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [allEvents, setAllEvents] = useState(MOCK_EVENTS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getEvents()
      .then(data => setAllEvents(data.map(normalize)))
      .catch(() => setAllEvents(MOCK_EVENTS))
      .finally(() => setLoading(false))
  }, [])

  const venues = [...new Set(allEvents.map(e => e.venueName))]

  const filtered = allEvents.filter(e => {
    const q = query.toLowerCase()
    const matchesQuery = !q || e.artist.toLowerCase().includes(q) || e.venueName.toLowerCase().includes(q)
    const matchesVenue = !venueFilter || e.venueName === venueFilter
    const matchesDate  = !dateFilter  || (e.eventDate || '').startsWith(dateFilter)
    return matchesQuery && matchesVenue && matchesDate
  })

  return (
    <div>
      <h1 className="page-title mb-4">Discover Events</h1>

      {/* Search & filters */}
      <div className="flex flex-col gap-3 mb-6">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            className="input pl-9"
            placeholder="Search artist or venue…"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select className="input flex-1" value={venueFilter} onChange={e => setVenueFilter(e.target.value)}>
            <option value="">All venues</option>
            {venues.map(v => <option key={v} value={v}>{v}</option>)}
          </select>
          <input
            className="input flex-1"
            type="date"
            value={dateFilter}
            onChange={e => setDateFilter(e.target.value)}
          />
        </div>
      </div>

      {/* Event cards */}
      {loading ? (
        <p className="text-center text-gray-500 py-16">Loading events…</p>
      ) : filtered.length === 0 ? (
        <p className="text-center text-gray-500 py-16">No events match your filters.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map(event => (
            <Link key={event.id} to={`/events/${event.id}`} className="card hover:border-brand-700 transition-colors block">
              <img
                src={event.posterUrl}
                alt={event.artist}
                className="w-full h-36 object-cover rounded-xl mb-4"
              />
              <h2 className="text-lg font-bold text-white">{event.artist}</h2>
              <div className="flex flex-col gap-1 mt-2 text-sm text-gray-400">
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} /> {event.venueName} · {event.venueName.includes('Chico') ? '' : ''} Chico, CA
                </span>
                <span className="flex items-center gap-1.5">
                  <CalendarDays size={14} /> {formatDate(event.eventDate)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users size={14} /> {event.attendeeCount} verified attendees
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
