function resolveApiBaseUrl() {
  const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim()

  if (typeof window !== 'undefined') {
    const isLocalHost = ['localhost', '127.0.0.1'].includes(window.location.hostname)

    // In local dev/preview, talk to the Spring Boot app directly so form submissions
    // do not depend on a Vite proxy being present.
    if (isLocalHost && (!configuredBaseUrl || configuredBaseUrl === '/api')) {
      return 'http://localhost:8080/api'
    }
  }

  return configuredBaseUrl || '/api'
}

const API_BASE_URL = resolveApiBaseUrl()

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
    const validationMessage =
      data && typeof data === 'object' && !Array.isArray(data)
        ? Object.values(data).filter(Boolean).join(', ')
        : ''

    const message =
      (typeof data === 'string' ? data : null) ||
      validationMessage ||
      data?.message ||
      data?.error ||
      res.statusText ||
      'Request failed'
    throw new Error(message)
  }

  return data
}
