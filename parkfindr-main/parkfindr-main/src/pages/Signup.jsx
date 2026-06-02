import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { AuthField, AuthFooterLink, AuthLogo, AuthPage } from '../components/AuthShell'

const VEHICLE_TYPES = ['Car', 'Bike', 'SUV']

export default function Signup() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    vehicleNumber: '',
    vehicleType: 'Car',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signup } = useAuth()
  const navigate = useNavigate()

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signup(form)
      navigate('/home')
    } catch (err) {
      setError(err.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthPage>
      <AuthLogo />

      <div className="mb-6 px-2">
        <h2 className="text-xl font-semibold text-gray-900 tracking-tight">Create your account</h2>
        <p className="text-gray-500 text-[14px] mt-1.5">Start finding parking across Bengaluru</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 flex-1 w-full max-w-[320px] mx-auto">
        {error && (
          <p className="text-[13px] text-red-600 bg-red-50 border border-red-100 px-4 py-3 rounded-lg">
            {error}
          </p>
        )}

        {[
          { key: 'fullName', label: 'Full name', type: 'text', placeholder: 'Your name' },
          { key: 'email', label: 'Email', type: 'email', placeholder: 'you@email.com' },
          { key: 'password', label: 'Password', type: 'password', placeholder: 'At least 6 characters' },
          { key: 'vehicleNumber', label: 'Vehicle number', type: 'text', placeholder: 'KA01AB1234' },
        ].map(({ key, label, type, placeholder }) => (
          <AuthField key={key} label={label}>
            <input
              type={type}
              required
              minLength={key === 'password' ? 6 : undefined}
              value={form[key]}
              onChange={(e) => update(key, e.target.value)}
              className="input-field"
              placeholder={placeholder}
            />
          </AuthField>
        ))}

        <AuthField label="Vehicle type">
          <div className="flex gap-2">
            {VEHICLE_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => update('vehicleType', type)}
                className={`flex-1 py-2.5 rounded-lg text-[13px] font-medium border transition-colors ${
                  form.vehicleType === type
                    ? 'border-indigo-200 bg-primary-soft text-indigo-600'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </AuthField>

        <button type="submit" disabled={loading} className="btn-primary mt-3">
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <AuthFooterLink text="Already have an account?" linkText="Sign in" to="/login" />
    </AuthPage>
  )
}
