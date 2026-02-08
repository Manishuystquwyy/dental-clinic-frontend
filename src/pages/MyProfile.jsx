import { useEffect, useState } from 'react'
import { getMyProfile, updateMyProfile } from '../api/patients'
import { useAuth } from '../context/AuthContext'

export default function MyProfile() {
  const { user } = useAuth()
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    dateOfBirth: '',
    phone: '',
    email: '',
    address: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    let active = true
    getMyProfile()
      .then((data) => {
        if (!active) return
        setForm({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          gender: data.gender || '',
          dateOfBirth: data.dateOfBirth || '',
          phone: data.phone || '',
          email: data.email || '',
          address: data.address || '',
        })
      })
      .catch((err) => {
        if (active) setError(err.message || 'Unable to load profile.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      await updateMyProfile({
        firstName: form.firstName,
        lastName: form.lastName,
        gender: form.gender || null,
        dateOfBirth: form.dateOfBirth || null,
        phone: form.phone,
        email: form.email || null,
        address: form.address || null,
      })
      setSuccess('Profile updated.')
    } catch (err) {
      setError(err.message || 'Update failed.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p>Loading...</p>

  return (
    <section className="profile-page">
      <h2>My Profile</h2>
      <p>Logged in as {user?.email}</p>
      <form className="profile-form" onSubmit={handleSubmit}>
        <label>
          First name
          <input value={form.firstName} onChange={(e) => updateField('firstName', e.target.value)} required />
        </label>
        <label>
          Last name
          <input value={form.lastName} onChange={(e) => updateField('lastName', e.target.value)} required />
        </label>
        <label>
          Gender
          <input value={form.gender} onChange={(e) => updateField('gender', e.target.value)} />
        </label>
        <label>
          Date of birth
          <input type="date" value={form.dateOfBirth} onChange={(e) => updateField('dateOfBirth', e.target.value)} />
        </label>
        <label>
          Phone
          <input value={form.phone} onChange={(e) => updateField('phone', e.target.value)} required />
        </label>
        <label>
          Email
          <input type="email" value={form.email} onChange={(e) => updateField('email', e.target.value)} required />
        </label>
        <label>
          Address
          <input value={form.address} onChange={(e) => updateField('address', e.target.value)} />
        </label>

        {error && <p className="form-error">{error}</p>}
        {success && <p className="form-success">{success}</p>}

        <button type="submit" className="primary" disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </section>
  )
}
