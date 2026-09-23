import { clinicToday, isFutureSlot } from '../utils/bookingTime'
import useBookingNow from '../hooks/useBookingNow'
import { useEffect, useState } from 'react'
import DoctorCard from '../components/DoctorCard'
import AppointmentForm from '../components/AppointmentForm'
import { getDentists } from '../api/dentists'
import { getAppointmentAvailability } from '../api/appointments'
import DatePicker from '../components/DatePicker'

export default function Book() {
  const [doctors, setDoctors] = useState([])
  const [selected, setSelected] = useState(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [booked, setBooked] = useState(null)
  const [availableSlots, setAvailableSlots] = useState([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [error, setError] = useState('')
  const now = useBookingNow()
  const today = clinicToday(now)
  const futureSlots = availableSlots.filter((slot) => isFutureSlot(selectedDate, slot, now))

  const timeSlots = ['10:30', '11:00', '14:00', '14:30', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00']

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

  useEffect(() => {
    let active = true

    if (!selected || !selectedDate) {
      setAvailableSlots([])
      return () => { active = false }
    }

    setAvailableSlots([])
    setLoadingSlots(true)
    getAppointmentAvailability(selected.id, selectedDate)
      .then((data) => {
        if (active) {
          setAvailableSlots((data?.availableSlots || []).map((slot) => slot.slice(0, 5)))
        }
      })
      .catch((err) => {
        if (active) setError(err.message || 'Unable to load available time slots.')
      })
      .finally(() => {
        if (active) setLoadingSlots(false)
      })

    return () => { active = false }
  }, [selected, selectedDate])

  function handleSelect(doc) {
    setSelected(doc)
    setSelectedDate('')
    setSelectedTime('')
    setAvailableSlots([])
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
                  {loadingSlots && <p>Loading available slots...</p>}
                  {!loadingSlots && futureSlots.length === 0 && <p>No slots are available for this date.</p>}
                  <div className="times">
                    {timeSlots.map((t) => {
                      const expired = !isFutureSlot(selectedDate, t, now)
                      const isAvailable = !expired && availableSlots.includes(t)
                      return (
                      <button
                        key={t}
                        type="button"
                        disabled={!isAvailable || loadingSlots}
                        className={`${t === selectedTime ? 'active' : ''} ${!isAvailable ? 'unavailable' : ''}`}
                        onClick={() => { setSelectedTime(t); setBooked(null) }}
                      >
                        {t}{expired ? ' (Passed)' : !isAvailable ? ' (Unavailable)' : ''}
                      </button>
                    )})}
                  </div>
                </div>
              )}

              {selectedDate && selectedTime && isFutureSlot(selectedDate, selectedTime, now) && !booked && (
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
