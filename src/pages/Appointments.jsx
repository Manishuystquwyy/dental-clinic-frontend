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

  async function cancel(appt) {
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
    <section className="appointments-page">
      <h2>Your Appointments</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="form-error">{error}</p>}
      {!loading && appts.length === 0 && <p>No appointments found.</p>}
      <ul>
        {appts.map(a => (
          <li key={a.id} className={a.status === 'CANCELLED' ? 'muted' : ''}>
            <strong>{dentistById.get(a.dentistId)?.name || `Dentist #${a.dentistId}`}</strong> — {a.appointmentDate} {a.appointmentTime} ({a.status})
            {a.status !== 'CANCELLED' && <button onClick={() => cancel(a)}>Cancel</button>}
          </li>
        ))}
      </ul>
    </section>
  )
}
