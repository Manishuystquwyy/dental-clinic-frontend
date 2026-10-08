const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency', currency: 'INR', minimumFractionDigits: 2,
})

export function formatRefundAmount(amount) {
  if (amount === null || amount === undefined || amount === '') return null
  const value = Number(amount)
  return Number.isFinite(value) && value >= 0 ? currencyFormatter.format(value) : null
}

export function formatRefundTimestamp(timestamp) {
  if (typeof timestamp !== 'string' || !/(Z|[+-]\d{2}:\d{2})$/.test(timestamp)) return null
  const date = new Date(timestamp)
  if (!Number.isFinite(date.getTime())) return null
  return date.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', timeZoneName: 'short',
  })
}

export function getRefundPresentation(status) {
  switch (status) {
    case 'PENDING':
      return {
        label: 'Refund requested', tone: 'pending', step: 0,
        message: 'Your refund request has been saved and is queued for processing.',
      }
    case 'REFUND_INITIATED':
      return {
        label: 'Refund initiated', tone: 'processing', step: 1,
        message: 'Razorpay has accepted your refund. We are waiting for confirmation that it has been processed.',
      }
    case 'REFUNDED':
      return {
        label: 'Refund processed', tone: 'completed', step: 2,
        message: 'Razorpay has confirmed that your refund has been processed. Your bank or payment provider controls when it appears in your account.',
      }
    case 'FAILED':
      return {
        label: 'Refund needs attention', tone: 'failed', step: -1,
        message: 'Your appointment remains cancelled. Please contact the clinic for help with this refund and share the reference below.',
      }
    default:
      return {
        label: 'Refund update unavailable', tone: 'pending', step: -1,
        message: 'Please contact the clinic to confirm the latest refund status.',
      }
  }
}

export function hasActiveRefund(appointment) {
  return (appointment.refunds || []).some((refund) =>
    refund.status === 'PENDING' || refund.status === 'REFUND_INITIATED'
  )
}

export function cancellationMessage(appointment) {
  const amount = formatRefundAmount(appointment.refundableAmount)
  if (appointment.refundEligible) {
    return `Your slot will be released as soon as cancellation is confirmed. A refund${amount ? ` of ${amount}` : ''} will be requested automatically. You can follow its progress in Appointment History.`
  }
  if (appointment.paymentStatus === 'SUCCESS') {
    return 'Your slot will be released as soon as cancellation is confirmed. Please contact the clinic to confirm refund options for this payment.'
  }
  if (appointment.paymentStatus === 'PENDING') {
    return 'Your slot will be released as soon as cancellation is confirmed. If a pending payment completes after cancellation, contact the clinic for help with a refund.'
  }
  return 'Your slot will be released as soon as cancellation is confirmed. You can book a new appointment whenever you are ready.'
}

export function cancellationSuccessMessage(appointment) {
  if ((appointment.refunds || []).length > 0) {
    return 'Your slot has been released. Track your refund in Appointment History.'
  }
  if (appointment.paymentStatus === 'SUCCESS') {
    return 'Your slot has been released. Contact the clinic for help with refund eligibility.'
  }
  return 'Your slot has been released. You can book a new appointment whenever you are ready.'
}

export function cancelledPaymentMessage(appointment) {
  if (appointment.paymentStatus === 'PENDING') {
    return 'Your payment is pending. If it completes after cancellation, contact the clinic for help with a refund.'
  }
  if (appointment.paymentStatus === 'REFUNDED') {
    return 'Your payment has been refunded. Contact the clinic if you need help with the payment reference.'
  }
  if (appointment.paymentStatus === 'SUCCESS') {
    return 'Please contact the clinic to confirm refund eligibility for this payment.'
  }
  return 'No completed online payment is recorded for this appointment.'
}
