function resolveApiBaseUrl() {
  const base = import.meta.env.VITE_API_BASE_URL?.trim() || ''
  return base.endsWith('/api') ? base : `${base}/api`
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
