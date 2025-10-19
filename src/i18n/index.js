import es from './es.js'
import en from './en.js'

const locales = { es, en }
let active = 'es'

export function setLocale(l) {
  if (locales[l]) active = l
}

export function t(path) {
  const parts = path.split('.')
  let cur = locales[active]
  for (const p of parts) {
    if (!cur) return path
    cur = cur[p]
  }
  return cur || path
}

export default { t, setLocale }
