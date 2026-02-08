import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { createAppointment } from '../api/appointments'
import { useAuth } from '../context/AuthContext'

export default function AppointmentForm({ doctor, date, time, onBooked }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [remarks, setRemarks] = useState('')
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
    return (
      <div className="appointment-form">
        <p>Please login or sign up to book an appointment.</p>
        <button className="primary" onClick={() => navigate('/login', { state: { from: location } })}>
          Login to Book
        </button>
      </div>
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
