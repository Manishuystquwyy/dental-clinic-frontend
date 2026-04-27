import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createRazorpayOrder, verifyRazorpayPayment } from '../api/payments'
import { clearPendingBooking, loadPendingBooking } from '../utils/bookingCheckout'
import { useAuth } from '../context/AuthContext'

function loadRazorpayScript() {
  if (window.Razorpay) return Promise.resolve(true)

  return new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export default function Checkout() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const pendingBooking = useMemo(() => loadPendingBooking(), [])
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handlePayment(event) {
    event.preventDefault()
    if (!pendingBooking) return

    setError('')
    setSubmitting(true)
    try {
      const scriptLoaded = await loadRazorpayScript()
      if (!scriptLoaded) {
        throw new Error('Unable to load Razorpay checkout. Please check your connection and try again.')
      }

      const order = await createRazorpayOrder({
        dentistId: Number(pendingBooking.doctor.id),
        appointmentDate: pendingBooking.date,
        appointmentTime: pendingBooking.time,
        remarks: pendingBooking.remarks || null,
      })

      const result = await new Promise((resolve, reject) => {
        const razorpay = new window.Razorpay({
          key: order.keyId,
          amount: order.amount,
          currency: order.currency,
          name: order.name,
          description: order.description,
          order_id: order.orderId,
          prefill: {
            name: user?.name || '',
            email: user?.email || '',
          },
          theme: {
            color: '#d06a3a',
          },
          handler: async (response) => {
            try {
              const appointment = await verifyRazorpayPayment({
                dentistId: Number(pendingBooking.doctor.id),
                appointmentDate: pendingBooking.date,
                appointmentTime: pendingBooking.time,
                remarks: pendingBooking.remarks || null,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              })
              resolve(appointment)
            } catch (verificationError) {
              reject(verificationError)
            }
          },
          modal: {
            ondismiss: () => reject(new Error('Payment was cancelled.')),
          },
        })

        razorpay.on('payment.failed', (failure) => {
          reject(new Error(failure.error?.description || 'Razorpay payment failed.'))
        })

        razorpay.open()
      })

      clearPendingBooking()
      alert('Payment successful. Your appointment is confirmed.')
      navigate('/appointments', { replace: true, state: { bookedAppointmentId: result?.id } })
    } catch (err) {
      setError(err.message || 'Payment failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!pendingBooking) {
    return (
      <section className="checkout-page">
        <div className="checkout-card">
          <h2>No Pending Booking</h2>
          <p>Select a doctor and time slot first, then continue to payment.</p>
          <Link to="/book" className="primary">Back to Booking</Link>
        </div>
      </section>
    )
  }

  const fee = Number(pendingBooking.doctor.consultationFees || 0)

  return (
    <section className="checkout-page">
      <div className="checkout-layout">
        <div className="checkout-card">
          <h2>Appointment Checkout</h2>
          <p>Review your booking and continue to Razorpay to complete the payment securely.</p>

          <div className="checkout-summary">
            <div>
              <span>Doctor</span>
              <strong>{pendingBooking.doctor.name}</strong>
            </div>
            <div>
              <span>Date</span>
              <strong>{pendingBooking.date}</strong>
            </div>
            <div>
              <span>Time</span>
              <strong>{pendingBooking.time}</strong>
            </div>
            <div>
              <span>Consultation Fee</span>
              <strong>₹ {fee}</strong>
            </div>
            {pendingBooking.remarks && (
              <div>
                <span>Notes</span>
                <strong>{pendingBooking.remarks}</strong>
              </div>
            )}
          </div>
        </div>

        <form className="checkout-card checkout-form" onSubmit={handlePayment}>
          <h3>Pay With Razorpay</h3>
          <div className="payment-options">
            <div className="payment-option active">
              <span>Cards, UPI, Net Banking, Wallets</span>
            </div>
          </div>

          {error && <p className="form-error">{error}</p>}

          <div className="checkout-total">
            <span>Total Payable</span>
            <strong>₹ {fee}</strong>
          </div>

          <button type="submit" className="primary" disabled={submitting}>
            {submitting ? 'Opening Razorpay...' : 'Pay With Razorpay'}
          </button>
          <Link to="/book" className="secondary">Change Booking</Link>
        </form>
      </div>
    </section>
  )
}
