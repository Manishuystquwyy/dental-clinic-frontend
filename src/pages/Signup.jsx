import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState('PATIENT')
  const { signup } = useAuth()
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()
    if (password !== confirmPassword) {
      alert('Passwords do not match!')
      return
    }
    signup(email, password, role, name)
    alert(`Account created as ${role}!`)
    navigate('/')
  }

  return (
    <section className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Sign Up</h2>

        <label>
          Name
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </label>

        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>

        <label>
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>

        <label>
          Confirm Password
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        </label>

        <label>
          Role
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="PATIENT">Patient</option>
            <option value="DOCTOR">Doctor</option>
          </select>
        </label>

        <button type="submit" className="primary">Sign Up</button>
        <p>
          Already have an account? <a href="/login">Login</a>
        </p>
      </form>
    </section>
  )
}
