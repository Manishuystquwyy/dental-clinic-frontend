import { apiFetch } from './client'

export function getTreatments() {
  return apiFetch('/treatments')
}

export function createTreatment(payload) {
  return apiFetch('/treatments', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function updateTreatment(id, payload) {
  return apiFetch(`/treatments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export function deleteTreatment(id) {
  return apiFetch(`/treatments/${id}`, {
    method: 'DELETE',
  })
}
