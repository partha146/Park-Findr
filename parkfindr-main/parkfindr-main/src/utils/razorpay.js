const RAZORPAY_SCRIPT = 'https://checkout.razorpay.com/v1/checkout.js'

export function loadRazorpayScript() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve(true)
      return
    }
    const script = document.createElement('script')
    script.src = RAZORPAY_SCRIPT
    script.onload = () => resolve(true)
    script.onerror = () => reject(new Error('Failed to load Razorpay'))
    document.body.appendChild(script)
  })
}

export async function initiateRazorpayPayment({ amount, name, email, description, onSuccess, onFailure }) {
  const key = import.meta.env.VITE_RAZORPAY_KEY_ID
  if (!key) {
    throw new Error('Razorpay key not configured. Add VITE_RAZORPAY_KEY_ID to .env')
  }

  await loadRazorpayScript()

  const options = {
    key,
    amount: Math.round(amount * 100),
    currency: 'INR',
    name: 'ParkFindr',
    description: description || 'Parking payment',
    prefill: { name, email },
    theme: { color: '#5B6CF0' },
    handler: (response) => {
      onSuccess?.(response)
    },
    modal: {
      ondismiss: () => onFailure?.(new Error('Payment cancelled')),
    },
  }

  const rzp = new window.Razorpay(options)
  rzp.on('payment.failed', (response) => {
    onFailure?.(new Error(response.error?.description || 'Payment failed'))
  })
  rzp.open()
}
