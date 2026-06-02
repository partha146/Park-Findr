import { Link } from 'react-router-dom'

export default function PageHeader({ title, subtitle, backTo, backLabel = '← Back' }) {
  return (
    <header className="page-header">
      {backTo && (
        <Link to={backTo} className="text-[13px] text-gray-500 hover:text-gray-700 mb-2 inline-block">
          {backLabel}
        </Link>
      )}
      <h1 className="page-title">{title}</h1>
      {subtitle && <p className="text-[13px] text-gray-500 mt-0.5">{subtitle}</p>}
    </header>
  )
}
