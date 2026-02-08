import { apiFetch } from './client'

export function createPatient(payload) {
  return apiFetch('/patients', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function getPatients() {
  return apiFetch('/patients')
}

export function getMyProfile() {
  return apiFetch('/patients/me')
}

export function updateMyProfile(payload) {
  return apiFetch('/patients/me', {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}
