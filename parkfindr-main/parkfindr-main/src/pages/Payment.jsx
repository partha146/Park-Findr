import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import { useParking } from '../context/ParkingContext'
import { applyCoupon, formatCurrency } from '../utils/pricing'

const METHODS = [
  { id: 'upi', label: 'UPI', icon: '📱' },
  { id: 'card', label: 'Card', icon: '💳' },
  { id: 'cash', label: 'Cash', icon: '💵' },
]

function ModalShell({ modalType, amount, onClose, children }) {
  if (!modalType) return null
  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/20">
      <div className="w-full max-w-[430px] rounded-t-[40px] bg-white border-t border-gray-100 shadow-[0_-12px_40px_rgba(0,0,0,0.12)] px-4 pt-4 pb-6">
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="text-[13px] font-medium text-gray-600">
              {modalType === 'upi' ? 'UPI payment' : 'Card payment'}
            </p>
            <p className="text-[18px] font-semibold text-gray-900 mt-0.5">{formatCurrency(amount)}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-9 h-9 rounded-full border border-gray-200 text-gray-500 flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export default function Payment() {
  const { pendingBilling, completePayment } = useParking()
  const { profile } = useAuth()
  const navigate = useNavigate()
  const [method, setMethod] = useState('upi')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [modalType, setModalType] = useState(null) // 'upi' | 'card' | null
  const [modalLoading, setModalLoading] = useState(false)
  const [modalError, setModalError] = useState('')

  // UPI
  const [upiMobile, setUpiMobile] = useState('')

  // Card
  const [cardNumber, setCardNumber] = useState('')
  const [cardholderName, setCardholderName] = useState('')
  const [expiry, setExpiry] = useState('') // MM/YY
  const [cvv, setCvv] = useState('')

  if (!pendingBilling) {
    navigate('/home')
    return null
  }

  const coupon = pendingBilling.couponCode
  const { finalTotal } = applyCoupon(pendingBilling.totalAmount, coupon)
  const amount = pendingBilling.finalTotal ?? finalTotal

  const upiValid = useMemo(() => /^[6-9]\d{9}$/.test(upiMobile), [upiMobile])

  const cardDigits = useMemo(() => cardNumber.replace(/\s/g, ''), [cardNumber])
  const cardValid = useMemo(() => {
    const cardOk = /^\d{16}$/.test(cardDigits)
    const nameOk = cardholderName.trim().length > 0

    const expDigits = expiry.replace(/\D/g, '')
    const expOkFormat = expDigits.length === 4
    let expOkDate = false
    if (expOkFormat) {
      const mm = parseInt(expDigits.slice(0, 2), 10)
      const yy = parseInt(expDigits.slice(2, 4), 10)
      if (mm >= 1 && mm <= 12) {
        const year = 2000 + yy
        const endOfMonth = new Date(year, mm, 0, 23, 59, 59)
        expOkDate = endOfMonth.getTime() > Date.now()
      }
    }

    const cvvOk = /^\d{3,4}$/.test(cvv)
    return cardOk && nameOk && expOkFormat && expOkDate && cvvOk
  }, [cardDigits, cardholderName, expiry, cvv])

  async function handlePay() {
    setLoading(true)
    setError('')

    try {
      if (method === 'cash') {
        const paid = await completePayment('cash', amount)
        navigate('/payment-success', { state: { session: paid, amount } })
        return
      }
      setLoading(false)

      // Open modal-based flows (UPI & Card)
      if (method === 'upi') {
        setModalType('upi')
        setModalError('')
        setModalLoading(false)
        setUpiMobile('')
        return
      }
      if (method === 'card') {
        setModalType('card')
        setModalError('')
        setModalLoading(false)
        setCardNumber('')
        setCardholderName('')
        setExpiry('')
        setCvv('')
        return
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function closeModal() {
    setModalType(null)
    setModalLoading(false)
    setModalError('')
  }

  async function submitUpi() {
    setModalError('')
    if (!upiValid) {
      setModalError('Enter a valid 10-digit mobile number starting with 6-9.')
      return
    }

    setModalLoading(true)
    try {
      await new Promise((r) => setTimeout(r, 1500))
      closeModal()
      const paid = await completePayment('UPI', amount)
      navigate('/payment-success', {
        state: {
          session: paid,
          amount,
          message: `Payment link sent to +91${upiMobile}. Transaction complete.`,
        },
      })
    } catch (err) {
      setModalLoading(false)
      setModalError(err.message || 'UPI payment failed')
    }
  }

  function formatCardNumberInput(raw) {
    const digits = raw.replace(/\D/g, '').slice(0, 16)
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ')
  }

  function formatExpiryInput(raw) {
    const digits = raw.replace(/\D/g, '').slice(0, 4)
    const mm = digits.slice(0, 2)
    const yy = digits.slice(2, 4)
    if (digits.length <= 2) return mm
    return `${mm}/${yy}`
  }

  async function submitCard() {
    setModalError('')
    if (!cardValid) {
      setModalError('Please check card details. Ensure card number, expiry, and CVV are valid.')
      return
    }

    setModalLoading(true)
    try {
      await new Promise((r) => setTimeout(r, 2000))
      closeModal()
      const paid = await completePayment('Card', amount)
      navigate('/payment-success', {
        state: {
          session: paid,
          amount,
          message: `Payment of ${formatCurrency(amount)} successful. Transaction complete.`,
        },
      })
    } catch (err) {
      setModalLoading(false)
      setModalError(err.message || 'Card payment failed')
    }
  }

  return (
    <Layout showNav={false}>
      <header className="page-header">
        <h1 className="page-title">Payment</h1>
        <p className="text-2xl font-semibold text-indigo-600 mt-2">{formatCurrency(amount)}</p>
        <p className="text-[13px] text-gray-500 mt-0.5">
          {pendingBilling.locationName} · {pendingBilling.slotId}
        </p>
      </header>

      <div className="px-4 py-6">
        {error && (
          <p className="text-[13px] text-red-600 bg-red-50 border border-red-100 p-3 rounded-lg mb-4">{error}</p>
        )}

        <p className="text-[13px] font-medium text-gray-600 mb-3">Select payment method</p>
        <div className="space-y-2.5">
          {METHODS.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMethod(m.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-colors ${
                method === m.id ? 'border-indigo-200 bg-primary-soft' : 'border-gray-100 bg-white'
              }`}
            >
              <span className="text-xl">{m.icon}</span>
              <span className="font-medium text-gray-900 text-[15px]">{m.label}</span>
              {method === m.id && (
                <span className="ml-auto w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              )}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handlePay}
          disabled={loading}
          className="btn-primary py-4 mt-8 flex items-center justify-center gap-2"
        >
          {loading && (
            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          )}
          {loading ? 'Processing…' : 'Pay now'}
        </button>

        <button
          type="button"
          onClick={() => navigate('/billing')}
          className="w-full py-3 text-gray-500 text-[13px] font-medium mt-2"
        >
          Back to billing
        </button>
      </div>

      <ModalShell modalType={modalType} amount={amount} onClose={closeModal}>
        {modalType === 'upi' ? (
          <div className="space-y-4">
            {modalError && <p className="text-[13px] text-red-600 bg-red-50 border border-red-100 px-4 py-3 rounded-lg">{modalError}</p>}

            <div>
              <label className="text-[13px] font-medium text-gray-600">Enter UPI-linked mobile number</label>
              <input
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={10}
                value={upiMobile}
                onChange={(e) => setUpiMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="10 digits (6-9...)"
                className="input-field mt-2"
              />
              <p className="text-[12px] text-gray-500 mt-2">We’ll send a payment link to your mobile.</p>
            </div>

            <button
              type="button"
              onClick={submitUpi}
              disabled={modalLoading}
              className="w-full py-4 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 font-semibold text-[15px] disabled:opacity-60"
            >
              {modalLoading ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-indigo-300 border-t-indigo-700 rounded-full animate-spin" />
                  Sending…
                </span>
              ) : (
                'Send Payment Link'
              )}
            </button>
          </div>
        ) : null}

        {modalType === 'card' ? (
          <div className="space-y-4">
            {modalError && <p className="text-[13px] text-red-600 bg-red-50 border border-red-100 px-4 py-3 rounded-lg">{modalError}</p>}

            <div>
              <label className="text-[13px] font-medium text-gray-600">Card Number</label>
              <input
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumberInput(e.target.value))}
                placeholder="XXXX XXXX XXXX XXXX"
                inputMode="numeric"
                className="input-field mt-2 font-mono tracking-widest"
              />
            </div>

            <div>
              <label className="text-[13px] font-medium text-gray-600">Cardholder Name</label>
              <input
                value={cardholderName}
                onChange={(e) => setCardholderName(e.target.value)}
                placeholder="Name on card"
                className="input-field mt-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[13px] font-medium text-gray-600">Expiry</label>
                <input
                  value={expiry}
                  onChange={(e) => setExpiry(formatExpiryInput(e.target.value))}
                  placeholder="MM/YY"
                  inputMode="numeric"
                  className="input-field mt-2"
                  maxLength={5}
                />
              </div>
              <div>
                <label className="text-[13px] font-medium text-gray-600">CVV</label>
                <input
                  type="password"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="•••"
                  inputMode="numeric"
                  className="input-field mt-2 font-mono"
                  maxLength={4}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={submitCard}
              disabled={modalLoading}
              className="w-full py-4 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 font-semibold text-[15px] disabled:opacity-60"
            >
              {modalLoading ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-indigo-300 border-t-indigo-700 rounded-full animate-spin" />
                  Processing…
                </span>
              ) : (
                `Pay ${formatCurrency(amount)}`
              )}
            </button>
          </div>
        ) : null}
      </ModalShell>
    </Layout>
  )
}
