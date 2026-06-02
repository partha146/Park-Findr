import { useState } from 'react'
import Layout from '../components/Layout'
import PageHeader from '../components/PageHeader'

const CATEGORIES = ['Payment Issue', 'Slot Problem', 'App Bug', 'Account', 'Other']

export default function Help() {
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    const subject = encodeURIComponent(`ParkFindr Support - ${category}`)
    const body = encodeURIComponent(description)
    window.location.href = `mailto:support@parkfindr.in?subject=${subject}&body=${body}`
    setSubmitted(true)
  }

  return (
    <Layout showNav={false}>
      <PageHeader title="Help & Support" backTo="/profile" />

      <form onSubmit={handleSubmit} className="px-4 py-6 space-y-4">
        {submitted && (
          <div className="bg-emerald-50 text-emerald-700 border border-emerald-100 p-4 rounded-lg text-[13px] font-medium text-center">
            Opening email to support@parkfindr.in…
          </div>
        )}

        <div>
          <label className="text-[13px] font-medium text-gray-600">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input-field mt-1.5"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[13px] font-medium text-gray-600">Describe your issue</label>
          <textarea
            required
            rows={6}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tell us what happened..."
            className="input-field mt-1.5 resize-none"
          />
        </div>

        <button type="submit" className="btn-primary">
          Submit
        </button>

        <p className="text-center text-xs text-gray-400">
          Submissions are sent to{' '}
          <a href="mailto:support@parkfindr.in" className="text-indigo-500 font-medium">
            support@parkfindr.in
          </a>
        </p>
      </form>
    </Layout>
  )
}
