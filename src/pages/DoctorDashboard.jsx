import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import ProtectedRoute from '../components/ProtectedRoute'

export default function DoctorDashboard() {
  const { user } = useAuth()
  const [appts, setAppts] = useState([])

  useEffect(() => {
    const allAppts = JSON.parse(localStorage.getItem('gayatri_appointments') || '[]')
    // Show appointments for this doctor
    setAppts(allAppts)
  }, [])

  return (
    <ProtectedRoute allowedRoles={['DOCTOR']}>
      <section className="doctor-dashboard">
        <h2>Doctor Dashboard</h2>
        <p>Welcome, {user?.name} ({user?.role})</p>

        <h3>Your Appointments</h3>
        {appts.length === 0 && <p>No appointments scheduled.</p>}
        <ul>
          {appts.map(a => (
            <li key={a.id}>
              <strong>{a.patientName}</strong> — {a.date} {a.time} ({a.status})
            </li>
          ))}
        </ul>
      </section>
    </ProtectedRoute>
  )
}
