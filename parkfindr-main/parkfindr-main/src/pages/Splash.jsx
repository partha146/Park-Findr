import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Splash() {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => navigate('/login'), 2000)
    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafafa] px-6">
      <div className="w-16 h-16 rounded-2xl bg-primary-soft flex items-center justify-center mb-6">
        <svg className="w-8 h-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7h4a3 3 0 010 6H9M5 21h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      </div>
      <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">ParkFindr</h1>
      <p className="text-gray-500 text-[15px] mt-2 text-center font-medium">Park Smart. Park Easy.</p>
      <p className="text-gray-400 text-xs mt-10">Bengaluru, India</p>
    </div>
  )
}
