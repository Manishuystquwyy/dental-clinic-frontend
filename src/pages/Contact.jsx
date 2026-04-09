import { useState } from 'react'
import { createPublicRequest } from '../api/publicRequests'

export default function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  function validateForm() {
    if (!/^[6-9]\d{9}$/.test(form.phone.trim())) {
      setError('Phone number must be a valid 10-digit mobile number.')
      return false
    }
    return true
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSuccess('')
    if (!validateForm()) return
    setSubmitting(true)

    try {
      await createPublicRequest({
        ...form,
        name: form.name.trim(),
        phone: form.phone.trim(),
        message: form.message.trim(),
        requestType: 'CONTACT',
      })
      setSuccess('Your request has been sent. We will contact you soon.')
      setForm({ name: '', phone: '', message: '' })
    } catch (err) {
      setError(err.message || 'Unable to send your request.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="contact-page">
      <h2>Contact Us</h2>
      <div className="contact-grid">
        <form className="contact-form" onSubmit={handleSubmit}>
          <label>
            Name
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </label>
          <label>
            Phone
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              inputMode="numeric"
              pattern="[6-9][0-9]{9}"
              maxLength="10"
              title="Enter a valid 10-digit mobile number"
              required
            />
          </label>
          <label>
            Message
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Tell us how we can help you"
              required
            />
          </label>
          {error && <p className="form-error">{error}</p>}
          {success && <p className="form-success">{success}</p>}
          <button type="submit" className="primary" disabled={submitting}>
            {submitting ? 'Sending...' : 'Send Request'}
          </button>
        </form>

        <div className="contact-info">
          <h3>Clinic Details</h3>
          <p>Phone: +91 98765 43210</p>
          <p>Email: info@gayatridental.com</p>
          <p>Share your phone number and a short message, and our team will call you back.</p>
        </div>
      </div>
    </section>
  )
}
