import { useEffect, useState } from 'react'
import { OFFERS } from '../data/locations'

export default function OfferCarousel() {
  const [index, setIndex] = useState(0)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % OFFERS.length)
      setCopied(false)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const offer = OFFERS[index]

  async function copyCode(code) {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div>
      <div
        key={offer.id}
        className={`relative overflow-hidden rounded-2xl border border-white/60 bg-gradient-to-br ${offer.gradient} p-4 min-h-[118px] shadow-sm`}
        style={{ animation: 'fadeIn 0.35s ease' }}
      >
        <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/30 blur-2xl" />
        <div className="relative">
          <p className={`text-[15px] font-bold tracking-tight ${offer.accent}`}>{offer.title}</p>
          <p className="text-[12px] text-gray-600/90 mt-1 leading-relaxed max-w-[90%]">{offer.subtitle}</p>

          {offer.code && (
            <button
              type="button"
              onClick={() => copyCode(offer.code)}
              className="mt-3 flex items-center gap-2 group text-left"
            >
              <span
                className={`text-[11px] font-semibold tracking-wide px-2.5 py-1 rounded-lg border ${offer.chipClass}`}
              >
                {offer.code}
              </span>
              <span className="text-[10px] text-gray-500 group-hover:text-gray-600 transition-colors">
                {copied ? 'Copied!' : 'Tap to copy'}
              </span>
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-1 mt-2.5 justify-center">
        {OFFERS.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Offer ${i + 1}`}
            onClick={() => {
              setIndex(i)
              setCopied(false)
            }}
            className={`rounded-full transition-all duration-300 ${
              i === index ? 'w-3 h-1 bg-indigo-300/80' : 'w-1 h-1 bg-gray-300/70'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
