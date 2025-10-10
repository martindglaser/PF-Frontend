import { useState } from 'react'
import { analyze } from '../api'
import { getCached, putCached } from '../cache'

export default function AnalysisForm({ onStart, onComplete }) {
  const [url, setUrl] = useState('')
  const [tolerance, setTolerance] = useState('high')
  const [language, setLanguage] = useState('en')

  async function handleSubmit(e) {
    e.preventDefault()
    const payload = { url: url.trim(), tolerance, language }
    if (!payload.url) return onComplete({ error: 'URL is required' })

    onStart && onStart()

    try {
      const cached = getCached(payload)
      if (cached) {
        return onComplete({ result: cached.response, fromCache: true })
      }

      const result = await analyze(payload)
      // store
      try { putCached(payload, result) } catch (e) { /* ignore */ }
      onComplete({ result, fromCache: false })
    } catch (err) {
      onComplete({ error: err.message || String(err) })
    }
  }

  return (
    <form className="analysis-form" onSubmit={handleSubmit}>
      <label>
        URL
        <input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://example.com" />
      </label>

      <label>
        Tolerance
        <select value={tolerance} onChange={e => setTolerance(e.target.value)}>
          <option value="low">low</option>
          <option value="medium">medium</option>
          <option value="high">high</option>
        </select>
      </label>

      <label>
        Language
        <select value={language} onChange={e => setLanguage(e.target.value)}>
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="fr">Français</option>
          <option value="de">Deutsch</option>
        </select>
      </label>

      <div className="form-actions">
        <button type="submit">Run analysis</button>
      </div>
    </form>
  )
}
