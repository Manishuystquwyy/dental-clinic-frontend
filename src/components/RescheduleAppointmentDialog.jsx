import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { CalendarClock, X } from 'lucide-react'
import { getAppointmentAvailability, updateAppointment } from '../api/appointments'
import useBookingNow from '../hooks/useBookingNow'
import { canChangeAppointmentOnline, clinicToday, isFutureSlot } from '../utils/bookingTime'
import DatePicker from './DatePicker'
import './RescheduleAppointmentDialog.css'

function formatDate(date) {
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

export default function RescheduleAppointmentDialog({ appointment, dentistName, onClose, onRescheduled, policy }) {
  const dialogRef = useRef(null)
  const busyRef = useRef(false)
  const mountedRef = useRef(false)
  const availabilityRequestRef = useRef(0)
  const titleId = useId()
  const descriptionId = useId()
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = clinicToday()
    return appointment.appointmentDate > today ? appointment.appointmentDate : today
  })
  const selectedDateRef = useRef(selectedDate)
  const selectedTimeRef = useRef('')
  const [selectedTime, setSelectedTime] = useState('')
  const [availability, setAvailability] = useState({ date: selectedDate, slots: [], loading: true, error: '' })
  const [reloadKey, setReloadKey] = useState(0)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const now = useBookingNow()
  const today = clinicToday(now)
  const cutoffHours = policy?.rescheduleCutoffHours
  const cutoffMessage = cutoffHours === undefined
    ? 'The clinic appointment policy is unavailable. Please close this dialog and try again.'
    : `Online rescheduling closes ${cutoffHours} ${cutoffHours === 1 ? 'hour' : 'hours'} before the scheduled appointment starts. Please contact the clinic for help.`
  const changesAllowed = canChangeAppointmentOnline(appointment, cutoffHours, now)
  const originalTime = appointment.appointmentTime?.slice(0, 5)
  const availabilityCurrent = availability.date === selectedDate && !availability.loading && !availability.error
  const futureSlots = availabilityCurrent ? availability.slots.filter((time) => (
    isFutureSlot(selectedDate, time, now)
      && !(selectedDate === appointment.appointmentDate && time === originalTime)
  )) : []
  const validSelection = futureSlots.includes(selectedTime)

  useEffect(() => {
    const dialog = dialogRef.current
    const previousFocus = document.activeElement
    mountedRef.current = true
    dialog.showModal()
    return () => {
      mountedRef.current = false
      availabilityRequestRef.current += 1
      dialog.close()
      if (previousFocus?.isConnected) previousFocus.focus()
    }
  }, [])

  useEffect(() => {
    let active = true
    const requestId = ++availabilityRequestRef.current
    setAvailability({ date: selectedDate, slots: [], loading: true, error: '' })

    getAppointmentAvailability(appointment.dentistId, selectedDate)
      .then((data) => {
        if (!active || requestId !== availabilityRequestRef.current || selectedDateRef.current !== selectedDate) return
        const slots = [...new Set((data?.availableSlots || [])
          .filter((slot) => typeof slot === 'string' && /^([01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/.test(slot))
          .map((slot) => slot.slice(0, 5)))].sort()
        setAvailability({ date: selectedDate, slots, loading: false, error: '' })
      })
      .catch((err) => {
        if (!active || requestId !== availabilityRequestRef.current || selectedDateRef.current !== selectedDate) return
        setAvailability({ date: selectedDate, slots: [], loading: false, error: err.message || 'Unable to load available times. Please try again.' })
      })

    return () => { active = false }
  }, [appointment.dentistId, selectedDate, reloadKey])

  function close() {
    if (!busyRef.current) onClose()
  }

  function changeDate(date) {
    if (busyRef.current || !canChangeAppointmentOnline(appointment, cutoffHours) || date === selectedDateRef.current) return
    availabilityRequestRef.current += 1
    selectedDateRef.current = date
    selectedTimeRef.current = ''
    setSelectedDate(date)
    setSelectedTime('')
    setAvailability({ date, slots: [], loading: true, error: '' })
    setSaveError('')
  }

  function refreshAvailability() {
    availabilityRequestRef.current += 1
    selectedTimeRef.current = ''
    setSelectedTime('')
    setAvailability({ date: selectedDateRef.current, slots: [], loading: true, error: '' })
    setReloadKey((previous) => previous + 1)
  }

  async function save(event) {
    event.preventDefault()
    if (busyRef.current) return
    if (!canChangeAppointmentOnline(appointment, cutoffHours)) {
      setSaveError(cutoffMessage)
      return
    }
    if (selectedDate !== selectedDateRef.current || selectedTime !== selectedTimeRef.current || !validSelection || !isFutureSlot(selectedDate, selectedTime, new Date())) {
      selectedTimeRef.current = ''
      setSelectedTime('')
      setSaveError('Choose an available future time that is different from your current appointment.')
      return
    }

    busyRef.current = true
    setSaving(true)
    setSaveError('')
    let updated
    try {
      updated = await updateAppointment(appointment.id, {
        patientId: appointment.patientId,
        dentistId: appointment.dentistId,
        appointmentDate: selectedDate,
        appointmentTime: selectedTime,
        status: appointment.status,
        remarks: appointment.remarks ?? null,
      })
    } catch (err) {
      if (mountedRef.current) {
        setSaveError(err.message || 'Unable to reschedule your appointment. Please choose a time and try again.')
        refreshAvailability()
      }
    } finally {
      busyRef.current = false
      if (mountedRef.current) setSaving(false)
    }
    if (updated && mountedRef.current) onRescheduled(updated)
  }

  return createPortal(
    <dialog
      ref={dialogRef}
      className="reschedule-dialog"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onCancel={(event) => { event.preventDefault(); close() }}
    >
      <div className="reschedule-dialog-heading">
        <div className="reschedule-dialog-icon"><CalendarClock size={24} aria-hidden="true" /></div>
        <button type="button" className="reschedule-dialog-close" aria-label="Close rescheduling dialog" autoFocus disabled={saving} onClick={close}>
          <X size={20} aria-hidden="true" />
        </button>
      </div>
      <h2 id={titleId}>Reschedule appointment</h2>
      <p id={descriptionId} className="reschedule-dialog-description">Choose a new date and available time with {dentistName}.</p>
      <p className="reschedule-current"><span>Current appointment</span><strong>{formatDate(appointment.appointmentDate)} at {originalTime}</strong></p>

      <form onSubmit={save} aria-busy={saving}>
        <fieldset className="reschedule-date-field" disabled={saving || !changesAllowed}>
          <legend>Choose a new date</legend>
          <DatePicker value={selectedDate} minDate={today} onChange={changeDate} />
        </fieldset>

        <fieldset className="reschedule-time-field" disabled={saving || !changesAllowed} aria-busy={availability.loading}>
          <legend>Available times <span>(India time)</span></legend>
          {availability.loading && <p className="reschedule-slot-status" role="status">Loading available times…</p>}
          {availability.error && <div className="reschedule-slot-error" role="alert">
            <p>{availability.error}</p>
            <button type="button" className="secondary" onClick={() => { if (!busyRef.current) refreshAvailability() }}>Retry</button>
          </div>}
          {availabilityCurrent && futureSlots.length === 0 && <p className="reschedule-slot-status" role="status">No other future times are available on this date. Please choose another date.</p>}
          <div className="reschedule-times">
            {futureSlots.map((time) => <button
              key={time}
              type="button"
              aria-pressed={selectedTime === time}
              onClick={() => { if (!busyRef.current) { selectedTimeRef.current = time; setSelectedTime(time); setSaveError('') } }}
            >{time}</button>)}
          </div>
        </fieldset>

        {selectedTime && !validSelection && <p className="reschedule-slot-status" role="status">That time is no longer available. Please choose another time.</p>}
        {saveError && <p className="reschedule-save-error" role="alert">{saveError}</p>}
        {!changesAllowed && !saveError && <p className="reschedule-save-error" role="status">
          {cutoffMessage}
        </p>}
        {saving && <p className="reschedule-slot-status" role="status">Saving your new appointment time…</p>}

        <div className="reschedule-dialog-actions">
          <button type="button" className="secondary" disabled={saving} onClick={close}>Keep current appointment</button>
          <button type="submit" className="primary" disabled={saving || !changesAllowed || !validSelection}>{saving ? 'Saving…' : 'Save new time'}</button>
        </div>
      </form>
    </dialog>, document.body,
  )
}
