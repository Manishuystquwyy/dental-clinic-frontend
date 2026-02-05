import { Link } from 'react-router-dom'
import doctorsData from '../data/doctors.json'

export default function Doctors() {
  return (
    <section className="doctors-page">
      <h2>Our Doctors</h2>
      <div className="doctors-list">
        {doctorsData.map((d) => (
          <div key={d.id} className="doctor-card">
            <div>
              <h3>{d.name}</h3>
              <p>{d.specialization} — {d.experience}</p>
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
