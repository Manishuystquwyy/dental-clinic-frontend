export function resolvePictureUrl(url) {
  if (!url) return ''
  if (/^https?:\/\//i.test(url) || url.startsWith('data:')) return url
  if (url.startsWith('/')) {
    const apiBase = import.meta.env.VITE_API_BASE_URL || '/api'
    if (/^https?:\/\//i.test(apiBase)) {
      const base = apiBase.replace(/\/+$/, '')
      return base.endsWith('/api') ? `${base.slice(0, -4)}${url}` : `${base}${url}`
    }
    return url
  }

  const apiBase = import.meta.env.VITE_API_BASE_URL || '/api'
  return `${apiBase.replace(/\/+$/, '')}/${url.replace(/^\/+/, '')}`
}
