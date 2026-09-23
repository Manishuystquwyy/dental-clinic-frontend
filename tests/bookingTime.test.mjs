import { test } from 'node:test'
import assert from 'node:assert/strict'
import { clinicToday, isFutureSlot } from '../src/utils/bookingTime.js'

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
