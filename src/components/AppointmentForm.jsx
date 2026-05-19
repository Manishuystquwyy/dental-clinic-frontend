import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { createPublicRequest } from '../api/publicRequests'
import { useAuth } from '../context/AuthContext'
import { savePendingBooking } from '../utils/bookingCheckout'

export default function AppointmentForm({ doctor, date, time }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [remarks, setRemarks] = useState('')
  const [guestName, setGuestName] = useState('')
  const [guestPhone, setGuestPhone] = useState('')
  const [guestMessage, setGuestMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function submit(e) {
    e.preventDefault()
    if (!user) return
    setSubmitting(true)
    setError('')
    savePendingBooking({
      doctor: {
        id: doctor.id,
        name: doctor.name,
        consultationFees: doctor.consultationFees,
      },
      date,
      time,
      remarks: remarks || '',
    })
    navigate('/checkout')
  }

  if (!user) {
    async function submitGuestRequest(event) {
      event.preventDefault()
      setError('')
      setSubmitting(true)

      try {
        const bookingSummary = `Booking request for ${doctor.name} on ${date} at ${time}.`
        await createPublicRequest({
          name: guestName,
          phone: guestPhone,
          message: guestMessage ? `${bookingSummary}\n\n${guestMessage}` : bookingSummary,
          requestType: 'BOOKING',
        })
        setGuestName('')
        setGuestPhone('')
        setGuestMessage('')
        alert('Your booking request has been sent. We will contact you shortly.')
      } catch (err) {
        setError(err.message || 'Unable to send booking request.')
      } finally {
        setSubmitting(false)
      }
    }

    return (
      <form className="appointment-form" onSubmit={submitGuestRequest}>
        <h4>Send Booking Request</h4>
        <p>{doctor.name} on {date} at {time}</p>
        <label>
          Name
          <input value={guestName} onChange={(e) => setGuestName(e.target.value)} required />
        </label>
        <label>
          Phone
          <input value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)} required />
        </label>
        <label>
          Message
          <textarea
            value={guestMessage}
            onChange={(e) => setGuestMessage(e.target.value)}
            placeholder="Add any notes for the clinic"
          />
        </label>
        {error && <p className="form-error">{error}</p>}
        <button type="submit" className="primary" disabled={submitting}>
          {submitting ? 'Sending...' : 'Send Request'}
        </button>
        <button
          type="button"
          className="secondary"
          onClick={() => {
            savePendingBooking({
              doctor: {
                id: doctor.id,
                name: doctor.name,
                consultationFees: doctor.consultationFees,
              },
              date,
              time,
              remarks: '',
            })
            navigate('/login', { state: { from: { pathname: '/checkout' }, bookingSource: location.pathname } })
          }}
        >
          Login to Book Instantly
        </button>
      </form>
    )
  }

  return (
    <form className="appointment-form" onSubmit={submit}>
      <h4>Booking for {doctor.name}</h4>
      <p>{date} at {time}</p>
      <p>Consultation fee: ₹ {doctor.consultationFees ?? 0}</p>
      <label>
        Notes (optional)
        <input value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="Any concerns or requests" />
      </label>
      {error && <p className="form-error">{error}</p>}
      <button type="submit" className="primary" disabled={submitting}>
        {submitting ? 'Redirecting...' : 'Proceed to Payment'}
      </button>
    </form>
  )
}
