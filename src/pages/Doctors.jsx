import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getDentists } from '../api/dentists'
import { resolvePictureUrl } from '../utils/media'

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
            <div className="doctor-card-main">
              <div className="doctor-photo" aria-hidden={!d.pictureUrl}>
                <div className="doctor-photo-fallback" aria-hidden="true">
                  {(d.name || 'Doctor').split(' ').map((s) => s[0]).slice(0, 2).join('').toUpperCase()}
                </div>
                {d.pictureUrl && (
                  <img
                    src={resolvePictureUrl(d.pictureUrl)}
                    alt={`Dr. ${d.name}`}
                    loading="lazy"
                    onError={(e) => { e.currentTarget.style.display = 'none' }}
                  />
                )}
              </div>
              <div className="doctor-meta">
                <h3>{d.name}</h3>
                <p>Experience: {d.experienceYears} years</p>
                <p>Qualification: {d.qualification || '—'}</p>
                <p>Specialization: {d.specialization || '—'}</p>
              </div>
            </div>
            <div className="doctor-actions">
              <Link to={`/doctors/${d.id}`} className="primary">View</Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
