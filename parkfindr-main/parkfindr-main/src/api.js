// Central API base URL
// In dev: reads from .env  →  VITE_API_URL=http://192.168.x.x:3001
// Falls back to localhost for laptop testing
export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001'

async function request(method, path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Request failed')
  return data
}

// Auth
export const api = {
  signup: (body) => request('POST', '/api/auth/signup', body),
  login:  (body) => request('POST', '/api/auth/login', body),
  getProfile: (userId) => request('GET', `/api/auth/profile/${userId}`),
  updateProfile: (userId, body) => request('PATCH', `/api/auth/profile/${userId}`, body),

  // Sessions
  startSession:    (body)   => request('POST', '/api/sessions', body),
  getActiveSession: (userId) => request('GET', `/api/sessions/active/${userId}`),
  getHistory:      (userId) => request('GET', `/api/sessions/history/${userId}`),
  endSession:      (id, body) => request('PATCH', `/api/sessions/${id}/end`, body),
  paySession:      (id, body) => request('PATCH', `/api/sessions/${id}/pay`, body),
  getOccupied:     (locationId) => request('GET', `/api/sessions/occupied/${locationId}`),
}
