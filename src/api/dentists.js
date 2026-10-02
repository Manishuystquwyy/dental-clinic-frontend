import { apiFetch } from './client'

const pendingDentistRequests = new Map()

export function getDentists() {
  // Share concurrent loads (including StrictMode's effect replay), without
  // caching completed results or sharing a request across login changes.
  const token = localStorage.getItem('gayatri_token')
  if (!pendingDentistRequests.has(token)) {
    const request = apiFetch('/dentists').finally(() => {
      pendingDentistRequests.delete(token)
    })
    pendingDentistRequests.set(token, request)
  }
  return pendingDentistRequests.get(token)
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
