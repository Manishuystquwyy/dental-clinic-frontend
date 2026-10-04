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

// Online changes close the configured number of hours before the original appointment starts in India.
// Appointment status is checked by callers independently of this timing rule.
export function canChangeAppointmentOnline(appointment, cutoffHours, now = new Date()) {
  const date = appointment?.appointmentDate
  const time = appointment?.appointmentTime
  if (typeof date !== 'string' || !/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(date)
    || typeof time !== 'string' || !/^([01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/.test(time)
    || !(now instanceof Date) || !Number.isFinite(now.getTime())
    || !Number.isSafeInteger(cutoffHours) || cutoffHours < 0) return false

  // Date.parse normalizes some impossible dates, so reject those explicitly.
  const dateInstant = Date.parse(`${date}T00:00:00Z`)
  if (!Number.isFinite(dateInstant) || new Date(dateInstant).toISOString().slice(0, 10) !== date) return false

  const normalizedTime = time.length === 5 ? `${time}:00` : time
  const startsAt = Date.parse(`${date}T${normalizedTime}+05:30`)
  return Number.isFinite(startsAt) && now.getTime() <= startsAt - cutoffHours * 60 * 60 * 1000
}
