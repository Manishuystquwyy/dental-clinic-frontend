import { apiFetch } from './client'

export function createAppointment(payload) {
  return apiFetch('/appointments', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function getAppointments() {
  return apiFetch('/appointments')
}

export function updateAppointment(id, payload) {
  return apiFetch(`/appointments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}
