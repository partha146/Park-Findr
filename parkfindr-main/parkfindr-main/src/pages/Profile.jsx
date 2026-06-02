import { useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import { formatCurrency } from '../utils/pricing'

const VEHICLE_TYPES = ['Car', 'Bike', 'SUV']

export default function Profile() {
  const { profile, logout, updateProfile } = useAuth()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    fullName: profile?.fullName || '',
    vehicleNumber: profile?.vehicleNumber || '',
    vehicleType: profile?.vehicleType || 'Car',
  })
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    setSaving(true)
    await updateProfile(form)
    setSaving(false)
    setEditing(false)
  }

  return (
    <Layout>
      <header className="bg-white px-4 pt-8 pb-6 border-b border-gray-100">
        <div className="w-14 h-14 rounded-full bg-primary-soft flex items-center justify-center text-lg font-semibold text-indigo-600 mb-3">
          {profile?.fullName?.[0]?.toUpperCase() || 'P'}
        </div>
        <h1 className="text-xl font-semibold text-gray-900">{profile?.fullName}</h1>
        <p className="text-gray-500 text-[13px] mt-0.5">{profile?.email}</p>
      </header>

      <div className="px-4 pt-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm shadow-gray-100/50">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-gray-900 text-[15px]">Vehicle details</h2>
            <button
              type="button"
              onClick={() => (editing ? handleSave() : setEditing(true))}
              disabled={saving}
              className="text-[13px] font-medium text-indigo-500"
            >
              {saving ? 'Saving…' : editing ? 'Save' : 'Edit'}
            </button>
          </div>

          {editing ? (
            <div className="space-y-3">
              <input
                value={form.fullName}
                onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                className="input-field text-sm"
                placeholder="Full name"
              />
              <input
                value={form.vehicleNumber}
                onChange={(e) => setForm((f) => ({ ...f, vehicleNumber: e.target.value }))}
                className="input-field text-sm"
                placeholder="Vehicle number"
              />
              <div className="flex gap-2">
                {VEHICLE_TYPES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, vehicleType: t }))}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-colors ${
                      form.vehicleType === t
                        ? 'border-indigo-200 bg-primary-soft text-indigo-600'
                        : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between text-[14px]">
                <span className="text-gray-500">Vehicle number</span>
                <span className="font-medium text-gray-900">{profile?.vehicleNumber}</span>
              </div>
              <div className="flex justify-between text-[14px]">
                <span className="text-gray-500">Vehicle type</span>
                <span className="font-medium text-gray-900">{profile?.vehicleType}</span>
              </div>
              <div className="flex justify-between text-[14px]">
                <span className="text-gray-500">Total spent</span>
                <span className="font-medium text-indigo-600">{formatCurrency(profile?.amountSpent ?? 0)}</span>
              </div>
            </div>
          )}
        </div>

        <Link
          to="/help"
          className="flex items-center justify-between mt-4 bg-white rounded-2xl border border-gray-100 p-4 shadow-sm shadow-gray-100/50"
        >
          <span className="font-medium text-gray-900 text-[15px]">Help & Support</span>
          <span className="text-gray-300 text-lg">›</span>
        </Link>

        <button
          type="button"
          onClick={logout}
          className="w-full mt-6 py-3 rounded-lg border border-gray-200 text-gray-600 font-medium text-[14px] hover:bg-gray-50 transition-colors"
        >
          Log out
        </button>
      </div>
    </Layout>
  )
}
