import { useEffect, useState } from 'react'
import ProtectedRoute from '../components/ProtectedRoute'

function loadAppointments() {
  return JSON.parse(localStorage.getItem('gayatri_appointments') || '[]')
}

function saveAppointments(appts) {
  localStorage.setItem('gayatri_appointments', JSON.stringify(appts))
}

export default function AppointmentsManager() {
  const [appts, setAppts] = useState([])

  useEffect(() => {
    setAppts(loadAppointments())
  }, [])

  function approve(id) {
    const updated = appts.map(a => a.id === id ? { ...a, status: 'APPROVED' } : a)
    setAppts(updated)
    saveAppointments(updated)
  }

  function reject(id) {
    const updated = appts.map(a => a.id === id ? { ...a, status: 'REJECTED' } : a)
    setAppts(updated)
    saveAppointments(updated)
  }

  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <section className="manager-page">
        <h2>Appointment Requests</h2>
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
            {appts.map(a => (
              <tr key={a.id}>
                <td>{a.patientName}</td>
                <td>{a.doctorName}</td>
                <td>{a.date} {a.time}</td>
                <td><strong>{a.status}</strong></td>
                <td>
                  {a.status === 'CONFIRMED' && (
                    <>
                      <button onClick={() => approve(a.id)}>Approve</button>
                      <button onClick={() => reject(a.id)}>Reject</button>
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
