import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { supabase } from '../lib/supabase.js'

const GENRES = ['indie-rock', 'synthwave', 'folk', 'bedroom-pop', 'electronic', 'indie-pop', 'dream-pop', 'alternative', 'lo-fi', 'indie-folk']

export default function EditProfile() {
  const navigate = useNavigate()
  const { profile, session, refreshProfile } = useAuth()
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [form, setForm] = useState({
    displayName:     profile?.display_name || '',
    bio:             profile?.bio || '',
    age:             String(profile?.age || ''),
    gender:          profile?.gender || '',
    favoriteArtists: (profile?.favorite_artists || []).join(', '),
    selectedGenres:  [...(profile?.favorite_genres || [])],
    hasRide:         profile?.has_ride || false,
  })

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }))
    setErrors(e => ({ ...e, [field]: undefined }))
  }

  function toggleGenre(g) {
    setForm(f => ({
      ...f,
      selectedGenres: f.selectedGenres.includes(g)
        ? f.selectedGenres.filter(x => x !== g)
        : [...f.selectedGenres, g],
    }))
  }

  function validate() {
    const e = {}
    if (!form.displayName.trim()) e.displayName = 'Required'
    const age = Number(form.age)
    if (!form.age || age < 18 || age > 100) e.age = 'Must be 18 or older'
    if (!form.gender) e.gender = 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    setSaveError('')
    const uid = session?.user?.id
    if (!uid) { setSaveError('Not signed in'); setSaving(false); return }
    const artists = form.favoriteArtists.split(',').map(s => s.trim()).filter(Boolean)
    const { error } = await supabase.from('profiles').upsert({
      id: uid,
      display_name: form.displayName.trim(),
      bio: form.bio,
      age: Number(form.age),
      gender: form.gender,
      favorite_artists: artists,
      favorite_genres: form.selectedGenres,
      has_ride: form.hasRide,
      photo_url: profile?.photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${uid}`,
      photo_urls: profile?.photo_urls || [`https://api.dicebear.com/7.x/avataaars/svg?seed=${uid}`],
    })
    setSaving(false)
    if (error) { setSaveError(error.message); return }
    if (refreshProfile) refreshProfile()
    navigate('/profile')
  }

  return (
    <div>
      <h1 className="page-title mb-6">Edit Profile</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="card flex flex-col gap-4">
          <h2 className="text-sm font-semibold text-gray-300">Basic Info</h2>

          <div>
            <label className="label">Display Name</label>
            <input className="input" value={form.displayName} onChange={e => set('displayName', e.target.value)} />
            {errors.displayName && <p className="text-xs text-red-400 mt-1">{errors.displayName}</p>}
          </div>

          <div>
            <label className="label">Age</label>
            <input className="input" type="number" min="18" max="100" value={form.age}
              onChange={e => set('age', e.target.value)} />
            {errors.age && <p className="text-xs text-red-400 mt-1">{errors.age}</p>}
          </div>

          <div>
            <label className="label">Gender</label>
            <select className="input" value={form.gender} onChange={e => set('gender', e.target.value)}>
              <option value="">Select…</option>
              <option value="man">Man</option>
              <option value="woman">Woman</option>
              <option value="non-binary">Non-binary</option>
              <option value="prefer not to say">Prefer not to say</option>
            </select>
            {errors.gender && <p className="text-xs text-red-400 mt-1">{errors.gender}</p>}
          </div>

          <div>
            <label className="label">Bio</label>
            <textarea className="input resize-none" rows={3} value={form.bio}
              onChange={e => set('bio', e.target.value)} />
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="accent-brand-500 w-4 h-4"
              checked={form.hasRide} onChange={e => set('hasRide', e.target.checked)} />
            <span className="text-sm text-gray-300">I can offer a ride to the venue</span>
          </label>
        </div>

        <div className="card flex flex-col gap-4">
          <h2 className="text-sm font-semibold text-gray-300">Music Taste</h2>

          <div>
            <label className="label">Favorite Artists</label>
            <input className="input" placeholder="e.g. The Midnight, Hippo Campus"
              value={form.favoriteArtists} onChange={e => set('favoriteArtists', e.target.value)} />
            <p className="text-xs text-gray-500 mt-1">Comma-separated</p>
          </div>

          <div>
            <label className="label">Genres</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {GENRES.map(g => (
                <button type="button" key={g} onClick={() => toggleGenre(g)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition ${
                    form.selectedGenres.includes(g)
                      ? 'bg-brand-600 border-brand-500 text-white'
                      : 'border-gray-700 text-gray-400 hover:border-gray-500'
                  }`}>
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>

        {saveError && <p className="text-sm text-red-400">{saveError}</p>}
        <div className="flex gap-3">
          <button type="button" onClick={() => navigate('/profile')} className="btn-secondary flex-1">
            Cancel
          </button>
          <button type="submit" disabled={saving} className="btn-primary flex-1">
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
