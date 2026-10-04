import { test } from 'node:test'
import assert from 'node:assert/strict'
import { canChangeAppointmentOnline, clinicToday, isFutureSlot } from '../src/utils/bookingTime.js'

test('clinic calendar advances at midnight in India, while UTC is still yesterday', () => {
  const now = new Date('2026-09-23T19:00:00Z')
  assert.equal(clinicToday(now), '2026-09-24')
  assert.equal(isFutureSlot('2026-09-23', '18:00', now), false)
  assert.equal(isFutureSlot('2026-09-24', '10:30', now), true)
})

test('slots expire exactly at their start, including seconds returned by the API', () => {
  assert.equal(isFutureSlot('2026-09-24', '14:00', new Date('2026-09-24T08:29:59Z')), true)
  for (const now of ['2026-09-24T08:30:00Z', '2026-09-24T08:30:01Z']) {
    for (const slot of ['14:00', '14:00:00']) {
      assert.equal(isFutureSlot('2026-09-24', slot, new Date(now)), false)
    }
  }
  assert.equal(isFutureSlot('2026-09-24', '14:30', new Date('2026-09-24T08:30:00Z')), true)
  assert.equal(isFutureSlot('2026-09-25', '10:30', new Date('2026-09-24T13:00:00Z')), true)
})

test('clinic date rolls over across month and year boundaries', () => {
  assert.equal(clinicToday(new Date('2026-09-30T18:29:59Z')), '2026-09-30')
  assert.equal(clinicToday(new Date('2026-09-30T18:30:00Z')), '2026-10-01')
  assert.equal(clinicToday(new Date('2026-12-31T18:30:00Z')), '2027-01-01')
})

test('online changes close immediately after the inclusive 12-hour cutoff', () => {
  for (const appointmentTime of ['10:30', '10:30:00']) {
    const appointment = { appointmentDate: '2026-10-05', appointmentTime }
    assert.equal(canChangeAppointmentOnline(appointment, 12, new Date('2026-10-04T16:59:59.999Z')), true)
    assert.equal(canChangeAppointmentOnline(appointment, 12, new Date('2026-10-04T17:00:00.000Z')), true)
    assert.equal(canChangeAppointmentOnline(appointment, 12, new Date('2026-10-04T17:00:00.001Z')), false)
  }
})

test('online changes use the stored start time including API seconds', () => {
  const appointment = { appointmentDate: '2026-10-05', appointmentTime: '10:30:15' }
  assert.equal(canChangeAppointmentOnline(appointment, 12, new Date('2026-10-04T17:00:14.999Z')), true)
  assert.equal(canChangeAppointmentOnline(appointment, 12, new Date('2026-10-04T17:00:15.000Z')), true)
  assert.equal(canChangeAppointmentOnline(appointment, 12, new Date('2026-10-04T17:00:15.001Z')), false)
})

test('same-day appointments have separate cutoffs based on their start times', () => {
  const now = new Date('2026-10-04T18:30:00Z') // Midnight on 5 October in India.
  assert.equal(canChangeAppointmentOnline({ appointmentDate: '2026-10-05', appointmentTime: '10:30' }, 12, now), false)
  assert.equal(canChangeAppointmentOnline({ appointmentDate: '2026-10-05', appointmentTime: '14:00' }, 12, now), true)
})

test('the cutoff crosses India midnight, month, and year boundaries', () => {
  const appointment = { appointmentDate: '2027-01-01', appointmentTime: '11:00' }
  assert.equal(canChangeAppointmentOnline(appointment, 12, new Date('2026-12-31T23:00:00+05:30')), true)
  assert.equal(canChangeAppointmentOnline(appointment, 12, new Date('2026-12-31T23:00:00.001+05:30')), false)
  assert.equal(canChangeAppointmentOnline(appointment, 12, new Date('2027-01-01T00:00:00+05:30')), false)
})

test('UTC and other-offset clocks refer to the same India appointment cutoff', () => {
  const appointment = { appointmentDate: '2026-10-05', appointmentTime: '18:00' }
  for (const now of ['2026-10-05T00:30:00Z', '2026-10-05T06:00:00+05:30', '2026-10-04T17:30:00-07:00']) {
    assert.equal(canChangeAppointmentOnline(appointment, 12, new Date(now)), true)
  }
  assert.equal(canChangeAppointmentOnline(appointment, 12, new Date('2026-10-05T00:30:00.001Z')), false)
})

