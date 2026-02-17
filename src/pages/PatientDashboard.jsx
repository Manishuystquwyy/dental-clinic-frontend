import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { getAppointments, updateAppointment } from '../api/appointments'
import { getDentists } from '../api/dentists'

export default function PatientDashboard() {
  const { user } = useAuth()
  const [appts, setAppts] = useState([])
  const [dentists, setDentists] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    if (!user) return
    Promise.all([getAppointments(), getDentists()])
      .then(([appointmentsData, dentistsData]) => {
        if (!active) return
        const mine = (appointmentsData || []).filter((a) => a.patientId === Number(user.patientId))
        setAppts(mine)
        setDentists(dentistsData || [])
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
  }, [user])

  const dentistById = useMemo(() => {
    const map = new Map()
    dentists.forEach((d) => map.set(d.id, d))
    return map
  }, [dentists])

  async function cancelAppt(appt) {
    try {
      const updated = await updateAppointment(appt.id, {
        patientId: appt.patientId,
        dentistId: appt.dentistId,
        appointmentDate: appt.appointmentDate,
        appointmentTime: appt.appointmentTime,
        status: 'CANCELLED',
        remarks: appt.remarks || null,
      })
      setAppts((prev) => prev.map((a) => (a.id === appt.id ? updated : a)))
    } catch (err) {
      alert(err.message || 'Unable to cancel appointment.')
    }
  }

  return (
    <section className="patient-dashboard">
      <h2>Patient Dashboard</h2>
      <p>Welcome, {user?.name}!</p>

      <h3>Your Appointments</h3>
      {loading && <p>Loading...</p>}
      {error && <p className="form-error">{error}</p>}
      {!loading && appts.length === 0 && <p>No appointments booked. <a href="/book">Book now</a></p>}
      <ul>
        {appts.map((a) => (
          <li key={a.id} className={a.status === 'CANCELLED' ? 'muted' : ''}>
            <strong>{dentistById.get(a.dentistId)?.name || `Dentist #${a.dentistId}`}</strong> — {a.appointmentDate} {a.appointmentTime} ({a.status})
            {a.status !== 'CANCELLED' && a.status !== 'COMPLETED' && (
              <button onClick={() => cancelAppt(a)}>Cancel</button>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
