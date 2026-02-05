import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('PATIENT')
  const { login } = useAuth()
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()
    login(email, password, role)
    alert(`Logged in as ${role}!`)
    navigate('/')
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

        <label>
          Role
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="PATIENT">Patient</option>
            <option value="DOCTOR">Doctor</option>
            <option value="ADMIN">Admin</option>
          </select>
        </label>

        <button type="submit" className="primary">Login</button>
        <p>
          Don't have an account? <a href="/signup">Sign up</a>
        </p>
      </form>
    </section>
  )
}
