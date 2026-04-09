import { useEffect, useState } from 'react'
import ProtectedRoute from '../components/ProtectedRoute'
import { getAppointments, updateAppointment } from '../api/appointments'
import { getDentists } from '../api/dentists'
import { getPatients } from '../api/patients'

export default function AppointmentsManager() {
  const [appts, setAppts] = useState([])
  const [dentists, setDentists] = useState([])
  const [patients, setPatients] = useState([])
  const [error, setError] = useState('')

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
                  {a.status !== 'COMPLETED' && (
                    <>
                      <button onClick={() => updateStatus(a, 'COMPLETED')}>Mark Complete</button>
                      <button onClick={() => updateStatus(a, 'CANCELLED')}>Cancel</button>
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
