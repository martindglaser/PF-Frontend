const STORAGE_KEY = 'pf_ai_cache_v1'
const MAX_ENTRIES = 100

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw)
  } catch (e) {
    console.error('Failed to load cache', e)
    return []
  }
}

function save(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  } catch (e) {
    console.error('Failed to save cache', e)
  }
}

export function getAllCachedEntries() {
  return load()
}

export function clearCache() {
  localStorage.removeItem(STORAGE_KEY)
}

export function makeKey(payload) {
  // key based on url + tolerance + language
  return `${payload.url}|${payload.tolerance||''}|${payload.language||''}`
}

export function getCached(payload) {
  const key = makeKey(payload)
  const list = load()
  const entry = list.find(e => e.key === key)
  if (!entry) return null
  return entry
}

export function putCached(payload, response) {
  const key = makeKey(payload)
  const list = load()
  const now = Date.now()
  // remove existing
  const filtered = list.filter(e => e.key !== key)
  filtered.unshift({ key, payload, response, ts: now })
  // trim
  if (filtered.length > MAX_ENTRIES) filtered.splice(MAX_ENTRIES)
  save(filtered)
}
