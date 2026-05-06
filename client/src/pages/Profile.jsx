import { Link } from 'react-router-dom'
import { Star, Car, Pencil, Music2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

export default function Profile() {
  const { profile, session } = useAuth()

  const displayName = profile?.display_name || session?.user?.email?.split('@')[0] || 'You'
  const photoUrl = profile?.photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${session?.user?.id}`
  const artists = profile?.favorite_artists || []
  const genres = profile?.favorite_genres || []

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="page-title">My Profile</h1>
        <Link to="/profile/edit" className="btn-secondary flex items-center gap-2 py-2 px-4">
          <Pencil size={14} /> Edit
        </Link>
      </div>

      <div className="card flex gap-5 mb-4">
        <img src={photoUrl} alt={displayName} className="w-20 h-20 rounded-2xl object-cover shrink-0" />
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-white">{displayName}</h2>
          <p className="text-sm text-gray-400 capitalize">{profile?.gender} · {profile?.age}</p>
          <p className="text-xs text-gray-500 mt-1">{session?.user?.email}</p>
          <div className="flex items-center gap-3 mt-2">
            {profile?.avg_rating && (
              <span className="flex items-center gap-1 text-sm text-yellow-400">
                <Star size={14} fill="currentColor" /> {profile.avg_rating}
              </span>
            )}
            {profile?.has_ride && (
              <span className="flex items-center gap-1 text-xs text-green-400 bg-green-900/30 px-2 py-1 rounded-full">
                <Car size={12} /> Has ride
              </span>
            )}
          </div>
        </div>
      </div>

      {profile?.bio && (
        <div className="card mb-4">
          <p className="text-xs text-gray-500 uppercase font-semibold mb-2">About</p>
          <p className="text-sm text-gray-300">{profile.bio}</p>
        </div>
      )}

      <div className="card mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Music2 size={16} className="text-brand-400" />
          <p className="text-xs text-gray-500 uppercase font-semibold">Music Taste</p>
        </div>
        {artists.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-gray-600 mb-1.5">Favorite Artists</p>
            <div className="flex flex-wrap gap-2">
              {artists.map(a => <span key={a} className="badge">{a}</span>)}
            </div>
          </div>
        )}
        {genres.length > 0 && (
          <div>
            <p className="text-xs text-gray-600 mb-1.5">Genres</p>
            <div className="flex flex-wrap gap-2">
              {genres.map(g => (
                <span key={g} className="text-xs px-2.5 py-0.5 rounded-full bg-gray-800 text-gray-300 border border-gray-700">{g}</span>
              ))}
            </div>
          </div>
        )}
        {artists.length === 0 && genres.length === 0 && (
          <p className="text-sm text-gray-600">No music preferences added yet.</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="card text-center">
          <p className="text-2xl font-bold text-brand-400">{profile?.avg_rating ?? '—'}</p>
          <p className="text-xs text-gray-500 mt-1">Avg Rating</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-brand-400">{profile?.is_admin ? 'Admin' : 'User'}</p>
          <p className="text-xs text-gray-500 mt-1">Account Type</p>
        </div>
      </div>
    </div>
  )
}
