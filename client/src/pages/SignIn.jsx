import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Music2, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

export default function SignIn() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { data, error: authErr } = await signIn(form.email, form.password)
    setLoading(false)
    if (authErr) { setError(authErr.message); return }
    const isAdmin = data?.user?.email === 'admin@concertbuddy.app'
    navigate(isAdmin ? '/admin' : '/events')
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 justify-center mb-8 text-brand-400">
          <Music2 size={32} />
          <span className="text-2xl font-extrabold text-white">ConcertBuddy</span>
        </div>

        <div className="card">
          <h1 className="text-xl font-bold text-white mb-6">Sign In</h1>

          {error && <p className="text-red-400 text-sm mb-4 bg-red-900/30 rounded-lg px-3 py-2">{error}</p>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Email</label>
              <input
                className="input w-full"
                type="email"
                required
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Password</label>
              <div className="relative">
                <input
                  className="input w-full pr-10"
                  type={showPw ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary py-3 mt-1">
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            No account?{' '}
            <Link to="/signup" className="text-brand-400 hover:underline">Get Started</Link>
          </p>

          <div className="mt-4 pt-4 border-t border-gray-800">
            <p className="text-xs text-gray-600 text-center mb-2">Demo credentials</p>
            <div className="text-xs text-gray-500 space-y-1">
              <p>User: <span className="text-gray-400">alex@example.com</span> / <span className="text-gray-400">password123</span></p>
              <p>Admin: <span className="text-gray-400">admin@concertbuddy.app</span> / <span className="text-gray-400">Admin1234!</span></p>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-gray-600 mt-4">
          <Link to="/" className="hover:text-gray-400">← Back to home</Link>
        </p>
      </div>
    </div>
  )
}
