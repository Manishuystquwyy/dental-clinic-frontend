import { useNotifications } from '../context/NotificationContext'
import { useEffect, useMemo, useState } from 'react'
import { getAppointments, updateAppointment } from '../api/appointments'
import { getDentists } from '../api/dentists'
import { useAuth } from '../context/AuthContext'
import RescheduleAppointmentDialog from '../components/RescheduleAppointmentDialog'
import useBookingNow from '../hooks/useBookingNow'
import { canChangeAppointmentOnline } from '../utils/bookingTime'
import useAppointmentPolicy from '../hooks/useAppointmentPolicy'

function formatHours(hours) {
  return `${hours} ${hours === 1 ? 'hour' : 'hours'}`
}

function policyMessage(action, hours) {
  return hours === undefined
    ? 'The clinic appointment policy is unavailable. Please try again.'
    : `Online ${action} closes ${formatHours(hours)} before the scheduled appointment starts. Please contact the clinic for help.`
}

function sortAppointmentsDescending(appointments) {
  return [...appointments].sort((left, right) => {
    const leftDateTime = `${left.appointmentDate || ''}T${left.appointmentTime || ''}`
    const rightDateTime = `${right.appointmentDate || ''}T${right.appointmentTime || ''}`
    return rightDateTime.localeCompare(leftDateTime)
  })
}

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

  const d = new Date(`${date}T00:00:00`)

  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function AppointmentCard({ appointment, dentist, onCancel, onReschedule, now, policy }) {
  const cancellationAllowed = canChangeAppointmentOnline(appointment, policy?.cancellationCutoffHours, now)
  const reschedulingAllowed = canChangeAppointmentOnline(appointment, policy?.rescheduleCutoffHours, now)
  const policyId = `appointment-change-policy-${appointment.id}`
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

            {appointment.status === 'BOOKED' && (
              <button
                type="button"
                className="reschedule-btn"
                disabled={!reschedulingAllowed}
                aria-describedby={!reschedulingAllowed ? (policy ? policyId : 'appointment-policy-status') : undefined}
                onClick={() => onReschedule(appointment)}
              >
                Reschedule Appointment
              </button>
            )}

            <button
              type="button"
              className="cancel-btn"
              disabled={!cancellationAllowed}
              aria-describedby={!cancellationAllowed ? (policy ? policyId : 'appointment-policy-status') : undefined}
              onClick={() => onCancel(appointment)}
            >
              Cancel Appointment
            </button>

          </div>
        )}
      {policy && appointment.status === 'BOOKED' && (!cancellationAllowed || !reschedulingAllowed) && (
        <p id={policyId} className="appointment-change-policy">
          {!cancellationAllowed && `Online cancellation is closed for this appointment. `}
          {!reschedulingAllowed && `Online rescheduling is closed for this appointment. `}
          Please contact the clinic for help.
        </p>
      )}
    </div>
  )
}

export default function Appointments() {
  const { notify, confirmAction } = useNotifications()
  const [appts, setAppts] = useState([])
  const [dentists, setDentists] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [rescheduling, setRescheduling] = useState(null)
  const now = useBookingNow()
  const { policy, loading: policyLoading, error: policyError, retry: retryPolicy } = useAppointmentPolicy()

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

        setAppts(sortAppointmentsDescending(mine))
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
    if (!canChangeAppointmentOnline(appt, policy?.cancellationCutoffHours)) {
      notify(policyMessage('cancellation', policy?.cancellationCutoffHours), { title: 'Online changes closed', tone: 'error' })
      return
    }
    const confirmed = await confirmAction({
      title: 'Cancel appointment?',
      message: 'Are you sure you want to cancel this appointment? You can book a new time when you are ready.',
    })

    if (!confirmed) return
    if (!canChangeAppointmentOnline(appt, policy?.cancellationCutoffHours)) {
      notify(policyMessage('cancellation', policy?.cancellationCutoffHours), { title: 'Online changes closed', tone: 'error' })
      return
    }

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
      notify(err.message || 'Unable to cancel appointment.', { title: 'Cancellation failed', tone: 'error' })
    }
  }

  function beginRescheduling(appointment) {
    if (!canChangeAppointmentOnline(appointment, policy?.rescheduleCutoffHours)) {
      notify(policyMessage('rescheduling', policy?.rescheduleCutoffHours), { title: 'Online changes closed', tone: 'error' })
      return
    }
    setRescheduling(appointment)
  }

  function handleRescheduled(updated) {
    setAppts((previous) => sortAppointmentsDescending(
      previous.map((appointment) => appointment.id === updated.id ? updated : appointment)
    ))
    setRescheduling(null)
    notify(`Your appointment is now on ${formatDate(updated.appointmentDate)} at ${updated.appointmentTime.slice(0, 5)}.`, {
      title: 'Appointment rescheduled',
    })
  }

  const upcomingAppointments = appts.filter(
    (a) => a.status !== 'CANCELLED' && a.status !== 'COMPLETED'
  )

  const pastAppointments = appts.filter(
    (a) => a.status === 'CANCELLED' || a.status === 'COMPLETED'
  )
  return (
    <section className="appointments-page">

      <div className="appointments-header">

        <div>
          <p className="page-subtitle">Gayatri Dental Clinic</p>

          <h2>Your Appointments</h2>

          <p className="page-description">
            Manage your upcoming dental appointments and view your appointment history.
          </p>
          <div id="appointment-policy-status" className="appointment-change-policy">
            {policyLoading && <p role="status">Loading clinic appointment policy…</p>}
            {policyError && <div role="alert">
              <p>{policyError}</p>
              <button type="button" className="secondary" onClick={retryPolicy}>Retry policy</button>
            </div>}
            {policy && <p>
              Online cancellation closes <strong>{formatHours(policy.cancellationCutoffHours)}</strong> and rescheduling closes <strong>{formatHours(policy.rescheduleCutoffHours)}</strong> before the scheduled appointment starts (India time).
            </p>}
          </div>
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
                dentist={dentistById.get(appointment.dentistId)}
                onCancel={cancel}
                onReschedule={beginRescheduling}
                now={now}
                policy={policy}
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
                dentist={dentistById.get(appointment.dentistId)}
                onCancel={cancel}
                onReschedule={beginRescheduling}
                now={now}
                policy={policy}
              />
            ))}
          </div>

        </div>
      )}

      {rescheduling && (
        <RescheduleAppointmentDialog
          key={rescheduling.id}
          appointment={rescheduling}
          dentistName={dentistById.get(rescheduling.dentistId)?.name || `Dentist #${rescheduling.dentistId}`}
          onClose={() => setRescheduling(null)}
          onRescheduled={handleRescheduled}
          policy={policy}
        />
      )}
    </section>
  )
}
