import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { createAppointment } from '../api/appointments'
import { createPublicRequest } from '../api/publicRequests'
import { useAuth } from '../context/AuthContext'

export default function AppointmentForm({ doctor, date, time, onBooked }) {
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
    setError('')
    setSubmitting(true)
    try {
      const appt = await createAppointment({
        patientId: Number(user.patientId),
        dentistId: Number(doctor.id),
        appointmentDate: date,
        appointmentTime: time,
        status: 'BOOKED',
        remarks: remarks || null,
      })
      onBooked(appt)
      setTimeout(() => alert('Appointment confirmed — a confirmation was sent.'), 200)
    } catch (err) {
      setError(err.message || 'Booking failed.')
    } finally {
      setSubmitting(false)
    }
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
          onClick={() => navigate('/login', { state: { from: location } })}
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
      <label>
        Notes (optional)
        <input value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="Any concerns or requests" />
      </label>
      {error && <p className="form-error">{error}</p>}
      <button type="submit" className="primary" disabled={submitting}>
        {submitting ? 'Booking...' : 'Confirm Appointment'}
      </button>
    </form>
  )
}
