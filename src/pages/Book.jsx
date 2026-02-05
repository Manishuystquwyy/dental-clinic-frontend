import { useState } from 'react'
import doctorsData from '../data/doctors.json'
import DoctorCard from '../components/DoctorCard'
import AppointmentForm from '../components/AppointmentForm'

export default function Book() {
  const [doctors] = useState(doctorsData)
  const [selected, setSelected] = useState(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [booked, setBooked] = useState(null)

  function handleSelect(doc) {
    setSelected(doc)
    setSelectedDate('')
    setSelectedTime('')
    setBooked(null)
  }

  function handleBooked(appt) {
    setBooked(appt)
  }

  return (
    <section className="book-page">
      <h2>Book Appointment</h2>
      <div className="booking-grid">
        <div className="doctors-list">
          {doctors.map((d) => (
            <DoctorCard key={d.id} doctor={d} onSelect={handleSelect} />
          ))}
        </div>

        <div className="booking-panel">
          {!selected && <p>Select a doctor to see availability.</p>}

          {selected && (
            <div>
              <h3>{selected.name} — {selected.specialization}</h3>
              <label>
                Choose date
                <select value={selectedDate} onChange={(e) => { setSelectedDate(e.target.value); setSelectedTime('') }}>
                  <option value="">-- select date --</option>
                  {Object.keys(selected.availableSlots).map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </label>

              {selectedDate && (
                <div>
                  <p>Available times:</p>
                  <div className="times">
                    {selected.availableSlots[selectedDate].map((t) => (
                      <button key={t} className={t === selectedTime ? 'active' : ''} onClick={() => setSelectedTime(t)}>{t}</button>
                    ))}
                  </div>
                </div>
              )}

              {selectedDate && selectedTime && !booked && (
                <AppointmentForm doctor={selected} date={selectedDate} time={selectedTime} onBooked={handleBooked} />
              )}

              {booked && (
                <div className="booking-confirm">
                  <h4>Booked!</h4>
                  <p>Appointment with {booked.doctorName} on {booked.date} at {booked.time}.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
