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
  const res = await authenticatedFetch(path, options)
  if (options.responseType === 'blob') return res.blob()
  if (res.status === 204) return null
  return readResponse(res)
}

async function authenticatedFetch(path, options) {
  const token = getAuthToken()
  const { headers, responseType: _responseType, ...fetchOptions } = options
  const res = await fetch(buildUrl(path), {
    ...fetchOptions,
    headers: {
      ...(typeof options.body === 'string' ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers || {}),
    },
  })
  if (!res.ok) await readResponse(res)
  return res
}

async function readResponse(res) {
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
      data?.message ||
      data?.error ||
      validationMessage ||
      res.statusText ||
      'Request failed'
    const error = new Error(message)
    error.status = res.status
    if (res.status === 400 && data && typeof data === 'object' && !Array.isArray(data) && !data.message && !data.error) {
      error.fieldErrors = Object.fromEntries(Object.entries(data).filter(([, value]) => typeof value === 'string'))
    }
    throw error
  }

  return data
}
