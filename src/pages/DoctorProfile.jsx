import { useState } from 'react'
import { useParams } from 'react-router-dom'
import doctorsData from '../data/doctors.json'
import AppointmentForm from '../components/AppointmentForm'

export default function DoctorProfile() {
  const { id } = useParams()
  const doc = doctorsData.find(d => d.id === id)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [booked, setBooked] = useState(null)

  if (!doc) return <p>Doctor not found</p>

  return (
    <section className="doctor-profile">
      <div className="bio">
        <h2>{doc.name}</h2>
        <p><strong>Specialization:</strong> {doc.specialization}</p>
        <p><strong>Experience:</strong> {doc.experience}</p>
        <hr />
        <h3>Availability</h3>
        <div>
          {Object.keys(doc.availableSlots).map(d => (
            <div key={d} style={{ marginBottom: 8 }}>
              <strong>{d}</strong>
              <div style={{ marginTop: 6 }}>
                {doc.availableSlots[d].map(t => (
                  <button key={t} onClick={() => { setDate(d); setTime(t); setBooked(null) }} style={{ marginRight: 6, marginBottom:6 }} className={t === time ? 'active' : ''}>{t}</button>
                ))}
              </div>
            </div>
          ))}
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
            <p>{booked.patientName} — {booked.date} at {booked.time} with {booked.doctorName}</p>
          </div>
        )}
      </div>
    </section>
  )
}
