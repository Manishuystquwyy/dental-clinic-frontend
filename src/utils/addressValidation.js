// Format checks only: this does not verify that a postal address exists.
export function normalizeAddress(value) {
  return value?.replace(/\r\n?/g, '\n').replace(/[\p{Zs}\t]+/gu, ' ').trim() || null
}

export function validateAddress(value) {
  const address = normalizeAddress(value)
  if (!address) return undefined
  if (address.length > 255) return 'Address must be at most 255 characters'
  if (!/\p{L}/u.test(address)) return 'Address must include a street, area, or place name'
  if (address.length < 5 || (address.match(/\p{L}/gu) || []).length < 2) return 'Enter a more complete address, including the street or area and city'
  if (!/^[\p{L}\p{M}\p{N} \n.,'’#/()&:;°-]+$/u.test(address)) return 'Address contains unsupported characters'
  if (/(?:https?:\/\/|www\.)/i.test(address)) return 'Enter a postal address, not a website link'
  const compact = address.replace(/[\p{Zs}\n]/gu, '').toLowerCase()
  if (/^(?:n\/?a|none|null|undefined|test|asdf|qwerty|unknown)$/.test(compact) || /^(.)\1+$/u.test(compact)) return 'Enter your address or leave this optional field blank'
  return undefined
}
