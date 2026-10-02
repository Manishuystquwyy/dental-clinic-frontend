import test from 'node:test'
import assert from 'node:assert/strict'
import { earliestBirthDate, normalizeSignup, validateSignup } from '../src/utils/signupValidation.js'
const valid = { firstName: 'Ava', lastName: 'Sharma', email: 'ava@example.com', phone: '9876543210', gender: 'Female', dateOfBirth: '', address: '', password: '12345678', confirmPassword: '12345678' }
const check = (changes = {}) => validateSignup({ ...valid, ...changes }, '2026-10-02')
test('valid optional fields and international names', () => {
  assert.deepEqual(check(), {})
  assert.deepEqual(check({ firstName: 'राज', lastName: "O'Neil-Smith", phone: '9876543210' }), {})
})
test('normalization preserves password and clears optional blanks', () => {
  const result = normalizeSignup({ ...valid, email: ' Ava@EXAMPLE.COM ', firstName: ' Ava ', address: ' ', gender: ' ', password: '  secret  ' })
  assert.equal(result.email, 'ava@example.com'); assert.equal(result.firstName, 'Ava')
  assert.equal(result.address, null); assert.equal(result.gender, null); assert.equal(result.password, '  secret  ')
  assert.equal('confirmPassword' in result, false)
})
test('rejects invalid phones and accepts boundaries', () => {
  for (const phone of ['1231231223', '0123456789', '2234567890', '3234567890', '4234567890', '5234567890', 'abcdefghij', '123456789', '12345678901', '+9876543210', '+919876543210', '1234567890123456', '98765 43210', '++919876543210']) assert.ok(check({ phone }).phone)
  for (const phone of ['6123456789', '7123456789', '8123456789', '9876543210']) assert.equal(check({ phone }).phone, undefined)
})
test('rejects future and invalid dates, allows today and leap dates', () => {
  for (const dateOfBirth of ['2026-10-03', '2025-02-29', 'garbage', '0000-01-01']) assert.ok(check({ dateOfBirth }).dateOfBirth)
  for (const dateOfBirth of ['2026-10-02', '2024-02-29', '1990-01-01']) assert.equal(check({ dateOfBirth }).dateOfBirth, undefined)
})
test('required fields, sizes, email format and allowed genders', () => {
  for (const field of ['firstName', 'lastName', 'email', 'phone', 'password']) assert.ok(check({ [field]: ' ' })[field])
  for (const [field, length] of [['firstName', 100], ['lastName', 100], ['address', 255]]) {
    assert.equal(check({ [field]: field === 'address' ? '12 Main Road, ' + 'x'.repeat(length - 14) : 'x'.repeat(length) })[field], undefined)
    assert.ok(check({ [field]: 'x'.repeat(length + 1) })[field])
  }
  assert.ok(check({ email: 'missing-at' }).email)
  assert.ok(check({ gender: 'arbitrary' }).gender)
  assert.deepEqual(check({ gender: 'Prefer not to say' }), {})
})
test('password limits count UTF-8 bytes and confirmation must match', () => {
  assert.ok(check({ password: '1234567' }).password)
  for (const password of ['x'.repeat(72), 'é'.repeat(36)]) assert.deepEqual(check({ password, confirmPassword: password }), {})
  for (const password of ['x'.repeat(73), 'é'.repeat(37)]) assert.ok(check({ password }).password)
  assert.ok(check({ confirmPassword: '' }).confirmPassword)
  assert.ok(check({ confirmPassword: 'different' }).confirmPassword)
})

test('email requires a domain suffix and accepts subdomains and plus addressing', () => {
  for (const email of ['mkhh@gmail', 'user@localhost', 'user@gmail.', 'user@.com', 'user@gmail..com', 'user@@gmail.com']) {
    assert.equal(check({ email }).email, 'Invalid email format', email)
  }
  for (const email of ['mkhh@gmail.com', 'user+clinic@example.co.in', ' User@Mail.Example.COM ']) {
    assert.equal(check({ email }).email, undefined, email)
  }
})

test('both name fields reject digits and symbols while accepting international names', () => {
  for (const field of ['firstName', 'lastName']) {
    for (const name of ['3123', 'Ava123', '१२३', 'Ava٣', '@@@', "---", 'Ava\nSharma']) {
      assert.ok(check({ [field]: name })[field], `${field}: ${name}`)
    }
    for (const name of ['राज', "O'Neil-Smith", 'D’Arcy', 'Mary Jane', 'Jose\u0301', '李', ' Ava ']) {
      assert.equal(check({ [field]: name })[field], undefined, `${field}: ${name}`)
    }
  }
})

test('gender is required and birth dates are limited to the last 100 years', () => {
  for (const gender of ['', '   ']) assert.equal(check({ gender }).gender, 'Gender is required')
  for (const dateOfBirth of ['0001-10-12', '1926-10-01']) assert.equal(check({ dateOfBirth }).dateOfBirth, 'Age cannot exceed 100 years')
  for (const dateOfBirth of ['', '1926-10-02', '1926-10-03', '2026-10-02']) assert.equal(check({ dateOfBirth }).dateOfBirth, undefined)
  assert.equal(earliestBirthDate('2000-02-29'), '1900-02-28')
  assert.equal(validateSignup({ ...valid, dateOfBirth: '1900-02-28' }, '2000-02-29').dateOfBirth, undefined)
  assert.ok(validateSignup({ ...valid, dateOfBirth: '1900-02-27' }, '2000-02-29').dateOfBirth)
})

test('optional address must include letters, not just numbers or punctuation', () => {
  for (const address of ['232131', ' 232131 ', '१२३४', '23/14, 411001', '---']) {
    assert.equal(check({ address }).address, 'Address must include a street, area, or place name', address)
  }
  for (const address of ['', '   ', '23 MG Road, Pune 411001', '१२, पुणे', 'Apt #2-B, Main St.']) {
    assert.equal(check({ address }).address, undefined, address)
  }
})
