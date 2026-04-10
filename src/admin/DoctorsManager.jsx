import { useState, useEffect } from 'react'
import ProtectedRoute from '../components/ProtectedRoute'
import {
  createDentist,
  deleteDentist,
  getDentists,
  updateDentist,
} from '../api/dentists'

export default function DoctorsManagerPage() {
  const [doctors, setDoctors] = useState([])
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    experienceYears: '',
    qualification: '',
    specialization: '',
    pictureUrl: '',
  })
  const [editing, setEditing] = useState(null)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadDoctors()
  }, [])

  async function loadDoctors() {
    try {
      setError('')
      setDoctors(await getDentists())
    } catch (err) {
      setError(err.message || 'Unable to load doctors.')
    }
  }

  function editDoctor(doc) {
    setForm({
      name: doc.name || '',
      phone: doc.phone || '',
      email: doc.email || '',
      experienceYears: String(doc.experienceYears ?? ''),
      qualification: doc.qualification || '',
      specialization: doc.specialization || '',
      pictureUrl: doc.pictureUrl || '',
    })
    setEditing(doc.id)
  }

  function resetForm() {
    setForm({
      name: '',
      phone: '',
      email: '',
      experienceYears: '',
      qualification: '',
      specialization: '',
      pictureUrl: '',
    })
    setEditing(null)
  }

  async function saveDoctor(event) {
    event.preventDefault()
    setSubmitting(true)
    setError('')

    const payload = {
      ...form,
      email: form.email || null,
      qualification: form.qualification || null,
      specialization: form.specialization || null,
      pictureUrl: form.pictureUrl || null,
      experienceYears: Number(form.experienceYears || 0),
    }

    try {
      const saved = editing
        ? await updateDentist(editing, payload)
        : await createDentist(payload)

      setDoctors((prev) => {
        if (editing) {
          return prev.map((doctor) => (doctor.id === editing ? saved : doctor))
        }
        return [...prev, saved]
      })
      resetForm()
    } catch (err) {
      setError(err.message || 'Unable to save doctor.')
    } finally {
      setSubmitting(false)
    }
  }

  async function removeDoctor(id) {
    try {
      setError('')
      await deleteDentist(id)
      setDoctors((prev) => prev.filter((doctor) => doctor.id !== id))
      if (editing === id) {
        resetForm()
      }
    } catch (err) {
      setError(err.message || 'Unable to delete doctor.')
    }
  }

  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <section className="manager-page">
        <h2>Manage Doctors</h2>

        {error && <p className="form-error">{error}</p>}

        <form className="manager-form" onSubmit={saveDoctor}>
          <h3>{editing ? 'Edit' : 'Add'} Doctor</h3>
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            required
          />
          <input
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            placeholder="Specialization"
            value={form.specialization}
            onChange={(e) => setForm({ ...form, specialization: e.target.value })}
          />
          <input
            placeholder="Qualification"
            value={form.qualification}
            onChange={(e) => setForm({ ...form, qualification: e.target.value })}
          />
          <input
            placeholder="Experience in years"
            type="number"
            min="0"
            value={form.experienceYears}
            onChange={(e) => setForm({ ...form, experienceYears: e.target.value })}
          />
          <input
            placeholder="Picture URL"
            value={form.pictureUrl}
            onChange={(e) => setForm({ ...form, pictureUrl: e.target.value })}
          />
          <button type="submit" className="primary" disabled={submitting}>
            {submitting ? 'Saving...' : editing ? 'Update' : 'Add'} Doctor
          </button>
          {editing && <button type="button" onClick={resetForm}>Cancel</button>}
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
            {doctors.map((doc) => (
              <tr key={doc.id}>
                <td>{doc.name}</td>
                <td>{doc.specialization || '-'}</td>
                <td>{doc.experienceYears} years</td>
                <td>
                  <button onClick={() => editDoctor(doc)}>Edit</button>
                  <button onClick={() => removeDoctor(doc.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </ProtectedRoute>
  )
}
