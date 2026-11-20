import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  cancellationMessage, cancellationSuccessMessage, cancelledPaymentMessage,
  formatRefundAmount, formatRefundTimestamp, getRefundPresentation, hasActiveRefund,
} from '../src/utils/refundPresentation.js'

test('only requested and initiated refunds keep automatic tracking active', () => {
  for (const status of ['PENDING', 'REFUND_INITIATED']) {
    assert.equal(hasActiveRefund({ refunds: [{ status }] }), true)
  }
  for (const status of ['REFUNDED', 'FAILED', 'UNKNOWN']) {
    assert.equal(hasActiveRefund({ refunds: [{ status }] }), false)
  }
  assert.equal(hasActiveRefund({}), false)
  assert.equal(hasActiveRefund({ refunds: [{ status: 'REFUNDED' }, { status: 'PENDING' }] }), true)
})

test('payment eligibility controls the refund promise in the cancellation confirmation', () => {
  const eligible = cancellationMessage({ refundEligible: true, paymentStatus: 'SUCCESS', paidAmount: '499.00', refundableAmount: '299.00' })
  assert.match(eligible, /₹299\.00/)
  assert.doesNotMatch(eligible, /₹499\.00/)
  assert.match(eligible, /requested automatically/)
  const capturedIneligible = cancellationMessage({ refundEligible: false, paymentStatus: 'SUCCESS', paidAmount: 499 })
  assert.match(capturedIneligible, /contact the clinic/)
  assert.doesNotMatch(capturedIneligible, /requested automatically/)
  const pending = cancellationMessage({ paymentStatus: 'PENDING' })
  assert.match(pending, /If a pending payment completes/)
  assert.match(pending, /contact the clinic/)
  assert.doesNotMatch(pending, /requested automatically/)
})

test('refund stages distinguish gateway acceptance from confirmation and bank receipt', () => {
  assert.equal(getRefundPresentation('PENDING').step, 0)
  assert.equal(getRefundPresentation('REFUND_INITIATED').step, 1)
  const refunded = getRefundPresentation('REFUNDED')
  assert.equal(refunded.step, 2)
  assert.match(refunded.message, /Razorpay has confirmed/)
  assert.match(refunded.message, /bank or payment provider controls/)
  assert.doesNotMatch(refunded.message, /has been credited|credited to/)
  assert.match(getRefundPresentation('FAILED').message, /remains cancelled/)
  assert.match(getRefundPresentation('UNKNOWN').message, /confirm the latest refund status/)
})

test('cancellation success uses the saved refund record and handles unpaid cancellation', () => {
  assert.match(cancellationSuccessMessage({ refunds: [{ status: 'PENDING' }] }), /Track your refund/)
  assert.match(cancellationSuccessMessage({ paymentStatus: 'SUCCESS' }), /refund eligibility/)
  assert.doesNotMatch(cancellationSuccessMessage({ paymentStatus: 'FAILED' }), /refund/)
  assert.match(cancelledPaymentMessage({ paymentStatus: 'PENDING' }), /If it completes/)
  assert.match(cancelledPaymentMessage({ paymentStatus: 'PENDING' }), /contact the clinic/)
})

test('missing, invalid or negative amounts are never displayed as an invented refund', () => {
  for (const value of [null, undefined, '', 'not-a-number', -1, Infinity]) {
    assert.equal(formatRefundAmount(value), null)
  }
  assert.equal(formatRefundAmount('1250.50'), '₹1,250.50')
})

test('refund timestamps are displayed in clinic time and require a source timezone', () => {
  const timestamp = formatRefundTimestamp('2026-10-04T15:00:00Z')
  assert.match(timestamp, /04 Oct 2026/)
  assert.match(timestamp, /08:30|20:30/)
  assert.match(timestamp, /IST|GMT\+5:30/)
  for (const value of [null, 'invalid', '2026-10-04T15:00:00']) {
    assert.equal(formatRefundTimestamp(value), null)
  }
})
