import React from 'react'
import { resolvePictureUrl } from '../utils/media'

export default function DoctorCard({ doctor, onSelect }) {
  return (
    <div className="doctor-card">
      <div className="doctor-card-main">
        <div className="doctor-photo" aria-hidden={!doctor.pictureUrl}>
          <div className="doctor-photo-fallback" aria-hidden="true">
            {(doctor.name || 'Doctor').split(' ').map((s) => s[0]).slice(0, 2).join('').toUpperCase()}
          </div>
          {doctor.pictureUrl && (
            <img
              src={resolvePictureUrl(doctor.pictureUrl)}
              alt={`Dr. ${doctor.name}`}
              loading="lazy"
              onError={(e) => { e.currentTarget.style.display = 'none' }}
            />
          )}
        </div>
        <div className="doctor-meta">
          <h3>{doctor.name}</h3>
          <p>Experience: {doctor.experienceYears} years</p>
          <p>Qualification: {doctor.qualification || '—'}</p>
          <p>Specialization: {doctor.specialization || '—'}</p>
        </div>
      </div>
      <div className="doctor-actions">
        <button type="button" className="primary" onClick={() => onSelect(doctor)}>Select</button>
      </div>
    </div>
  )
}
