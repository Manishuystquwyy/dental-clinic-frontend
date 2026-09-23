import { test } from 'node:test'
import assert from 'node:assert/strict'
import { canCompleteAppointment } from '../src/utils/appointmentStatus.js'

const appointment = { status: 'BOOKED', appointmentDate: '2026-09-24', appointmentTime: '14:00:00' }

test('completion is available only once the booked consultation starts in India time', () => {
  assert.equal(canCompleteAppointment(appointment, new Date('2026-09-24T08:29:59Z')), false)
  assert.equal(canCompleteAppointment(appointment, new Date('2026-09-24T08:30:00Z')), true)
  assert.equal(canCompleteAppointment(appointment, new Date('2026-09-25T08:30:00Z')), true)
})

test('cancelled and completed appointments do not offer completion', () => {
  for (const status of ['CANCELLED', 'COMPLETED']) {
    assert.equal(canCompleteAppointment({ ...appointment, status }, new Date('2026-09-25T08:30:00Z')), false)
  }
})

test('missing appointment details cannot enable completion', () => {
  assert.equal(canCompleteAppointment({ status: 'BOOKED' }), false)
})
