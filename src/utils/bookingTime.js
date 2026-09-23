// Appointment dates and times always refer to the clinic in India.
const clinicFormatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Kolkata',
  year: 'numeric', month: '2-digit', day: '2-digit',
  hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
})

export function clinicDateTime(now = new Date()) {
  const parts = Object.fromEntries(clinicFormatter.formatToParts(now).map(({ type, value }) => [type, value]))
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}`
}

export function clinicToday(now = new Date()) {
  return clinicDateTime(now).slice(0, 10)
}

export function isFutureSlot(date, time, now = new Date()) {
  if (!date || !time) return false
  const slotTime = time.length === 5 ? `${time}:00` : time
  return `${date}T${slotTime}` > clinicDateTime(now)
}
