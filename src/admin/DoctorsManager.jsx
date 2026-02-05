import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import ProtectedRoute from '../components/ProtectedRoute'

function loadDoctors() {
  return JSON.parse(localStorage.getItem('gayatri_doctors') || '[]')
}

function saveDoctors(doctors) {
  localStorage.setItem('gayatri_doctors', JSON.stringify(doctors))
}

export default function DoctorsManagerPage() {
  const { user } = useAuth()
  const [doctors, setDoctors] = useState([])
  const [form, setForm] = useState({ id: '', name: '', specialization: '', experience: '' })
  const [editing, setEditing] = useState(null)

  useEffect(() => {
    const stored = loadDoctors()
    setDoctors(stored.length > 0 ? stored : [
      { id: 'd1', name: 'Dr. Anita Sharma', specialization: 'Endodontist', experience: '8 years' },
      { id: 'd2', name: 'Dr. Ramesh Gupta', specialization: 'Orthodontist', experience: '10 years' },
      { id: 'd3', name: 'Dr. Priya Nair', specialization: 'Prosthodontist', experience: '6 years' }
    ])
  }, [])

  function addDoctor(e) {
    e.preventDefault()
    if (!form.name || !form.specialization) {
      alert('Please fill all fields')
      return
    }
    const newDoc = { ...form, id: form.id || 'doc_' + Date.now() }
    const updated = editing ? doctors.map(d => d.id === editing ? newDoc : d) : [...doctors, newDoc]
    setDoctors(updated)
    saveDoctors(updated)
    setForm({ id: '', name: '', specialization: '', experience: '' })
    setEditing(null)
  }

  function editDoctor(doc) {
    setForm(doc)
    setEditing(doc.id)
  }

  function deleteDoctor(id) {
    const updated = doctors.filter(d => d.id !== id)
    setDoctors(updated)
    saveDoctors(updated)
  }

  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <section className="manager-page">
        <h2>Manage Doctors</h2>
        
        <form className="manager-form" onSubmit={addDoctor}>
          <h3>{editing ? 'Edit' : 'Add'} Doctor</h3>
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            placeholder="Specialization"
            value={form.specialization}
            onChange={(e) => setForm({ ...form, specialization: e.target.value })}
            required
          />
          <input
            placeholder="Experience"
            value={form.experience}
            onChange={(e) => setForm({ ...form, experience: e.target.value })}
          />
          <button type="submit" className="primary">{editing ? 'Update' : 'Add'} Doctor</button>
          {editing && <button type="button" onClick={() => { setEditing(null); setForm({ id: '', name: '', specialization: '', experience: '' }) }}>Cancel</button>}
        </form>

        <table className="manager-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Specialization</th>
              <th>Experience</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map(doc => (
              <tr key={doc.id}>
                <td>{doc.name}</td>
                <td>{doc.specialization}</td>
                <td>{doc.experience}</td>
                <td>
                  <button onClick={() => editDoctor(doc)}>Edit</button>
                  <button onClick={() => deleteDoctor(doc.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </ProtectedRoute>
  )
}
