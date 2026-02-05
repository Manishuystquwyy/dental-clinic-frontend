import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import ProtectedRoute from '../components/ProtectedRoute'

export default function PatientDashboard() {
  const { user } = useAuth()
  const [appts, setAppts] = useState([])

  useEffect(() => {
    const allAppts = JSON.parse(localStorage.getItem('gayatri_appointments') || '[]')
    // Filter by patient name
    const myAppts = allAppts.filter(a => a.patientName === user?.name)
    setAppts(myAppts)
  }, [user?.name])

  function cancelAppt(id) {
    const updated = appts.map(a => a.id === id ? { ...a, status: 'CANCELLED' } : a)
    setAppts(updated)
    const allAppts = JSON.parse(localStorage.getItem('gayatri_appointments') || '[]')
    const updatedAll = allAppts.map(a => a.id === id ? { ...a, status: 'CANCELLED' } : a)
    localStorage.setItem('gayatri_appointments', JSON.stringify(updatedAll))
  }

  return (
    <ProtectedRoute allowedRoles={['PATIENT']}>
      <section className="patient-dashboard">
        <h2>Patient Dashboard</h2>
        <p>Welcome, {user?.name}!</p>

        <h3>Your Appointments</h3>
        {appts.length === 0 && <p>No appointments booked. <a href="/book">Book now</a></p>}
        <ul>
          {appts.map(a => (
            <li key={a.id} className={a.status === 'CANCELLED' ? 'muted' : ''}>
              <strong>{a.doctorName}</strong> — {a.date} {a.time} ({a.status})
              {a.status !== 'CANCELLED' && <button onClick={() => cancelAppt(a.id)}>Cancel</button>}
            </li>
          ))}
        </ul>
      </section>
    </ProtectedRoute>
  )
}
