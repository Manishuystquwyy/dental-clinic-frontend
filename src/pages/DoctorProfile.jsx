import { clinicToday, isFutureSlot } from '../utils/bookingTime'
import useBookingNow from '../hooks/useBookingNow'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import AppointmentForm from '../components/AppointmentForm'
import { getDentist } from '../api/dentists'
import { getAppointmentAvailability } from '../api/appointments'
import DatePicker from '../components/DatePicker'
import { resolvePictureUrl } from '../utils/media'

export default function DoctorProfile() {
  const { id } = useParams()
  const [doc, setDoc] = useState(null)
  const [error, setError] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [booked, setBooked] = useState(null)
  const [availableSlots, setAvailableSlots] = useState([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [availabilityError, setAvailabilityError] = useState('')
  const now = useBookingNow()
  const today = clinicToday(now)
  const futureSlots = availableSlots.filter((slot) => isFutureSlot(date, slot, now))

  const timeSlots = ['10:30', '11:00', '14:00', '14:30', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00']

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

  useEffect(() => {
    let active = true

    if (!date) {
      setAvailableSlots([])
      setAvailabilityError('')
      return () => { active = false }
    }

    setAvailableSlots([])
    setLoadingSlots(true)
    setAvailabilityError('')
    getAppointmentAvailability(id, date)
      .then((data) => {
        if (active) {
          setAvailableSlots((data?.availableSlots || []).map((slot) => slot.slice(0, 5)))
        }
      })
      .catch((err) => {
        if (active) setAvailabilityError(err.message || 'Unable to load available time slots.')
      })
      .finally(() => {
        if (active) setLoadingSlots(false)
      })

    return () => { active = false }
  }, [id, date])

  if (error) return <p>{error}</p>
  if (!doc) return <p>Loading...</p>

  return (
    <section className="doctor-profile">
      <div className="bio">
        <div className="doctor-hero">
          <div className="doctor-photo doctor-photo-lg" aria-hidden={!doc.pictureUrl}>
            <div className="doctor-photo-fallback" aria-hidden="true">
              {(doc.name || 'Doctor').split(' ').map((s) => s[0]).slice(0, 2).join('').toUpperCase()}
            </div>
            {doc.pictureUrl && (
              <img
                src={resolvePictureUrl(doc.pictureUrl)}
                alt={`Dr. ${doc.name}`}
                loading="lazy"
                decoding="async"
                onError={(e) => { e.currentTarget.style.display = 'none' }}
              />
            )}
          </div>
          <div>
            <h2>{doc.name}</h2>
            <p><strong>Experience:</strong> {doc.experienceYears} years</p>
            <p><strong>Qualification:</strong> {doc.qualification || '—'}</p>
            <p><strong>Specialization:</strong> {doc.specialization || '—'}</p>
            <p><strong>Consultation Fees:</strong> ₹ {doc.consultationFees ?? 0}</p>
          </div>
        </div>
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
              {loadingSlots && <p>Loading available slots...</p>}
              {availabilityError && <p className="form-error">{availabilityError}</p>}
              {!loadingSlots && futureSlots.length === 0 && <p>No slots are available for this date.</p>}
              <div className="times">
                {timeSlots.map((t) => {
                  const expired = !isFutureSlot(date, t, now)
                  const isAvailable = !expired && availableSlots.includes(t)
                  return (
                    <button
                      key={t}
                      type="button"
                      disabled={!isAvailable || loadingSlots}
                      onClick={() => { setTime(t); setBooked(null) }}
                      className={`${t === time ? 'active' : ''} ${!isAvailable ? 'unavailable' : ''}`}
                    >
                      {t}{expired ? ' (Passed)' : !isAvailable ? ' (Unavailable)' : ''}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
        {!date && <p>Select a slot to book.</p>}
        {date && time && isFutureSlot(date, time, now) && !booked && (
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
