import { useCallback, useEffect, useRef, useState } from 'react'
import { getAppointmentPolicy } from '../api/appointments'
import { isValidAppointmentPolicy } from '../utils/appointmentPolicy'

export default function useAppointmentPolicy() {
  const [state, setState] = useState({ policy: null, loading: true, error: '' })
  const [reloadKey, setReloadKey] = useState(0)
  const requestGenerationRef = useRef(0)

  useEffect(() => {
    let active = true
    const requestGeneration = ++requestGenerationRef.current
    getAppointmentPolicy()
      .then((policy) => {
        if (!active || requestGeneration !== requestGenerationRef.current) return
        if (!isValidAppointmentPolicy(policy)) throw new Error('Appointment change rules are unavailable. Please try again.')
        setState({
          policy: {
            cancellationCutoffHours: policy.cancellationCutoffHours,
            rescheduleCutoffHours: policy.rescheduleCutoffHours,
          },
          loading: false,
          error: '',
        })
      })
      .catch((error) => {
        if (!active || requestGeneration !== requestGenerationRef.current) return
        setState({ policy: null, loading: false, error: error.message || 'Unable to load appointment change rules. Please try again.' })
      })
    return () => { active = false }
  }, [reloadKey])

  const retry = useCallback(() => {
    // Invalidate an in-flight response immediately, before the effect runs again.
    requestGenerationRef.current += 1
    setState({ policy: null, loading: true, error: '' })
    setReloadKey((previous) => previous + 1)
  }, [])

  return { ...state, retry }
}
