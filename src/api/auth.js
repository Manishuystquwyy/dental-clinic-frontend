import { apiFetch } from './client'

export function register(payload) {
  return apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function login(payload) {
  return apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function me() {
  return apiFetch('/auth/me')
}

export function forgotPassword(payload) {
  return apiFetch('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function resetPassword(payload) {
  return apiFetch('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
