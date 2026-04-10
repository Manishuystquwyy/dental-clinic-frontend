import { useState, useEffect } from 'react'
import ProtectedRoute from '../components/ProtectedRoute'
import {
  createTreatment,
  deleteTreatment,
  getTreatments,
  updateTreatment,
} from '../api/treatments'

export default function ServicesManager() {
  const [services, setServices] = useState([])
  const [form, setForm] = useState({ appointmentId: '', treatmentName: '', description: '', cost: '' })
  const [editing, setEditing] = useState(null)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadServices()
  }, [])

  async function loadServices() {
    try {
      setError('')
      setServices(await getTreatments())
    } catch (err) {
      setError(err.message || 'Unable to load services.')
    }
  }

  function editService(svc) {
    setForm({
      appointmentId: String(svc.appointmentId ?? ''),
      treatmentName: svc.treatmentName || '',
      description: svc.description || '',
      cost: String(svc.cost ?? ''),
    })
    setEditing(svc.id)
  }

  function resetForm() {
    setForm({ appointmentId: '', treatmentName: '', description: '', cost: '' })
    setEditing(null)
  }

  async function saveService(event) {
    event.preventDefault()
    setSubmitting(true)
    setError('')

    const payload = {
      appointmentId: Number(form.appointmentId),
      treatmentName: form.treatmentName,
      description: form.description || null,
      cost: Number(form.cost),
    }

    try {
      const saved = editing
        ? await updateTreatment(editing, payload)
        : await createTreatment(payload)
      setServices((prev) => {
        if (editing) {
          return prev.map((service) => (service.id === editing ? saved : service))
        }
        return [...prev, saved]
      })
      resetForm()
    } catch (err) {
      setError(err.message || 'Unable to save service.')
    } finally {
      setSubmitting(false)
    }
  }

  async function removeService(id) {
    try {
      setError('')
      await deleteTreatment(id)
      setServices((prev) => prev.filter((service) => service.id !== id))
      if (editing === id) {
        resetForm()
      }
    } catch (err) {
      setError(err.message || 'Unable to delete service.')
    }
  }

  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <section className="manager-page">
        <h2>Manage Services</h2>

        {error && <p className="form-error">{error}</p>}

        <form className="manager-form" onSubmit={saveService}>
          <h3>{editing ? 'Edit' : 'Add'} Service</h3>
          <input
            placeholder="Appointment ID"
            type="number"
            min="1"
            value={form.appointmentId}
            onChange={(e) => setForm({ ...form, appointmentId: e.target.value })}
            required
          />
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <input
            placeholder="Treatment Name"
            value={form.treatmentName}
            onChange={(e) => setForm({ ...form, treatmentName: e.target.value })}
            required
          />
          <input
            placeholder="Price (₹)"
            type="number"
            min="0"
            step="0.01"
            value={form.cost}
            onChange={(e) => setForm({ ...form, cost: e.target.value })}
            required
          />
          <button type="submit" className="primary" disabled={submitting}>
            {submitting ? 'Saving...' : editing ? 'Update' : 'Add'} Service
          </button>
          {editing && <button type="button" onClick={resetForm}>Cancel</button>}
        </form>

        <table className="manager-table">
          <thead>
            <tr>
              <th>Service</th>
              <th>Description</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((svc) => (
              <tr key={svc.id}>
                <td>{svc.treatmentName}</td>
                <td>{svc.description || `Appointment #${svc.appointmentId}`}</td>
                <td>₹{svc.cost}</td>
                <td>
                  <button onClick={() => editService(svc)}>Edit</button>
                  <button onClick={() => removeService(svc.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </ProtectedRoute>
  )
}
