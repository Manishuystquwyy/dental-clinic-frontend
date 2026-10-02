import { useEffect, useState } from 'react'
import { getDentists } from '../api/dentists'
export default function useDentists() {
  const [state, setState] = useState({ doctors: [], loading: true, error: '' })
  useEffect(() => {
    let active = true
    getDentists().then(data => { if (active) setState({ doctors: Array.isArray(data) ? data : [], loading: false, error: '' }) })
      .catch(() => { if (active) setState({ doctors: [], loading: false, error: 'Our care team could not be loaded. Please refresh or call the clinic for an appointment.' }) })
    return () => { active = false }
  }, [])
  return state
}
