import { useEffect, useState } from 'react'
import ProtectedRoute from '../components/ProtectedRoute'
import { getAppointments, updateAppointment } from '../api/appointments'
import { getDentists } from '../api/dentists'
import { getPatients } from '../api/patients'
import useBookingNow from '../hooks/useBookingNow'
import { canCompleteAppointment } from '../utils/appointmentStatus'

export default function AppointmentsManager() {
  const [appts, setAppts] = useState([])
  const [dentists, setDentists] = useState([])
  const [patients, setPatients] = useState([])
  const [error, setError] = useState('')
  const [updatingId, setUpdatingId] = useState(null)
  const now = useBookingNow()

  useEffect(() => {
    let active = true

    Promise.all([getAppointments(), getDentists(), getPatients()])
      .then(([appointmentsData, dentistsData, patientsData]) => {
        if (!active) return
        setAppts(appointmentsData || [])
        setDentists(dentistsData || [])
        setPatients(patientsData || [])
      })
      .catch((err) => {
        if (active) {
          setError(err.message || 'Unable to load appointments.')
        }
      })

    return () => {
      active = false
    }
  }, [])

  const dentistById = new Map(dentists.map((dentist) => [dentist.id, dentist]))
  const patientById = new Map(patients.map((patient) => [patient.id, patient]))

  async function updateStatus(appointment, status) {
    if (updatingId !== null) return
    if (status === 'COMPLETED' && !canCompleteAppointment(appointment)) return
    setUpdatingId(appointment.id)
    try {
      setError('')
      const updated = await updateAppointment(appointment.id, {
        patientId: appointment.patientId,
        dentistId: appointment.dentistId,
        appointmentDate: appointment.appointmentDate,
        appointmentTime: appointment.appointmentTime,
        status,
        remarks: appointment.remarks || null,
      })
      setAppts((prev) => prev.map((item) => (item.id === appointment.id ? updated : item)))
    } catch (err) {
      setError(err.message || 'Unable to update appointment.')
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <section className="manager-page">
        <h2>Appointment Requests</h2>
        {error && <p className="form-error">{error}</p>}
        {appts.length === 0 && <p>No appointments to manage.</p>}
        <table className="manager-table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Date & Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appts.map((a) => (
              <tr key={a.id}>
                <td>
                  {patientById.get(a.patientId)
                    ? `${patientById.get(a.patientId).firstName} ${patientById.get(a.patientId).lastName}`
                    : `Patient #${a.patientId}`}
                </td>
                <td>{dentistById.get(a.dentistId)?.name || `Dentist #${a.dentistId}`}</td>
                <td>{a.appointmentDate} {a.appointmentTime}</td>
                <td><strong>{a.status}</strong></td>
                <td>
                  {a.status === 'BOOKED' && (
                    <>
                      <button
                        disabled={updatingId !== null || !canCompleteAppointment(a, now)}
                        title={canCompleteAppointment(a, now) ? 'Mark complete after finishing the consultation' : 'Available from the scheduled appointment time'}
                        onClick={() => updateStatus(a, 'COMPLETED')}
                      >{updatingId === a.id ? 'Updating...' : 'Mark Complete'}</button>
                      <button disabled={updatingId !== null} onClick={() => updateStatus(a, 'CANCELLED')}>Cancel</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </ProtectedRoute>
  )
}
