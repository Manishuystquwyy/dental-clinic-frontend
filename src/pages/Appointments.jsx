import { useEffect, useMemo, useState } from 'react'
import { getAppointments, updateAppointment } from '../api/appointments'
import { getDentists } from '../api/dentists'
import { useAuth } from '../context/AuthContext'

export default function Appointments() {
  const [appts, setAppts] = useState([])
  const [dentists, setDentists] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const { user } = useAuth()

  useEffect(() => {
    let active = true

    if (!user) return

    Promise.all([getAppointments(), getDentists()])
      .then(([appointmentsData, dentistsData]) => {
        if (!active) return

        const mine = (appointmentsData || []).filter(
          (a) => a.patientId === Number(user.patientId)
        )

        setAppts(mine)
        setDentists(dentistsData || [])
      })
      .catch((err) => {
        if (active) {
          setError(err.message || 'Unable to load appointments.')
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [user])

  const dentistById = useMemo(() => {
    const map = new Map()

    dentists.forEach((d) => {
      map.set(d.id, d)
    })

    return map
  }, [dentists])

  async function cancel(appt) {
    const confirmed = window.confirm(
      'Are you sure you want to cancel this appointment?'
    )

    if (!confirmed) return

    try {
      const updated = await updateAppointment(appt.id, {
        patientId: appt.patientId,
        dentistId: appt.dentistId,
        appointmentDate: appt.appointmentDate,
        appointmentTime: appt.appointmentTime,
        status: 'CANCELLED',
        remarks: appt.remarks || null,
      })

      setAppts((prev) =>
        prev.map((a) => (a.id === appt.id ? updated : a))
      )
    } catch (err) {
      alert(err.message || 'Unable to cancel appointment.')
    }
  }

  const upcomingAppointments = appts.filter(
    (a) => a.status !== 'CANCELLED' && a.status !== 'COMPLETED'
  )

  const pastAppointments = appts.filter(
    (a) => a.status === 'CANCELLED' || a.status === 'COMPLETED'
  )

  function getStatusClass(status) {
    switch (status) {
      case 'CONFIRMED':
        return 'status-confirmed'

      case 'PENDING':
        return 'status-pending'

      case 'COMPLETED':
        return 'status-completed'

      case 'CANCELLED':
        return 'status-cancelled'

      default:
        return 'status-default'
    }
  }

  function formatDate(date) {
    if (!date) return ''

    const d = new Date(date)

    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  function AppointmentCard({ appointment }) {
    const dentist = dentistById.get(appointment.dentistId)

    return (
      <div
        className={`appointment-card ${
          appointment.status === 'CANCELLED' ? 'appointment-cancelled' : ''
        }`}
      >
        <div className="appointment-card-header">

          <div className="dentist-info">

            <div className="dentist-icon">
              🦷
            </div>

            <div>
              <h3>
                {dentist?.name || `Dentist #${appointment.dentistId}`}
              </h3>

              {dentist?.specialization && (
                <p>{dentist.specialization}</p>
              )}
            </div>
          </div>

          <span className={`status-badge ${getStatusClass(appointment.status)}`}>
            {appointment.status}
          </span>

        </div>

        <div className="appointment-details">

          <div className="detail-item">
            <span className="detail-icon">📅</span>

            <div>
              <span className="detail-label">Date</span>
              <strong>{formatDate(appointment.appointmentDate)}</strong>
            </div>
          </div>

          <div className="detail-item">
            <span className="detail-icon">🕐</span>

            <div>
              <span className="detail-label">Time</span>
              <strong>{appointment.appointmentTime}</strong>
            </div>
          </div>

        </div>

        {appointment.remarks && (
          <div className="appointment-remarks">
            <span>📝</span>
            <div>
              <span className="detail-label">Remarks</span>
              <p>{appointment.remarks}</p>
            </div>
          </div>
        )}

        {appointment.status !== 'CANCELLED' &&
          appointment.status !== 'COMPLETED' && (
            <div className="appointment-actions">

              <button
                className="cancel-btn"
                onClick={() => cancel(appointment)}
              >
                Cancel Appointment
              </button>

            </div>
          )}
      </div>
    )
  }

  return (
    <section className="appointments-page">

      <div className="appointments-header">

        <div>
          <p className="page-subtitle">Gayatri Dental Clinic</p>

          <h2>Your Appointments</h2>

          <p className="page-description">
            Manage your upcoming dental appointments and view your appointment history.
          </p>
        </div>

        <div className="appointment-summary">
          <span>{upcomingAppointments.length}</span>
          <small>Upcoming</small>
        </div>

      </div>

      {loading && (
        <div className="appointments-loading">
          <div className="spinner"></div>
          <p>Loading your appointments...</p>
        </div>
      )}

      {error && (
        <div className="appointment-error">
          ⚠️ {error}
        </div>
      )}

      {!loading && !error && appts.length === 0 && (
        <div className="empty-appointments">

          <div className="empty-icon">
            📅
          </div>

          <h3>No appointments found</h3>

          <p>
            You don't have any appointments yet.
          </p>

          <button className="book-btn">
            Book an Appointment
          </button>

        </div>
      )}

      {!loading && upcomingAppointments.length > 0 && (
        <div className="appointment-section">

          <div className="section-title">
            <h3>Upcoming Appointments</h3>
            <span>{upcomingAppointments.length}</span>
          </div>

          <div className="appointments-grid">
            {upcomingAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
              />
            ))}
          </div>

        </div>
      )}

      {!loading && pastAppointments.length > 0 && (
        <div className="appointment-section history-section">

          <div className="section-title">
            <h3>Appointment History</h3>
            <span>{pastAppointments.length}</span>
          </div>

          <div className="appointments-grid">
            {pastAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
              />
            ))}
          </div>

        </div>
      )}

    </section>
  )
}