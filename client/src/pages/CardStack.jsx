import { useState, useEffect } from 'react'
import { Heart, X, Star, Car, MoreVertical } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { getMatches } from '../api/index.js'

const BOT_ID = '00000000-0000-0000-0000-000000000000'

const FILTERS = { minAge: 18, maxAge: 100, gender: 'all', rideOnly: false }

function SwipeCard({ profile, onLike, onPass }) {
  const [photoIdx, setPhotoIdx] = useState(0)
  const photos = profile.photo_urls?.length ? profile.photo_urls : [profile.photo_url || profile.photoUrl]

  function handleClick(e) {
    const x = e.clientX - e.currentTarget.getBoundingClientRect().left
    const half = e.currentTarget.offsetWidth / 2
    if (x > half) setPhotoIdx(i => (i + 1) % photos.length)
    else setPhotoIdx(i => (i - 1 + photos.length) % photos.length)
  }

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gray-800 select-none"
         style={{ height: '68vh', maxHeight: 560 }}>
      <img
        src={photos[photoIdx]}
        alt={profile.displayName || profile.display_name}
        className="w-full h-full object-cover cursor-pointer"
        onClick={handleClick}
      />
      {photos.length > 1 && (
        <div className="absolute top-3 left-0 right-0 flex gap-1 px-3">
          {photos.map((_, i) => (
            <div key={i} className={`flex-1 h-1 rounded-full ${i === photoIdx ? 'bg-white' : 'bg-white/40'}`} />
          ))}
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-5">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">
              {profile.displayName || profile.display_name}, {profile.age}
            </h2>
            <p className="text-sm text-gray-300 line-clamp-2 mt-1">{profile.bio}</p>
            <div className="flex flex-wrap gap-1 mt-2">
              {(profile.favoriteGenres || profile.favorite_genres || []).slice(0, 3).map(g => (
                <span key={g} className="text-xs bg-brand-900/80 text-brand-300 px-2 py-0.5 rounded-full">{g}</span>
              ))}
              {(profile.hasRide || profile.has_ride) && (
                <span className="text-xs bg-green-900/80 text-green-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Car size={10} /> Has ride
                </span>
              )}
            </div>
          </div>
          {profile.avgRating || profile.avg_rating ? (
            <div className="flex items-center gap-1 text-yellow-400 text-sm">
              <Star size={14} fill="currentColor" />
              {(profile.avgRating || profile.avg_rating).toFixed(1)}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default function CardStack() {
  const { profile: me } = useAuth()
  const [deck, setDeck] = useState([])
  const [current, setCurrent] = useState(0)
  const [matched, setMatched] = useState(null)
  const [filters, setFilters] = useState(FILTERS)
  const [showFilters, setShowFilters] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!me?.id) return
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/attendance?user_id=${me.id}`)
      .then(r => r.json())
      .then(async attendances => {
        if (!attendances?.length) { setLoading(false); return }
        const eventIds = attendances.map(a => a.event_id)
        const allProfiles = []
        for (const eid of eventIds) {
          const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/events/${eid}/attendees`)
          const att = await res.json()
          if (Array.isArray(att)) att.forEach(p => {
            if (p.id !== me.id && p.id !== BOT_ID && !allProfiles.find(x => x.id === p.id))
              allProfiles.push(p)
          })
        }
        setDeck(allProfiles)
      })
      .catch(() => setDeck([]))
      .finally(() => setLoading(false))
  }, [me])

  const filtered = deck.filter(p => {
    if (filters.rideOnly && !p.has_ride && !p.hasRide) return false
    const age = p.age || 0
    if (age < filters.minAge || age > filters.maxAge) return false
    if (filters.gender !== 'all' && p.gender !== filters.gender) return false
    return true
  })

  const profile = filtered[current]

  function act(dir) {
    if (dir === 'like') {
      setMatched(profile)
    }
    setTimeout(() => setCurrent(c => c + 1), 300)
  }

  if (loading) return <p className="text-gray-400 text-center py-20">Loading…</p>

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="page-title">Card Stack</h1>
        <button onClick={() => setShowFilters(f => !f)}
          className={`p-2 rounded-xl border transition ${showFilters ? 'border-brand-500 text-brand-400' : 'border-gray-700 text-gray-400'}`}>
          <MoreVertical size={18} />
        </button>
      </div>

      {showFilters && (
        <div className="card flex flex-col gap-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="accent-brand-500 w-4 h-4"
              checked={filters.rideOnly}
              onChange={e => setFilters(f => ({ ...f, rideOnly: e.target.checked }))} />
            <span className="text-sm text-gray-300">Has ride only</span>
          </label>
          <div>
            <label className="text-sm text-gray-400 block mb-1">Gender</label>
            <select className="input w-full" value={filters.gender}
              onChange={e => setFilters(f => ({ ...f, gender: e.target.value }))}>
              <option value="all">All</option>
              <option value="man">Men</option>
              <option value="woman">Women</option>
              <option value="non-binary">Non-binary</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-400 block mb-1">Max age: {filters.maxAge}</label>
            <input type="range" min="18" max="60" value={filters.maxAge}
              onChange={e => setFilters(f => ({ ...f, maxAge: Number(e.target.value) }))}
              className="w-full accent-brand-500" />
          </div>
        </div>
      )}

      {!profile ? (
        <div className="card text-center py-20 flex flex-col items-center gap-3">
          <p className="text-gray-400 font-medium">No more profiles</p>
          <p className="text-sm text-gray-600">Attend more events to find more people!</p>
        </div>
      ) : (
        <>
          <SwipeCard profile={profile} onLike={() => act('like')} onPass={() => act('pass')} />
          <div className="flex justify-center gap-8 mt-2">
            <button onClick={() => act('pass')}
              className="w-16 h-16 rounded-full border-2 border-red-500 text-red-400 flex items-center justify-center shadow-lg hover:bg-red-500/10 transition">
              <X size={28} />
            </button>
            <button onClick={() => act('like')}
              className="w-16 h-16 rounded-full border-2 border-green-500 text-green-400 flex items-center justify-center shadow-lg hover:bg-green-500/10 transition">
              <Heart size={28} />
            </button>
          </div>
        </>
      )}

      {matched && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-6">
          <div className="card text-center max-w-xs w-full flex flex-col items-center gap-4">
            <div className="text-4xl">🎉</div>
            <h2 className="text-2xl font-extrabold text-white">It's a Match!</h2>
            <p className="text-gray-400">You and <span className="text-white font-semibold">{matched.display_name || matched.displayName}</span> both want to connect!</p>
            <div className="flex gap-3 w-full mt-2">
              <button className="btn-primary flex-1" onClick={() => setMatched(null)}>Message Now</button>
              <button className="btn-secondary flex-1" onClick={() => setMatched(null)}>Keep Swiping</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
