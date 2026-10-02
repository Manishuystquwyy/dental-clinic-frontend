import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../context/AuthContext'

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim()
let scriptPromise

function loadGoogle() {
  if (window.google?.accounts?.id) return Promise.resolve(window.google)
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      const timeout = window.setTimeout(() => {
        script.remove()
        reject(new Error('Google sign-in could not load. Please check your connection and retry.'))
      }, 15000)
      script.onload = () => {
        window.clearTimeout(timeout)
        resolve(window.google)
      }
      script.onerror = () => {
        window.clearTimeout(timeout)
        script.remove()
        reject(new Error('Google sign-in could not load. Please check your connection and retry.'))
      }
      document.head.appendChild(script)
    }).catch((error) => {
      scriptPromise = undefined
      throw error
    })
  }
  return scriptPromise
}

export default function GoogleSignIn({ onSuccess, disabled = false }) {
  const { loginWithGoogle } = useAuth()
  const buttonRef = useRef(null)
  const latest = useRef(null)
  const busyRef = useRef(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [credential, setCredential] = useState('')
  const [email, setEmail] = useState('')
  const [profile, setProfile] = useState(null)
  const [attempt, setAttempt] = useState(0)

  async function authenticate(token, details) {
    if (busyRef.current || disabled) return
    busyRef.current = true
    setBusy(true)
    setError('')
    try {
      const response = await loginWithGoogle(token, details)
      if (response.registrationRequired) {
        setCredential(token)
        setEmail(response.email)
        setProfile({ firstName: response.firstName || '', lastName: response.lastName || '', phone: '', gender: '' })
      } else {
        setCredential('')
        onSuccess(response.user)
      }
    } catch (err) {
      setError(err.message || 'Google sign-in failed. Please try again.')
    } finally {
      busyRef.current = false
      setBusy(false)
    }
  }

  useEffect(() => {
    latest.current = authenticate
  })

  useEffect(() => {
    if (!clientId || profile) return
    let active = true
    loadGoogle().then((google) => {
      if (!active || !buttonRef.current) return
      google.accounts.id.initialize({
        client_id: clientId,
        auto_select: false,
        callback: (response) => {
          if (active && response.credential) latest.current(response.credential)
        },
      })
      buttonRef.current.replaceChildren()
      google.accounts.id.renderButton(buttonRef.current, {
        type: 'standard', theme: 'outline', size: 'large', text: 'continue_with',
        width: Math.min(360, buttonRef.current.clientWidth || 280),
      })
    }).catch((err) => { if (active) setError(err.message) })
    return () => { active = false }
  }, [attempt, profile])

  if (!clientId) return null

  function update(field, value) {
    setProfile((current) => ({ ...current, [field]: value }))
  }

  return (
    <div className="google-sign-in">
      <p className="google-sign-in-divider">or</p>
      {!profile && <div ref={buttonRef} inert={busy || disabled} aria-label="Continue with Google" />}
      {profile && (
        <form onSubmit={(event) => { event.preventDefault(); authenticate(credential, profile) }}>
          <h3>Complete your patient account</h3>
          <p>Continue as {email}. Add your details so the clinic can contact you.</p>
          <fieldset disabled={busy || disabled} className="google-profile-fields">
            <label>First name<input required maxLength={100} value={profile.firstName} onChange={(e) => update('firstName', e.target.value)} autoComplete="given-name" /></label>
            <label>Last name<input required maxLength={100} value={profile.lastName} onChange={(e) => update('lastName', e.target.value)} autoComplete="family-name" /></label>
            <label>Mobile number<input required type="tel" pattern="[6-9][0-9]{9}" maxLength={10} title="10-digit Indian mobile number starting with 6, 7, 8, or 9" value={profile.phone} onChange={(e) => update('phone', e.target.value)} autoComplete="tel-national" /></label>
            <label>Gender<select required value={profile.gender} onChange={(e) => update('gender', e.target.value)}>
              <option value="">Select gender</option>
              {['Male', 'Female', 'Other', 'Prefer not to say'].map((gender) => <option key={gender}>{gender}</option>)}
            </select></label>
            <button type="submit" className="primary">{busy ? 'Creating account...' : 'Complete sign-up'}</button>
            <button type="button" onClick={() => { setProfile(null); setCredential(''); setError('') }}>Use another Google account</button>
          </fieldset>
        </form>
      )}
      {busy && !profile && <p role="status">Signing in with Google...</p>}
      {error && <p className="form-error" role="alert">{error}</p>}
      {error && !profile && <button type="button" disabled={busy} onClick={() => { setError(''); setAttempt((value) => value + 1) }}>Retry Google sign-in</button>}
    </div>
  )
}
