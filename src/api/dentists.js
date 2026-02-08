import { apiFetch } from './client'

export function getDentists() {
  return apiFetch('/dentists')
}

export function getDentist(id) {
  return apiFetch(`/dentists/${id}`)
}
