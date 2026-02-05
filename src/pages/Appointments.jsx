import { useEffect, useState } from 'react'

function loadAppointments() {
  return JSON.parse(localStorage.getItem('gayatri_appointments') || '[]')
}

export default function Appointments() {
  const [appts, setAppts] = useState([])

  useEffect(() => {
    setAppts(loadAppointments())
  }, [])

  function cancel(id) {
    const updated = appts.map(a => a.id === id ? { ...a, status: 'CANCELLED' } : a)
    setAppts(updated)
    localStorage.setItem('gayatri_appointments', JSON.stringify(updated))
  }

  return (
    <section className="appointments-page">
      <h2>Your Appointments</h2>
      {appts.length === 0 && <p>No appointments found.</p>}
      <ul>
        {appts.map(a => (
          <li key={a.id} className={a.status === 'CANCELLED' ? 'muted' : ''}>
            <strong>{a.doctorName}</strong> — {a.date} {a.time} ({a.status})
            {a.status !== 'CANCELLED' && <button onClick={() => cancel(a.id)}>Cancel</button>}
          </li>
        ))}
      </ul>
    </section>
  )
}
