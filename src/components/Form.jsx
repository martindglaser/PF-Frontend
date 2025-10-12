import { useState } from 'react'
import { analyze } from '../api'
import { getCached, putCached } from '../cache'

const CATEGORIES = [
  { id: 'ui-styles', label: 'UI/estilos' },
  { id: 'forms', label: 'Formularios' },
  { id: 'buttons-actions', label: 'Botones/acciones' },
  { id: 'images-resources', label: 'Imágenes/recursos' },
  { id: 'texts', label: 'Textos' },
  { id: 'accessibility', label: 'Accesibilidad' }
]

export default function AnalysisForm({ onStart, onComplete }) {
  const [url, setUrl] = useState('')
  const [tolerance, setTolerance] = useState('high')
  const [language, setLanguage] = useState('en')
  const [selectedCategories, setSelectedCategories] = useState([])

  function handleCategoryToggle(categoryId) {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const payload = { 
      url: url.trim(), 
      tolerance, 
      language,
      categories: selectedCategories
    }
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

      <div className="categories-section">
        <label className="categories-label">
          Categorías
          <span className="categories-hint">
            {selectedCategories.length > 0 
              ? `${selectedCategories.length} seleccionada${selectedCategories.length > 1 ? 's' : ''}`
              : 'Selecciona las categorías a analizar'}
          </span>
        </label>
        <div className="categories-grid">
          {CATEGORIES.map(category => (
            <label key={category.id} className="category-checkbox">
              <input
                type="checkbox"
                checked={selectedCategories.includes(category.id)}
                onChange={() => handleCategoryToggle(category.id)}
              />
              <span className="checkbox-label">{category.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="form-actions">
        <button type="submit">Run analysis</button>
      </div>
    </form>
  )
}
