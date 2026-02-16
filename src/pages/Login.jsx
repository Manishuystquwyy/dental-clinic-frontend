import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from?.pathname || '/'

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(email, password)
      alert('Logged in successfully!')
      navigate(redirectTo)
    } catch (err) {
      setError(err.message || 'Login failed.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>

        <label>
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <p style={{ marginTop: '-0.5rem' }}>
          <a href="/forgot-password">Forgot password?</a>
        </p>

        {error && <p className="form-error">{error}</p>}
        <button type="submit" className="primary" disabled={submitting}>
          {submitting ? 'Logging in...' : 'Login'}
        </button>
        <p>
          Don't have an account? <a href="/signup">Sign up</a>
        </p>
      </form>
    </section>
  )
}
