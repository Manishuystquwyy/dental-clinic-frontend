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

export function getMyDoctorAppointments() {
  return apiFetch('/doctors/me/appointments')
}

export function getAppointmentAvailability(dentistId, appointmentDate) {
  const params = new URLSearchParams({ dentistId, appointmentDate })
  return apiFetch(`/appointments/availability?${params}`)
}

export function updateAppointment(id, payload) {
  return apiFetch(`/appointments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export function deleteAppointment(id) {
  return apiFetch(`/appointments/${id}`, {
    method: 'DELETE',
  })
}
