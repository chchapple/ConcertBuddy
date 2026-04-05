const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
  return data
}

// ── Events ────────────────────────────────────────────────────────────────
export const getEvents = (params = {}) => {
  const qs = new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter(([, v]) => v))
  ).toString()
  return request(`/api/events${qs ? `?${qs}` : ''}`)
}

export const getEvent = (id) => request(`/api/events/${id}`)

export const getEventAttendees = (id) => request(`/api/events/${id}/attendees`)

// ── Profiles ──────────────────────────────────────────────────────────────
export const getProfile = (id) => request(`/api/profiles/${id}`)

export const createProfile = (body) => request('/api/profiles', { method: 'POST', body })

export const updateProfile = (id, body) => request(`/api/profiles/${id}`, { method: 'PATCH', body })

// ── Attendance ────────────────────────────────────────────────────────────
export const getAttendance = (params = {}) => {
  const qs = new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter(([, v]) => v))
  ).toString()
  return request(`/api/attendance${qs ? `?${qs}` : ''}`)
}

export const registerAttendance = (body) => request('/api/attendance', { method: 'POST', body })

// ── Matches ───────────────────────────────────────────────────────────────
export const getMatches = (userId) => request(`/api/matches?user_id=${userId}`)

export const swipe = (body) => request('/api/matches/swipe', { method: 'POST', body })

export const unmatch = (matchId) => request(`/api/matches/${matchId}/unmatch`, { method: 'PATCH' })

// ── Messages ──────────────────────────────────────────────────────────────
export const getMessages = (matchId) => request(`/api/messages?match_id=${matchId}`)

export const sendMessage = (body) => request('/api/messages', { method: 'POST', body })

// ── Reports ───────────────────────────────────────────────────────────────
export const getReports = (params = {}) => {
  const qs = new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== ''))
  ).toString()
  return request(`/api/reports${qs ? `?${qs}` : ''}`)
}

export const submitReport = (body) => request('/api/reports', { method: 'POST', body })

export const reviewReport = (id) => request(`/api/reports/${id}/review`, { method: 'PATCH' })
