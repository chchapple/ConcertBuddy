import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Heart, X, Star, Car, SlidersHorizontal } from 'lucide-react'
import { getEvent, getEventAttendees } from '../api/index.js'
import { EVENTS, PROFILES } from '../data/mockData'

function normalizeProfile(p) {
  return {
    ...p,
    displayName:    p.displayName    ?? p.display_name,
    photoUrl:       p.photoUrl       ?? p.photo_url,
    avgRating:      p.avgRating      ?? p.avg_rating,
    hasRide:        p.hasRide        ?? p.has_ride ?? false,
    favoriteArtists: p.favoriteArtists ?? p.favorite_artists ?? [],
    favoriteGenres:  p.favoriteGenres  ?? p.favorite_genres  ?? [],
    age:            p.age ?? 0,
    gender:         p.gender ?? '',
    bio:            p.bio ?? '',
  }
}

export default function Swipe() {
  const { id } = useParams()
  const [event, setEvent] = useState(null)
  const [deck, setDeck] = useState([])
  const [loading, setLoading] = useState(true)
  const [current, setCurrent] = useState(0)
  const [filters, setFilters] = useState({ showFilters: false, rideOnly: false, maxAge: 100, minAge: 18 })
  const [lastAction, setLastAction] = useState(null)

  useEffect(() => {
    Promise.all([getEvent(id), getEventAttendees(id)])
      .then(([ev, att]) => {
        setEvent(ev)
        setDeck(att.map(normalizeProfile))
      })
      .catch(() => {
        setEvent(EVENTS.find(e => e.id === id) || null)
        setDeck(PROFILES.slice(1).map(normalizeProfile))
      })
      .finally(() => setLoading(false))
  }, [id])

  const filtered = deck.filter(p => {
    if (filters.rideOnly && !p.hasRide) return false
    if (p.age < filters.minAge || p.age > filters.maxAge) return false
    return true
  })

  const profile = filtered[current]

  function act(direction) {
    setLastAction(direction)
    setTimeout(() => {
      setCurrent(c => c + 1)
      setLastAction(null)
    }, 350)
  }

  if (loading) return <p className="text-gray-400 text-center py-20">Loading…</p>
  if (!event)  return <p className="text-gray-400 text-center py-20">Event not found.</p>

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="page-title">Browse Attendees</h1>
          <p className="text-sm text-gray-400">{event.artist}</p>
        </div>
        <button
          onClick={() => setFilters(f => ({ ...f, showFilters: !f.showFilters }))}
          className={`p-2 rounded-xl border transition ${filters.showFilters ? 'border-brand-500 text-brand-400' : 'border-gray-700 text-gray-400'}`}
        >
          <SlidersHorizontal size={18} />
        </button>
      </div>

      {/* Filters panel */}
      {filters.showFilters && (
        <div className="card mb-4 flex flex-col gap-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="accent-brand-500 w-4 h-4"
              checked={filters.rideOnly} onChange={e => setFilters(f => ({ ...f, rideOnly: e.target.checked }))} />
            <span className="text-sm text-gray-300">Has a ride</span>
          </label>
          <div>
            <label className="label">Age range: {filters.minAge}–{filters.maxAge}</label>
            <div className="flex gap-2">
              <input type="number" className="input" min="18" max="100" value={filters.minAge}
                onChange={e => setFilters(f => ({ ...f, minAge: Number(e.target.value) }))} />
              <input type="number" className="input" min="18" max="100" value={filters.maxAge}
                onChange={e => setFilters(f => ({ ...f, maxAge: Number(e.target.value) }))} />
            </div>
          </div>
        </div>
      )}

      {/* Card stack */}
      {!profile ? (
        <div className="card text-center py-16 flex flex-col items-center gap-4">
          <p className="text-gray-400">You've seen everyone going to this show!</p>
          <Link to={`/events/${id}`} className="btn-secondary">Back to Event</Link>
        </div>
      ) : (
        <div className={`card transition-all duration-300 ${lastAction === 'like' ? 'ring-2 ring-green-500' : lastAction === 'pass' ? 'ring-2 ring-red-500' : ''}`}>
          <img src={profile.photoUrl} alt={profile.displayName} className="w-full h-72 object-cover rounded-xl mb-4" />

          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">{profile.displayName}, {profile.age}</h2>
              <p className="text-sm text-gray-400 capitalize">{profile.gender}</p>
            </div>
            <div className="flex items-center gap-2">
              {profile.hasRide && (
                <span className="flex items-center gap-1 text-xs text-green-400 bg-green-900/30 px-2 py-1 rounded-full">
                  <Car size={12} /> Has ride
                </span>
              )}
              {profile.avgRating && (
                <span className="flex items-center gap-1 text-xs text-yellow-400">
                  <Star size={12} fill="currentColor" /> {profile.avgRating}
                </span>
              )}
            </div>
          </div>

          <p className="text-sm text-gray-300 mt-3">{profile.bio}</p>

          <div className="mt-4">
            <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Favorite Artists</p>
            <div className="flex flex-wrap gap-2">
              {profile.favoriteArtists.map(a => <span key={a} className="badge">{a}</span>)}
            </div>
          </div>

          <div className="mt-3">
            <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Genres</p>
            <div className="flex flex-wrap gap-2">
              {profile.favoriteGenres.map(g => (
                <span key={g} className="text-xs px-2.5 py-0.5 rounded-full bg-gray-800 text-gray-300 border border-gray-700">{g}</span>
              ))}
            </div>
          </div>

          {/* Like / Pass buttons */}
          <div className="flex gap-4 mt-6">
            <button onClick={() => act('pass')}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl border-2 border-red-700 text-red-400 py-3 hover:bg-red-900/20 transition active:scale-95">
              <X size={22} /> Pass
            </button>
            <button onClick={() => act('like')}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl border-2 border-green-600 text-green-400 py-3 hover:bg-green-900/20 transition active:scale-95">
              <Heart size={22} /> Like
            </button>
          </div>
          <p className="text-center text-xs text-gray-600 mt-2">{current + 1} / {filtered.length}</p>
        </div>
      )}
    </div>
  )
}
