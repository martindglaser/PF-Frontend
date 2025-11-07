/* Small API client to call the backend analysis endpoint */
const BASE = 'http://localhost:5288/api/analysis/'

async function handleResponse(res) {
  if (!res.ok) {
    const txt = await res.text()
    const err = txt || res.statusText || 'Unknown error from server'
    throw new Error(err)
  }
  return res.json()
}

export async function analyze(payload) {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return handleResponse(res)
}

/**
 * List analyses (GET). Accepts an optional params object which will be
 * serialized into query string (e.g. { page: 1, pageSize: 20 }).
 */
export async function listAnalyses(params = {}) {
  const qs = Object.keys(params).length
    ? '?' + new URLSearchParams(params).toString()
    : ''
  const res = await fetch(BASE + qs, { method: 'GET' })
  return handleResponse(res)
}

/**
 * Get a single analysis by id (GET BASE/:id)
 */
export async function getAnalysis(id) {
  if (!id) throw new Error('id is required')
  const url = BASE.endsWith('/') ? `${BASE}${id}` : `${BASE}/${id}`
  const res = await fetch(url, { method: 'GET' })
  return handleResponse(res)
}

/**
 * Delete a single analysis by id (DELETE BASE/:id)
 */
export async function deleteAnalysis(id) {
  if (!id) throw new Error('id is required')
  const url = BASE.endsWith('/') ? `${BASE}${id}` : `${BASE}/${id}`
  const res = await fetch(url, { method: 'DELETE' })
  return handleResponse(res)
}

/**
 * Delete all analyses (DELETE BASE)
 */
export async function deleteAllAnalyses() {
  const res = await fetch(BASE, { method: 'DELETE' })
  return handleResponse(res)
}

export default { analyze, listAnalyses, getAnalysis, deleteAnalysis, deleteAllAnalyses }
