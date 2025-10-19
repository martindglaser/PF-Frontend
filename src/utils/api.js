/* Small API client to call the backend analysis endpoint */
const BASE = 'http://localhost:5288/api/analysis/'

export async function analyze(payload) {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const txt = await res.text()
    const err = txt || res.statusText || 'Unknown error from server'
    throw new Error(err)
  }

  return res.json()
}

export default { analyze }
