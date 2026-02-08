import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getDentists } from '../api/dentists'

export default function Doctors() {
  const [doctors, setDoctors] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    getDentists()
      .then((data) => {
        if (active) setDoctors(data || [])
      })
      .catch((err) => {
        if (active) setError(err.message || 'Unable to load doctors.')
      })
    return () => {
      active = false
    }
  }, [])

  return (
    <section className="doctors-page">
      <h2>Our Doctors</h2>
      {error && <p className="form-error">{error}</p>}
      <div className="doctors-list">
        {doctors.map((d) => (
          <div key={d.id} className="doctor-card">
            <div>
              <h3>{d.name}</h3>
              <p>Experience: {d.experienceYears} years</p>
              <p>{d.email || 'No email listed'}</p>
            </div>
            <div>
              <Link to={`/doctors/${d.id}`} className="primary">View</Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
