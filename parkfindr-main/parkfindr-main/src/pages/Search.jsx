import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Layout from '../components/Layout'
import LocationCard from '../components/LocationCard'
import { CATEGORIES, LOCATIONS } from '../data/locations'

export default function Search() {
  const [searchParams] = useSearchParams()
  const categoryFilter = searchParams.get('category')
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState(categoryFilter || 'all')

  const filtered = useMemo(() => {
    return LOCATIONS.filter((loc) => {
      const matchesCategory = activeCategory === 'all' || loc.category === activeCategory
      const q = query.toLowerCase()
      const matchesQuery =
        !q ||
        loc.name.toLowerCase().includes(q) ||
        loc.area.toLowerCase().includes(q) ||
        loc.category.toLowerCase().includes(q)
      return matchesCategory && matchesQuery
    })
  }, [query, activeCategory])

  return (
    <Layout>
      <header className="px-4 pt-6 pb-4 bg-white sticky top-0 z-10 border-b border-gray-100">
        <h1 className="page-title mb-4">Search Parking</h1>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search malls, hospitals, hotels..."
          className="input-field text-sm"
        />
        <div className="flex gap-2 overflow-x-auto hide-scrollbar mt-3 pb-1">
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeCategory === 'all' ? 'bg-primary-soft text-indigo-600' : 'bg-gray-100 text-gray-600'
            }`}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeCategory === cat.id ? 'bg-primary-soft text-indigo-600' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {cat.label.replace('Popular ', '').replace('Nearby ', '').replace('Top ', '')}
            </button>
          ))}
        </div>
      </header>

      <div className="px-4 py-4 grid grid-cols-2 gap-3">
        {filtered.length === 0 ? (
          <p className="col-span-2 text-center text-gray-500 py-12 text-sm">No locations found</p>
        ) : (
          filtered.map((loc) => <LocationCard key={loc.id} location={loc} compact />)
        )}
      </div>
    </Layout>
  )
}
