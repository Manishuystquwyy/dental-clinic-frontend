import { isFutureSlot } from './bookingTime.js'

export function canCompleteAppointment(appointment, now = new Date()) {
  return appointment.status === 'BOOKED'
    && Boolean(appointment.appointmentDate && appointment.appointmentTime)
    && !isFutureSlot(appointment.appointmentDate, appointment.appointmentTime, now)
}
