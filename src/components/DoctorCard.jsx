import React from 'react'

export default function DoctorCard({ doctor, onSelect }) {
  return (
    <div className="doctor-card">
      <h3>{doctor.name}</h3>
      <p>{doctor.specialization} — {doctor.experience}</p>
      <button onClick={() => onSelect(doctor)}>Select</button>
    </div>
  )
}
