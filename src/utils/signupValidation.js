import { normalizeAddress, validateAddress } from './addressValidation.js'

export const genderOptions = ['Male', 'Female', 'Other', 'Prefer not to say']

export function localToday() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

export function earliestBirthDate(today = localToday()) {
  const [year, month, day] = today.split('-').map(Number)
  const earliestYear = year - 100
  const lastDay = new Date(Date.UTC(earliestYear, month, 0)).getUTCDate()
  return `${earliestYear}-${String(month).padStart(2, '0')}-${String(Math.min(day, lastDay)).padStart(2, '0')}`
}

export function normalizeSignup(values) {
  return {
    firstName: values.firstName.trim(),
    lastName: values.lastName.trim(),
    email: values.email.trim().toLowerCase(),
    phone: values.phone.trim(),
    gender: values.gender.trim() || null,
    dateOfBirth: values.dateOfBirth || null,
    address: normalizeAddress(values.address),
    password: values.password,
  }
}

export function validateSignup(values, today = localToday()) {
  const data = normalizeSignup(values)
  const errors = {}
  for (const [field, label] of [['firstName', 'First name'], ['lastName', 'Last name']]) {
    if (!data[field]) errors[field] = `${label} is required`
    else if (data[field].length > 100) errors[field] = `${label} must be at most 100 characters`
    else if (!/^\p{L}[\p{L}\p{M} '’-]*$/u.test(data[field])) errors[field] = `${label} must contain only letters, spaces, apostrophes, or hyphens`
  }
  if (!data.email) errors.email = 'Email is required'
  else if (data.email.length > 254) errors.email = 'Email must be at most 254 characters'
  else if (!/^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/.test(data.email)) errors.email = 'Invalid email format'
  if (!data.phone) errors.phone = 'Phone number is required'
  else if (!/^[6-9][0-9]{9}$/.test(data.phone)) errors.phone = 'Enter a 10-digit Indian mobile number starting with 6, 7, 8, or 9'
  if (!data.gender) errors.gender = 'Gender is required'
  else if (!genderOptions.includes(data.gender)) errors.gender = 'Choose a valid gender option'
  if (data.dateOfBirth) {
    const parsed = new Date(`${data.dateOfBirth}T00:00:00Z`)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data.dateOfBirth) || Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== data.dateOfBirth || data.dateOfBirth.startsWith('0000')) {
      errors.dateOfBirth = 'Enter a valid date of birth'
    } else if (data.dateOfBirth > today) errors.dateOfBirth = 'Date of birth cannot be in the future'
    else if (data.dateOfBirth < earliestBirthDate(today)) errors.dateOfBirth = 'Age cannot exceed 100 years'
  }
  const addressError = validateAddress(data.address)
  if (addressError) errors.address = addressError
  if (!data.password.trim()) errors.password = 'Password is required'
  else if (data.password.length < 8) errors.password = 'Password must be at least 8 characters'
  else if (new TextEncoder().encode(data.password).length > 72) errors.password = 'Password must be at most 72 UTF-8 bytes'
  if (!values.confirmPassword) errors.confirmPassword = 'Confirm your password'
  else if (values.password !== values.confirmPassword) errors.confirmPassword = 'Passwords do not match'
  return errors
}
