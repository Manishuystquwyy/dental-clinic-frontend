const STORAGE_KEY = 'gayatri_pending_booking'

export function savePendingBooking(booking) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(booking))
}

export function loadPendingBooking() {
  const raw = sessionStorage.getItem(STORAGE_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw)
  } catch {
    sessionStorage.removeItem(STORAGE_KEY)
    return null
  }
}

export function clearPendingBooking() {
  sessionStorage.removeItem(STORAGE_KEY)
}
