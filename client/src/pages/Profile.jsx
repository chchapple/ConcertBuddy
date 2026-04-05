import { Link } from 'react-router-dom'
import { Star, Car, Pencil, Music2 } from 'lucide-react'
import { CURRENT_USER, MATCHES } from '../data/mockData'

export default function Profile() {
  const u = CURRENT_USER

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="page-title">My Profile</h1>
        <Link to="/profile/edit" className="btn-secondary flex items-center gap-2 py-2 px-4">
          <Pencil size={14} /> Edit
        </Link>
      </div>

      {/* Avatar + basics */}
      <div className="card flex gap-5 mb-4">
        <img src={u.photoUrl} alt={u.displayName} className="w-20 h-20 rounded-2xl object-cover shrink-0" />
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-white">{u.displayName}</h2>
          <p className="text-sm text-gray-400 capitalize">{u.gender} · {u.age}</p>
          <div className="flex items-center gap-3 mt-2">
            {u.avgRating && (
              <span className="flex items-center gap-1 text-sm text-yellow-400">
                <Star size={14} fill="currentColor" /> {u.avgRating}
              </span>
            )}
            {u.hasRide && (
              <span className="flex items-center gap-1 text-xs text-green-400 bg-green-900/30 px-2 py-1 rounded-full">
                <Car size={12} /> Has ride
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Bio */}
      {u.bio && (
        <div className="card mb-4">
          <p className="text-xs text-gray-500 uppercase font-semibold mb-2">About</p>
          <p className="text-sm text-gray-300">{u.bio}</p>
        </div>
      )}

      {/* Music taste */}
      <div className="card mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Music2 size={16} className="text-brand-400" />
          <p className="text-xs text-gray-500 uppercase font-semibold">Music Taste</p>
        </div>
        <div className="mb-3">
          <p className="text-xs text-gray-600 mb-1.5">Favorite Artists</p>
          <div className="flex flex-wrap gap-2">
            {u.favoriteArtists.map(a => <span key={a} className="badge">{a}</span>)}
          </div>
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-1.5">Genres</p>
          <div className="flex flex-wrap gap-2">
            {u.favoriteGenres.map(g => (
              <span key={g} className="text-xs px-2.5 py-0.5 rounded-full bg-gray-800 text-gray-300 border border-gray-700">{g}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="card text-center">
          <p className="text-2xl font-bold text-brand-400">{MATCHES.length}</p>
          <p className="text-xs text-gray-500 mt-1">Total Matches</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-brand-400">{u.avgRating ?? '—'}</p>
          <p className="text-xs text-gray-500 mt-1">Avg Rating</p>
        </div>
      </div>
    </div>
  )
}
