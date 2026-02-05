import { useState, useEffect } from 'react'
import ProtectedRoute from '../components/ProtectedRoute'

function loadServices() {
  return JSON.parse(localStorage.getItem('gayatri_services') || '[]')
}

function saveServices(services) {
  localStorage.setItem('gayatri_services', JSON.stringify(services))
}

export default function ServicesManager() {
  const [services, setServices] = useState([])
  const [form, setForm] = useState({ id: '', name: '', desc: '', price: '' })
  const [editing, setEditing] = useState(null)

  useEffect(() => {
    const stored = loadServices()
    setServices(stored.length > 0 ? stored : [
      { id: 's1', name: 'General Dentistry', desc: 'Cleanings, exams, fillings', price: '500' },
      { id: 's2', name: 'Cosmetic Dentistry', desc: 'Teeth whitening, veneers', price: '1500' },
      { id: 's3', name: 'Root Canal', desc: 'Endodontic treatment', price: '2000' },
      { id: 's4', name: 'Braces', desc: 'Orthodontic treatment', price: '3000' }
    ])
  }, [])

  function addService(e) {
    e.preventDefault()
    if (!form.name || !form.price) {
      alert('Please fill required fields')
      return
    }
    const newSvc = { ...form, id: form.id || 'svc_' + Date.now() }
    const updated = editing ? services.map(s => s.id === editing ? newSvc : s) : [...services, newSvc]
    setServices(updated)
    saveServices(updated)
    setForm({ id: '', name: '', desc: '', price: '' })
    setEditing(null)
  }

  function editService(svc) {
    setForm(svc)
    setEditing(svc.id)
  }

  function deleteService(id) {
    const updated = services.filter(s => s.id !== id)
    setServices(updated)
    saveServices(updated)
  }

  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <section className="manager-page">
        <h2>Manage Services</h2>

        <form className="manager-form" onSubmit={addService}>
          <h3>{editing ? 'Edit' : 'Add'} Service</h3>
          <input
            placeholder="Service Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <textarea
            placeholder="Description"
            value={form.desc}
            onChange={(e) => setForm({ ...form, desc: e.target.value })}
          />
          <input
            placeholder="Price (₹)"
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
          />
          <button type="submit" className="primary">{editing ? 'Update' : 'Add'} Service</button>
          {editing && <button type="button" onClick={() => { setEditing(null); setForm({ id: '', name: '', desc: '', price: '' }) }}>Cancel</button>}
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
            {services.map(svc => (
              <tr key={svc.id}>
                <td>{svc.name}</td>
                <td>{svc.desc}</td>
                <td>₹{svc.price}</td>
                <td>
                  <button onClick={() => editService(svc)}>Edit</button>
                  <button onClick={() => deleteService(svc.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </ProtectedRoute>
  )
}
