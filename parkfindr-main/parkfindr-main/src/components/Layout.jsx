import BottomNav from './BottomNav'

export default function Layout({ children, showNav = true, className = '' }) {
  return (
    <div className="min-h-screen bg-[#f7f7f8]">
      <div className={`mx-auto w-full max-w-[430px] min-h-screen ${showNav ? 'pb-32' : ''} ${className}`}>
        {children}
      </div>
      {showNav && <BottomNav />}
    </div>
  )
}
