import test from 'node:test'
import assert from 'node:assert/strict'
import { normalizeAddress, validateAddress } from '../src/utils/addressValidation.js'

test('accepts common postal formats and optional empty values', () => {
  for (const address of [null, '', '   ', '23 MG Road, Pune 411001', '१२, पुणे', "Flat #2-B, O’Connell Road (Near St. Mary's)", 'PO Box 123, Chennai', 'House Rose, Village Rampur', '12 Main St.\nPune 411001', '東京市中央区1-2-3']) {
    assert.equal(validateAddress(address), undefined, address)
  }
})
test('rejects incomplete, placeholder, repeated, linked and unsupported input', () => {
  for (const address of ['232131', 'abc', 'a12345', '१२३४', '---', 'N/A', 'unknown', 'test', 'qwerty', 'aaaaaaaaaa', 'a a a a a', '<script>alert(1)</script>', 'user@example.com', 'https://example.com', 'www.example.com', '12 Main\u0000 Road', '12 Main 😀 Road']) {
    assert.ok(validateAddress(address), address)
  }
})
test('normalizes spaces and newlines without removing address punctuation', () => {
  assert.equal(normalizeAddress('  Flat\t 2-B,\r\n  MG\u00a0 Road  '), 'Flat 2-B,\n MG Road')
  assert.equal(normalizeAddress('\r\n\t '), null)
})
test('enforces the 255-character boundary after normalization', () => {
  const address = '12 Main Road, ' + 'x'.repeat(241)
  assert.equal(address.length, 255)
  assert.equal(validateAddress(address), undefined)
  assert.equal(validateAddress(address + 'x'), 'Address must be at most 255 characters')
})
