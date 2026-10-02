import { useNotifications } from '../context/NotificationContext'
import { useRef, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { validateAddress } from '../utils/addressValidation'
import { useAuth } from '../context/AuthContext'
import { earliestBirthDate, genderOptions, localToday, normalizeSignup, validateSignup } from '../utils/signupValidation'

const initialValues = {
  firstName: '', lastName: '', email: '', phone: '', gender: '',
  dateOfBirth: '', address: '', password: '', confirmPassword: '',
}

export default function Signup() {
  const { notify } = useNotifications()
  const [values, setValues] = useState(initialValues)
  const [visiblePasswords, setVisiblePasswords] = useState({ password: false, confirmPassword: false })
  const [errors, setErrors] = useState({})
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const pending = useRef(false)
  const form = useRef(null)
  const { signup } = useAuth()
  const navigate = useNavigate()

  function focusError(nextErrors) {
    form.current?.elements.namedItem(Object.keys(nextErrors)[0])?.focus()
  }

  function change(e) {
    const { name, value } = e.target
    setValues((previous) => ({ ...previous, [name]: value }))
    setErrors((previous) => ({ ...previous, [name]: undefined, ...(name === 'password' ? { confirmPassword: undefined } : {}) }))
    setError('')
  }

  function inputProps(name) {
    return {
      id: name, name, value: values[name], onChange: change,
      'aria-invalid': Boolean(errors[name]),
      'aria-describedby': errors[name] ? `${name}-error` : undefined,
    }
  }

  function fieldError(name) {
    return errors[name] && <span id={`${name}-error`} className="form-error" role="alert">{errors[name]}</span>
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (pending.current) return
    setError('')
    const nextErrors = validateSignup(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) {
      focusError(nextErrors)
      return
    }
    pending.current = true
    setSubmitting(true)
    try {
      await signup(normalizeSignup(values))
      notify('Your account is ready. Welcome to Gayatri Dental Clinic.', { title: 'Account created' })
      navigate('/')
    } catch (err) {
      const fieldErrors = Object.fromEntries(Object.entries(err.fieldErrors || {}).filter(([key]) => key in initialValues))
      if (Object.keys(fieldErrors).length) {
        setErrors(fieldErrors)
        focusError(fieldErrors)
      } else setError(err.message || 'Signup failed.')
    } finally {
      pending.current = false
      setSubmitting(false)
    }
  }

  return (
    <section className="auth-page">
      <form ref={form} className="auth-form" onSubmit={handleSubmit} noValidate aria-busy={submitting}>
        <h2>Sign Up</h2>
        <label htmlFor="firstName">First name
          <input {...inputProps('firstName')} type="text" autoComplete="given-name" maxLength={100} required />
          {fieldError('firstName')}
        </label>
        <label htmlFor="lastName">Last name
          <input {...inputProps('lastName')} type="text" autoComplete="family-name" maxLength={100} required />
          {fieldError('lastName')}
        </label>
        <label htmlFor="email">Email
          <input {...inputProps('email')} type="email" autoComplete="email" maxLength={254} required />
          {fieldError('email')}
        </label>
        <label htmlFor="phone">Phone
          <input {...inputProps('phone')} type="tel" inputMode="numeric" autoComplete="tel" minLength={10} maxLength={10} pattern="[6-9][0-9]{9}" required />
          {fieldError('phone')}
        </label>
        <label htmlFor="gender">Gender
          <select {...inputProps('gender')} required>
            <option value="">Select gender</option>
            {genderOptions.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
          {fieldError('gender')}
        </label>
        <label htmlFor="dateOfBirth">Date of birth (optional)
          <input {...inputProps('dateOfBirth')} type="date" min={earliestBirthDate()} max={localToday()} autoComplete="bday" />
          {fieldError('dateOfBirth')}
        </label>
        <label htmlFor="address">Address (optional)
          <textarea {...inputProps('address')} autoComplete="street-address" rows={3} maxLength={255}
            placeholder="House/building, street, area, city and postal code"
            onBlur={() => setErrors((previous) => ({ ...previous, address: validateAddress(values.address) }))} />
          {fieldError('address')}
        </label>
        {['password', 'confirmPassword'].map((name) => {
          const visible = visiblePasswords[name]
          const label = name === 'password' ? 'Password' : 'Confirm password'
          return (
            <div className="auth-password-field" key={name}>
              <label htmlFor={name}>{label}</label>
              <div className="auth-password-control">
                <input {...inputProps(name)} type={visible ? 'text' : 'password'} autoComplete="new-password"
                  minLength={name === 'password' ? 8 : undefined} required />
                <button type="button" className="auth-password-toggle" aria-label={`${visible ? 'Hide' : 'Show'} ${label.toLowerCase()}`}
                  aria-controls={name}
                  onClick={() => setVisiblePasswords((previous) => ({ ...previous, [name]: !previous[name] }))}>
                  {visible ? <EyeOff size={20} aria-hidden="true" /> : <Eye size={20} aria-hidden="true" />}
                </button>
              </div>
              {fieldError(name)}
            </div>
          )
        })}
        {error && <p className="form-error" role="alert">{error}</p>}
        <button type="submit" className="primary" disabled={submitting}>
          {submitting ? 'Creating...' : 'Sign Up'}
        </button>
        <p>Already have an account? <a href="/login">Login</a></p>
      </form>
    </section>
  )
}
