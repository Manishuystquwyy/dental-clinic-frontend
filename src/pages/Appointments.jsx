import { useNotifications } from '../context/NotificationContext'
import { useEffect, useMemo, useRef, useState } from 'react'
import { getAppointments, updateAppointment } from '../api/appointments'
import { getDentists } from '../api/dentists'
import { useAuth } from '../context/AuthContext'
import RescheduleAppointmentDialog from '../components/RescheduleAppointmentDialog'
import useBookingNow from '../hooks/useBookingNow'
import { canChangeAppointmentOnline } from '../utils/bookingTime'
import useAppointmentPolicy from '../hooks/useAppointmentPolicy'
import AppointmentRefund from '../components/AppointmentRefund'
import { cancellationMessage, cancellationSuccessMessage, formatRefundAmount, hasActiveRefund } from '../utils/refundPresentation'

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

function AppointmentCard({ appointment, dentist, onCancel, onReschedule, now, policy, cancelling }) {
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
                disabled={cancelling || !reschedulingAllowed}
                aria-describedby={!reschedulingAllowed ? (policy ? policyId : 'appointment-policy-status') : undefined}
                onClick={() => onReschedule(appointment)}
              >
                Reschedule Appointment
              </button>
            )}

            <button
              type="button"
              className="cancel-btn"
              disabled={cancelling || !cancellationAllowed}
              aria-busy={cancelling || undefined}
              aria-describedby={!cancellationAllowed ? (policy ? policyId : 'appointment-policy-status') : undefined}
              onClick={() => onCancel(appointment)}
            >
              {cancelling ? 'Cancelling…' : 'Cancel Appointment'}
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
      <AppointmentRefund appointment={appointment} />
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
  const [cancellingIds, setCancellingIds] = useState(new Set())
  const [refundRefreshError, setRefundRefreshError] = useState('')
  const [refundRefreshVersion, setRefundRefreshVersion] = useState(0)
  const cancellationRequests = useRef(new Set())
  const appointmentRevision = useRef(0)
  const observedRefunds = useRef(new Map())
  const now = useBookingNow()
  const { policy, loading: policyLoading, error: policyError, retry: retryPolicy } = useAppointmentPolicy()

  const { user } = useAuth()
  const patientId = Number(user?.patientId)
  const trackingRefunds = appts.some(hasActiveRefund)

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

  useEffect(() => {
    let active = true
    let timer
    if (!trackingRefunds || !patientId) return

    async function refreshRefunds() {
      if (document.visibilityState === 'hidden' || cancellationRequests.current.size > 0) {
        timer = window.setTimeout(refreshRefunds, 15000)
        return
      }
      const revision = appointmentRevision.current
      try {
        const appointmentsData = await getAppointments()
        if (!active) return
        // A cancellation or reschedule committed while this read was in flight.
        if (revision === appointmentRevision.current) {
          setAppts(sortAppointmentsDescending((appointmentsData || []).filter((appointment) => appointment.patientId === patientId)))
          setRefundRefreshError('')
        }
      } catch {
        if (active) setRefundRefreshError('We could not refresh your refund status. Tracking will retry automatically.')
      } finally {
        if (active) timer = window.setTimeout(refreshRefunds, 15000)
      }
    }

    // A retry is immediate; normal polling leaves the cancellation response visible first.
    timer = window.setTimeout(refreshRefunds, refundRefreshVersion > 0 ? 0 : 15000)
    return () => {
      active = false
      window.clearTimeout(timer)
    }
  }, [trackingRefunds, patientId, refundRefreshVersion])

  useEffect(() => {
    appts.forEach((appointment) => {
      const refunds = appointment.refunds || []
      refunds.forEach((refund, index) => {
        const key = `${patientId}:${appointment.id}:${refund.paymentId || index}`
        const previous = observedRefunds.current.get(key)
        observedRefunds.current.set(key, refund.status)
        if (previous && previous !== 'REFUNDED' && refund.status === 'REFUNDED') {
          const amount = formatRefundAmount(refund.amount)
          notify(`Razorpay has confirmed${amount ? ` your ${amount} refund` : ' your refund'} has been processed. View the reference in Appointment History.`, { title: 'Refund processed' })
        }
      })
    })
  }, [appts, notify, patientId])

  const dentistById = useMemo(() => {
    const map = new Map()

    dentists.forEach((d) => {
      map.set(d.id, d)
    })

    return map
  }, [dentists])

  async function cancel(appt) {
    if (cancellationRequests.current.has(appt.id)) return
    if (!canChangeAppointmentOnline(appt, policy?.cancellationCutoffHours)) {
      notify(policyMessage('cancellation', policy?.cancellationCutoffHours), { title: 'Online changes closed', tone: 'error' })
      return
    }
    cancellationRequests.current.add(appt.id)
    try {
      const confirmed = await confirmAction({
        title: 'Cancel this appointment?',
        message: cancellationMessage(appt),
      })

      if (!confirmed) return
      if (!canChangeAppointmentOnline(appt, policy?.cancellationCutoffHours)) {
        notify(policyMessage('cancellation', policy?.cancellationCutoffHours), { title: 'Online changes closed', tone: 'error' })
        return
      }
      setCancellingIds((previous) => new Set(previous).add(appt.id))
      appointmentRevision.current += 1
      const updated = await updateAppointment(appt.id, {
        patientId: appt.patientId,
        dentistId: appt.dentistId,
        appointmentDate: appt.appointmentDate,
        appointmentTime: appt.appointmentTime,
        status: 'CANCELLED',
        remarks: appt.remarks || null,
      })

      appointmentRevision.current += 1
      setAppts((prev) =>
        prev.map((a) => (a.id === appt.id ? updated : a))
      )
      notify(cancellationSuccessMessage(updated), { title: 'Appointment cancelled' })
    } catch (err) {
      // The server may have committed even if its response was interrupted.
      try {
        const appointmentsData = await getAppointments()
        const mine = (appointmentsData || []).filter((appointment) => appointment.patientId === patientId)
        const updated = mine.find((appointment) => appointment.id === appt.id)
        appointmentRevision.current += 1
        setAppts(sortAppointmentsDescending(mine))
        if (updated?.status === 'CANCELLED') {
          notify(cancellationSuccessMessage(updated), { title: 'Appointment cancelled' })
          return
        }
      } catch {
        // Show one actionable notice without issuing a second cancellation.
      }
      notify(err.message || 'Unable to confirm cancellation. Please refresh your appointments before trying again.', { title: 'Cancellation could not be confirmed', tone: 'error' })
    } finally {
      cancellationRequests.current.delete(appt.id)
      setCancellingIds((previous) => {
        const next = new Set(previous)
        next.delete(appt.id)
        return next
      })
    }
  }

  function beginRescheduling(appointment) {
    if (cancellationRequests.current.has(appointment.id)) return
    if (!canChangeAppointmentOnline(appointment, policy?.rescheduleCutoffHours)) {
      notify(policyMessage('rescheduling', policy?.rescheduleCutoffHours), { title: 'Online changes closed', tone: 'error' })
      return
    }
    setRescheduling(appointment)
  }

  function handleRescheduled(updated) {
    appointmentRevision.current += 1
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

      {trackingRefunds && (
        <div className="appointments-refund-refresh" role="status">
          <p>{refundRefreshError || 'Refund updates refresh automatically while this page is open.'}</p>
          {refundRefreshError && <button type="button" className="secondary" onClick={() => setRefundRefreshVersion((previous) => previous + 1)}>Refresh status</button>}
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
                cancelling={cancellingIds.has(appointment.id)}
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
                cancelling={cancellingIds.has(appointment.id)}
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
