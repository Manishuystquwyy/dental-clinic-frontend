import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import ProtectedRoute from '../components/ProtectedRoute'
import { getMyDoctorAppointments } from '../api/appointments'
import DoctorMedicalRecords from '../components/DoctorMedicalRecords'
import '../components/MedicalRecords.css'

function getAppointmentDateTime(appointment) {
  const value = new Date(`${appointment.appointmentDate}T${appointment.appointmentTime}`)
  return Number.isNaN(value.getTime()) ? null : value
}

function getUpcomingAppointments(appointments) {
  const now = new Date()
  return (appointments || [])
    .filter((appointment) => {
      const appointmentDateTime = getAppointmentDateTime(appointment)
      return appointmentDateTime
        && appointmentDateTime >= now
        && appointment.status !== 'CANCELLED'
        && appointment.status !== 'COMPLETED'
    })
    .sort((left, right) => getAppointmentDateTime(left) - getAppointmentDateTime(right))
}

function formatDate(value) {
  if (!value) return '—'
  return new Date(`${value}T00:00:00`).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export default function DoctorDashboard() {
  const { user } = useAuth()
  const [appts, setAppts] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const visibleAppointments = showAll
    ? [...appts].sort((left, right) => getAppointmentDateTime(right) - getAppointmentDateTime(left))
    : getUpcomingAppointments(appts)

  useEffect(() => {
    let active = true

    getMyDoctorAppointments()
      .then((appointments) => {
        if (active) setAppts(appointments || [])
      })
      .catch((err) => {
        if (active) setError(err.message || 'Unable to load appointments.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  return (
    <ProtectedRoute allowedRoles={['DOCTOR']}>
      <section className="doctor-dashboard">
        <h2>Doctor Dashboard</h2>
        <p>Welcome, {user?.name || user?.email} ({user?.role})</p>

        {selectedAppointment && <DoctorMedicalRecords key={selectedAppointment.id} appointment={selectedAppointment} onClose={() => setSelectedAppointment(null)} />}

        <div className="appointment-section doctor-appointment-section">
          <div className="section-title">
            <h3>Your Appointments</h3>
            {!loading && !error && <span>{visibleAppointments.length}</span>}
          </div>
          <div className="record-mode-switch" role="group" aria-label="Appointment period">
            <button type="button" className={`record-button ${showAll ? 'secondary' : ''}`} aria-pressed={!showAll} onClick={() => setShowAll(false)}>Upcoming</button>
            <button type="button" className={`record-button ${showAll ? '' : 'secondary'}`} aria-pressed={showAll} onClick={() => setShowAll(true)}>All visits / past appointments</button>
          </div>

          {loading && (
            <div className="appointments-loading">
              <div className="spinner" />
              <p>Loading your appointments...</p>
            </div>
          )}

          {error && <div className="appointment-error">⚠️ {error}</div>}

          {!loading && !error && visibleAppointments.length === 0 && (
            <div className="empty-appointments doctor-empty-appointments">
              <div className="empty-icon">📅</div>
              <p>{showAll ? 'No appointments found.' : 'You have no upcoming appointments. Open all visits to add or view records for past appointments.'}</p>
            </div>
          )}

          {!loading && !error && visibleAppointments.length > 0 && (
            <div className="appointments-grid">
              {visibleAppointments.map((appointment) => (
                <article className="appointment-card" key={appointment.id}>
                  <div className="appointment-card-header">
                    <div className="dentist-info">
                      <div className="dentist-icon" aria-hidden="true">👤</div>
                      <div>
                        <h3>{appointment.patientName || `Patient #${appointment.patientId}`}</h3>
                        <p>Patient</p>
                      </div>
                    </div>
                    <span className="status-badge status-default">{appointment.status}</span>
                  </div>

                  <div className="appointment-details">
                    <div className="detail-item">
                      <span className="detail-icon" aria-hidden="true">📅</span>
                      <div>
                        <span className="detail-label">Date</span>
                        <strong>{formatDate(appointment.appointmentDate)}</strong>
                      </div>
                    </div>
                    <div className="detail-item">
                      <span className="detail-icon" aria-hidden="true">🕐</span>
                      <div>
                        <span className="detail-label">Time</span>
                        <strong>{appointment.appointmentTime}</strong>
                      </div>
                    </div>
                  </div>

                  {appointment.remarks && (
                    <div className="appointment-remarks">
                      <span aria-hidden="true">📝</span>
                      <div>
                        <span className="detail-label">Treatment / reason</span>
                        <p>{appointment.remarks}</p>
                      </div>
                    </div>
                  )}
                  <div className="appointment-actions">
                    <button type="button" className="record-button" onClick={() => {
                      setSelectedAppointment(appointment)
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}>Prescriptions &amp; reports</button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </ProtectedRoute>
  )
}
