import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { AuthField, AuthFooterLink, AuthLogo, AuthPage } from '../components/AuthShell'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, isAuthenticated, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!authLoading && isAuthenticated) navigate('/home', { replace: true })
  }, [authLoading, isAuthenticated, navigate])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/home')
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthPage>
      <AuthLogo />

      <div className="mb-7 text-center px-2">
        <h2 className="text-xl font-semibold text-gray-900 tracking-tight">Welcome back</h2>
        <p className="text-gray-500 text-[14px] mt-1.5">Sign in to continue parking in Bengaluru</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 flex-1 w-full max-w-[320px] mx-auto">
        {error && (
          <p className="text-[13px] text-red-600 bg-red-50 border border-red-100 px-4 py-3 rounded-lg">
            {error}
          </p>
        )}

        <AuthField label="Email">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            placeholder="you@email.com"
            autoComplete="email"
          />
        </AuthField>

        <AuthField label="Password">
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
            placeholder="Enter your password"
            autoComplete="current-password"
          />
        </AuthField>

        <button type="submit" disabled={loading} className="btn-primary mt-2">
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <AuthFooterLink text="Don't have an account?" linkText="Create one" to="/signup" />
    </AuthPage>
  )
}
