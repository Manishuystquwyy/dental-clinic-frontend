import { apiFetch } from './client'

export function createPublicRequest(payload) {
  return apiFetch('/public-requests', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
