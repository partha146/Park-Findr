import { Link } from 'react-router-dom'
import LocationCard from './LocationCard'
import { CATEGORY_SECTION_STYLES } from '../data/locations'

export default function SectionScroll({ title, categoryId, locations }) {
  const style = CATEGORY_SECTION_STYLES[categoryId] || CATEGORY_SECTION_STYLES.malls

  return (
    <section className="mb-5 mx-3 rounded-2xl overflow-hidden border border-gray-100/80">
      <div
        className={`flex items-center justify-between px-4 py-3 border-b ${style.bg} ${style.border}`}
      >
        <h2 className={`text-[15px] font-semibold ${style.title}`}>{title}</h2>
        <Link to={`/search?category=${categoryId}`} className="text-[13px] font-medium text-indigo-500">
          View all
        </Link>
      </div>
      <div className={`flex gap-3 overflow-x-auto hide-scrollbar px-4 py-3 ${style.bg}`}>
        {locations.map((loc) => (
          <LocationCard key={loc.id} location={loc} />
        ))}
      </div>
    </section>
  )
}
