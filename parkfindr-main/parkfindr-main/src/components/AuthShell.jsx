import { Link } from 'react-router-dom'

export function AuthPage({ children }) {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="w-full max-w-[430px] mx-auto min-h-screen px-8 py-12 flex flex-col">
        {children}
      </div>
    </div>
  )
}

export function AuthLogo() {
  return (
    <div className="flex flex-col items-center mb-8">
      <div className="w-12 h-12 rounded-xl bg-primary-soft flex items-center justify-center mb-4">
        <svg className="w-6 h-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7h4a3 3 0 010 6H9M5 21h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      </div>
      <h1 className="text-[26px] font-semibold text-gray-900 tracking-tight">ParkFindr</h1>
    </div>
  )
}

export function AuthField({ label, children }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[13px] font-medium text-gray-600">{label}</label>
      {children}
    </div>
  )
}

export function AuthFooterLink({ text, linkText, to }) {
  return (
    <p className="text-center text-[14px] text-gray-500 mt-auto pt-8">
      {text}{' '}
      <Link to={to} className="text-indigo-500 font-medium hover:text-indigo-600">
        {linkText}
      </Link>
    </p>
  )
}
