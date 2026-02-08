import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import AppointmentForm from '../components/AppointmentForm'
import { getDentist } from '../api/dentists'
import DatePicker from '../components/DatePicker'

export default function DoctorProfile() {
  const { id } = useParams()
  const [doc, setDoc] = useState(null)
  const [error, setError] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [booked, setBooked] = useState(null)
  const today = new Date().toISOString().split('T')[0]

  const timeSlots = ['09:00', '10:30', '12:00', '14:00', '15:30', '17:00']

  useEffect(() => {
    let active = true
    getDentist(id)
      .then((data) => {
        if (active) setDoc(data)
      })
      .catch((err) => {
        if (active) setError(err.message || 'Doctor not found.')
      })
    return () => {
      active = false
    }
  }, [id])

  if (error) return <p>{error}</p>
  if (!doc) return <p>Loading...</p>

  return (
    <section className="doctor-profile">
      <div className="bio">
        <h2>{doc.name}</h2>
        <p><strong>Experience:</strong> {doc.experienceYears} years</p>
        <p><strong>Phone:</strong> {doc.phone}</p>
        <p><strong>Email:</strong> {doc.email}</p>
        <hr />
        <h3>Availability</h3>
        <div>
          <DatePicker
            label="Choose date"
            minDate={today}
            value={date}
            onChange={(val) => { setDate(val); setTime(''); setBooked(null) }}
          />
          {date && (
            <div style={{ marginTop: 12 }}>
              <p>Available times:</p>
              <div className="times">
                {timeSlots.map((t) => (
                  <button key={t} onClick={() => { setTime(t); setBooked(null) }} className={t === time ? 'active' : ''}>{t}</button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
        {!date && <p>Select a slot to book.</p>}
        {date && time && !booked && (
          <AppointmentForm doctor={doc} date={date} time={time} onBooked={setBooked} />
        )}

        {booked && (
          <div className="booking-confirm">
            <h4>Appointment booked</h4>
            <p>{booked.appointmentDate} at {booked.appointmentTime} with {doc.name}</p>
          </div>
        )}
      </div>
    </section>
  )
}
