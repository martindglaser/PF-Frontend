function sanitizeInput(input, maxLen = 100) {
  if (input == null) return ''
  let s = String(input)
  s = s.replace(/<[^>]*>/g, '')
  s = s.replace(/[\r\n\t]+/g, ' ')
  s = s.replace(/\s+/g, ' ').trim()
  s = s.replace(/[<>]/g, '')
  if (maxLen && s.length > maxLen) s = s.slice(0, maxLen)
  return s
}

function sanitizeUrl(input, maxLen = 2000) {
  if (input == null) return ''
  let s = String(input)
  s = s.replace(/<[^>]*>/g, '')
  s = s.replace(/[\r\n\t]+/g, '')
  s = s.replace(/\s+/g, '')
  s = s.replace(/[<>]/g, '')
  if (maxLen && s.length > maxLen) s = s.slice(0, maxLen)
  return s
}

export { sanitizeInput, sanitizeUrl }