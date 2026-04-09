import { apiFetch } from './client'

export function getDentists() {
  return apiFetch('/dentists')
}

export function getDentist(id) {
  return apiFetch(`/dentists/${id}`)
}

export function createDentist(payload) {
  return apiFetch('/dentists', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function updateDentist(id, payload) {
  return apiFetch(`/dentists/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export function deleteDentist(id) {
  return apiFetch(`/dentists/${id}`, {
    method: 'DELETE',
  })
}
