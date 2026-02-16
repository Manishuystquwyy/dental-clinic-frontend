import { useState } from 'react'
import { Link } from 'react-router-dom'
import { forgotPassword } from '../api/auth'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSubmitting(true)
    try {
      await forgotPassword({ email })
      setSuccess('If an account exists for this email, a reset token has been sent.')
    } catch (err) {
      setError(err.message || 'Unable to send reset email.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Forgot Password</h2>
        <p>Enter your email to receive a reset token.</p>

        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        {error && <p className="form-error">{error}</p>}
        {success && <p className="form-success">{success}</p>}

        <button type="submit" className="primary" disabled={submitting}>
          {submitting ? 'Sending...' : 'Send Reset Email'}
        </button>

        <p>
          Have a token? <Link to="/reset-password">Reset password</Link>
        </p>
        <p>
          Back to <Link to="/login">Login</Link>
        </p>
      </form>
    </section>
  )
}
