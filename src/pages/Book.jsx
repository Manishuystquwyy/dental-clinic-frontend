import { useEffect, useState } from 'react'
import DoctorCard from '../components/DoctorCard'
import AppointmentForm from '../components/AppointmentForm'
import { getDentists } from '../api/dentists'
import DatePicker from '../components/DatePicker'

export default function Book() {
  const [doctors, setDoctors] = useState([])
  const [selected, setSelected] = useState(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [booked, setBooked] = useState(null)
  const [error, setError] = useState('')
  const today = new Date().toISOString().split('T')[0]

  const timeSlots = ['09:00', '10:30', '12:00', '14:00', '15:30', '17:00']

  useEffect(() => {
    let active = true
    getDentists()
      .then((data) => {
        if (active) setDoctors(data || [])
      })
      .catch((err) => {
        if (active) setError(err.message || 'Unable to load doctors.')
      })
    return () => {
      active = false
    }
  }, [])

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
      {error && <p className="form-error">{error}</p>}
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
              <h3>{selected.name} — {selected.experienceYears} years experience</h3>
              <DatePicker
                label="Choose date"
                minDate={today}
                value={selectedDate}
                onChange={(val) => { setSelectedDate(val); setSelectedTime(''); setBooked(null) }}
              />

              {selectedDate && (
                <div>
                  <p>Available times:</p>
                  <div className="times">
                    {timeSlots.map((t) => (
                      <button key={t} className={t === selectedTime ? 'active' : ''} onClick={() => { setSelectedTime(t); setBooked(null) }}>{t}</button>
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
                  <p>Appointment with {selected.name} on {booked.appointmentDate} at {booked.appointmentTime}.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
