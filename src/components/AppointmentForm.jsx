import React, { useState } from 'react'

function saveAppointment(appt) {
  const key = 'gayatri_appointments'
  const existing = JSON.parse(localStorage.getItem(key) || '[]')
  existing.push(appt)
  localStorage.setItem(key, JSON.stringify(existing))
}

export default function AppointmentForm({ doctor, date, time, onBooked }) {
  const [patientName, setPatientName] = useState('')
  const [phone, setPhone] = useState('')

  function submit(e) {
    e.preventDefault()
    const appt = {
      id: 'appt_' + Date.now(),
      doctorId: doctor.id,
      doctorName: doctor.name,
      date,
      time,
      patientName,
      phone,
      status: 'CONFIRMED'
    }
    saveAppointment(appt)
    onBooked(appt)
    // simulate notification
    setTimeout(() => alert('Appointment confirmed — a confirmation was sent.'), 200)
  }

  return (
    <form className="appointment-form" onSubmit={submit}>
      <h4>Booking for {doctor.name}</h4>
      <p>{date} at {time}</p>
      <label>
        Your name
        <input value={patientName} onChange={(e) => setPatientName(e.target.value)} required />
      </label>
      <label>
        Phone
        <input value={phone} onChange={(e) => setPhone(e.target.value)} required />
      </label>
      <button type="submit" className="primary">Confirm Appointment</button>
    </form>
  )
}
