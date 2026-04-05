import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Music2, ChevronRight } from 'lucide-react'

const GENRES = ['indie-rock', 'synthwave', 'folk', 'bedroom-pop', 'electronic', 'indie-pop', 'dream-pop', 'alternative', 'lo-fi', 'indie-folk']

export default function SignUp() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [errors, setErrors] = useState({})
  const [form, setForm] = useState({
    email: '', password: '', displayName: '', age: '', gender: '',
    bio: '', favoriteArtists: '', selectedGenres: [], hasRide: false,
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

  function validateStep1() {
    const e = {}
    if (!form.email.includes('@')) e.email = 'Enter a valid email'
    if (form.password.length < 8)  e.password = 'At least 8 characters'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function validateStep2() {
    const e = {}
    if (!form.displayName.trim()) e.displayName = 'Display name is required'
    const age = Number(form.age)
    if (!form.age || age < 18 || age > 100) e.age = 'Must be 18 or older'
    if (!form.gender) e.gender = 'Select a gender'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleNext() {
    if (step === 1 && validateStep1()) setStep(2)
    if (step === 2 && validateStep2()) setStep(3)
  }

  function handleSubmit(e) {
    e.preventDefault()
    navigate('/events')
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-6 py-12">
      <Link to="/" className="flex items-center gap-2 text-brand-400 font-bold text-xl mb-8">
        <Music2 size={24} /> ConcertBuddy
      </Link>

      <div className="card w-full max-w-md">
        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-6">
          {[1, 2, 3].map(s => (
            <div key={s} className={`h-1.5 flex-1 rounded-full transition-colors ${s <= step ? 'bg-brand-500' : 'bg-gray-700'}`} />
          ))}
        </div>

        <h1 className="page-title mb-1">
          {step === 1 && 'Create Account'}
          {step === 2 && 'Your Profile'}
          {step === 3 && 'Music Taste'}
        </h1>
        <p className="text-sm text-gray-400 mb-6">Step {step} of 3</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {step === 1 && (
            <>
              <div>
                <label className="label">Email</label>
                <input className="input" type="email" placeholder="you@example.com"
                  value={form.email} onChange={e => set('email', e.target.value)} />
                {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="label">Password</label>
                <input className="input" type="password" placeholder="Min 8 characters"
                  value={form.password} onChange={e => set('password', e.target.value)} />
                {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password}</p>}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <label className="label">Display Name</label>
                <input className="input" placeholder="How others see you"
                  value={form.displayName} onChange={e => set('displayName', e.target.value)} />
                {errors.displayName && <p className="text-xs text-red-400 mt-1">{errors.displayName}</p>}
              </div>
              <div>
                <label className="label">Age</label>
                <input className="input" type="number" min="18" max="100" placeholder="18+"
                  value={form.age} onChange={e => set('age', e.target.value)} />
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
                <label className="label">Bio <span className="text-gray-600 normal-case font-normal">(optional)</span></label>
                <textarea className="input resize-none" rows={3} placeholder="Tell others about yourself…"
                  value={form.bio} onChange={e => set('bio', e.target.value)} />
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="accent-brand-500 w-4 h-4"
                  checked={form.hasRide} onChange={e => set('hasRide', e.target.checked)} />
                <span className="text-sm text-gray-300">I can offer a ride to the venue</span>
              </label>
            </>
          )}

          {step === 3 && (
            <>
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
                    <button type="button" key={g}
                      onClick={() => toggleGenre(g)}
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
            </>
          )}

          <div className="flex gap-3 pt-2">
            {step > 1 && (
              <button type="button" onClick={() => setStep(s => s - 1)} className="btn-secondary flex-1">
                Back
              </button>
            )}
            {step < 3 ? (
              <button type="button" onClick={handleNext} className="btn-primary flex-1">
                Next <ChevronRight size={16} />
              </button>
            ) : (
              <button type="submit" className="btn-primary flex-1">
                Create Account
              </button>
            )}
          </div>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{' '}
          <Link to="/events" className="text-brand-400 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