test('the timing helper leaves status checks to callers', () => {
  const now = new Date('2026-10-04T12:00:00Z')
  for (const status of ['BOOKED', 'CANCELLED', 'COMPLETED']) {
    assert.equal(canChangeAppointmentOnline({ status, appointmentDate: '2026-10-05', appointmentTime: '10:30' }, 12, now), true)
  }
})

test('expired, missing, and invalid appointment values cannot enable online changes', () => {
  const now = new Date('2026-10-04T12:00:00Z')
  assert.equal(canChangeAppointmentOnline({ appointmentDate: '2026-10-03', appointmentTime: '18:00' }, 12, now), false)
  for (const appointment of [undefined, null, {}, { appointmentDate: '2026-10-05' }, { appointmentTime: '18:00' }]) {
    assert.equal(canChangeAppointmentOnline(appointment, 12, now), false)
  }
  for (const appointmentDate of ['', 'invalid', '2026-13-01', '2026-02-30', '2026-02-29', '2026-10-00', '2026-10-32', '2026-10-05T00:00:00', 20261005]) {
    assert.equal(canChangeAppointmentOnline({ appointmentDate, appointmentTime: '18:00' }, 12, now), false)
  }
  for (const appointmentTime of ['', 'invalid', '24:00', '18:60', '18:00:60', '6:00', '18:00Z', '18:00+05:30', 1800]) {
    assert.equal(canChangeAppointmentOnline({ appointmentDate: '2026-10-05', appointmentTime }, 12, now), false)
  }
  assert.equal(canChangeAppointmentOnline({ appointmentDate: '2026-10-05', appointmentTime: '18:00' }, 12, new Date('invalid')), false)
  assert.equal(canChangeAppointmentOnline({ appointmentDate: '2026-10-05', appointmentTime: '18:00' }, 12, null), false)
})

test('valid leap-day appointments retain their own cutoff', () => {
  const appointment = { appointmentDate: '2028-02-29', appointmentTime: '14:00' }
  assert.equal(canChangeAppointmentOnline(appointment, 12, new Date('2028-02-28T20:30:00Z')), true)
  assert.equal(canChangeAppointmentOnline(appointment, 12, new Date('2028-02-28T20:30:00.001Z')), false)
})

test('independent 24-hour and 6-hour configuration changes eligibility for the same appointment', () => {
  const appointment = { appointmentDate: '2026-10-05', appointmentTime: '18:00' }
  const now = new Date('2026-10-05T00:30:00Z') // Twelve hours before its India start.
  assert.equal(canChangeAppointmentOnline(appointment, 24, now), false)
  assert.equal(canChangeAppointmentOnline(appointment, 6, now), true)
  assert.equal(canChangeAppointmentOnline(appointment, 24, new Date('2026-10-04T12:30:00Z')), true)
  assert.equal(canChangeAppointmentOnline(appointment, 24, new Date('2026-10-04T12:30:00.001Z')), false)
  assert.equal(canChangeAppointmentOnline(appointment, 6, new Date('2026-10-05T06:30:00Z')), true)
  assert.equal(canChangeAppointmentOnline(appointment, 6, new Date('2026-10-05T06:30:00.001Z')), false)
})

test('a zero-hour cutoff permits online changes through the inclusive appointment start', () => {
  const appointment = { appointmentDate: '2026-10-05', appointmentTime: '18:00' }
  assert.equal(canChangeAppointmentOnline(appointment, 0, new Date('2026-10-05T12:29:59.999Z')), true)
  assert.equal(canChangeAppointmentOnline(appointment, 0, new Date('2026-10-05T12:30:00.000Z')), true)
  assert.equal(canChangeAppointmentOnline(appointment, 0, new Date('2026-10-05T12:30:00.001Z')), false)
})

test('missing and invalid cutoffs cannot enable online changes or fabricate a default', () => {
  const appointment = { appointmentDate: '2026-10-05', appointmentTime: '18:00' }
  const now = new Date('2026-10-04T00:00:00Z')
  for (const cutoff of [undefined, null, '', '12', true, false, -1, 0.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1]) {
    assert.equal(canChangeAppointmentOnline(appointment, cutoff, now), false)
  }
  assert.equal(canChangeAppointmentOnline(appointment), false)
  assert.equal(canChangeAppointmentOnline(appointment, now), false)
})
