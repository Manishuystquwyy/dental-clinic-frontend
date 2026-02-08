const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

function getAuthToken() {
  return localStorage.getItem('gayatri_token')
}

function buildUrl(path) {
  if (!path.startsWith('/')) return `${API_BASE_URL}/${path}`
  return `${API_BASE_URL}${path}`
}

export async function apiFetch(path, options = {}) {
  const token = getAuthToken()
  const res = await fetch(buildUrl(path), {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  })

  if (res.status === 204) return null

  const text = await res.text()
  let data = null
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = text
    }
  }

  if (!res.ok) {
    const message =
      (typeof data === 'string' ? data : null) ||
      data?.message ||
      data?.error ||
      res.statusText ||
      'Request failed'
    throw new Error(message)
  }

  return data
}
