import { test } from 'node:test'
import assert from 'node:assert/strict'
import { isValidAppointmentPolicy } from '../src/utils/appointmentPolicy.js'

test('backend policy supports independent nonnegative integer cutoffs, including zero', () => {
  for (const policy of [
    { cancellationCutoffHours: 12, rescheduleCutoffHours: 12 },
    { cancellationCutoffHours: 24, rescheduleCutoffHours: 6 },
    { cancellationCutoffHours: 0, rescheduleCutoffHours: 0 },
    { cancellationCutoffHours: 0, rescheduleCutoffHours: 24 },
  ]) assert.equal(isValidAppointmentPolicy(policy), true)
})

test('missing policies or either missing cutoff fail closed', () => {
  for (const policy of [undefined, null, '', '12', [], 12, {}, { cancellationCutoffHours: 12 }, { rescheduleCutoffHours: 12 }]) {
    assert.equal(isValidAppointmentPolicy(policy), false)
  }
})

test('both policy cutoffs must be safe nonnegative integers without coercion', () => {
  for (const cutoff of [undefined, null, '', '12', true, false, -1, 0.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1]) {
    assert.equal(isValidAppointmentPolicy({ cancellationCutoffHours: cutoff, rescheduleCutoffHours: 12 }), false)
    assert.equal(isValidAppointmentPolicy({ cancellationCutoffHours: 12, rescheduleCutoffHours: cutoff }), false)
  }
})
