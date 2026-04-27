import { apiFetch } from './client'

export function createRazorpayOrder(payload) {
  return apiFetch('/payments/razorpay/order', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function verifyRazorpayPayment(payload) {
  return apiFetch('/payments/razorpay/verify', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
