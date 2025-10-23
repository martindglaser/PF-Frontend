import { useState } from 'react'
import { analyze } from '../utils/api'
import { getCached, putCached } from '../utils/cache'
import { t } from '../i18n'

const CATEGORIES = [
  { id: 'ui-styles', label: t('form.categories.ui') },
  { id: 'forms', label: t('form.categories.forms') },
  { id: 'buttons-actions', label: t('form.categories.buttons') },
  { id: 'images-resources', label: t('form.categories.images') },
  { id: 'texts', label: t('form.categories.texts') },
  { id: 'accessibility', label: t('form.categories.accessibility') }
]

export default function AnalysisForm({ onStart, onComplete }) {
  const [url, setUrl] = useState('')
  const [tolerance, setTolerance] = useState('high')
  const [language, setLanguage] = useState('en')
  const [selectedCategories, setSelectedCategories] = useState([])
  const [urlError, setUrlError] = useState(false)

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
    if (!payload.url) {
      setUrlError(true)
      onComplete && onComplete({ error: 'URL is required' })
      return
    }

    onStart && onStart()

    let cached
    try {
      // read cache but DO NOT render it immediately — we always await network
      cached = getCached(payload)

      // Perform the network analysis and await it so the LoadingScreen remains visible
      const result = await analyze(payload)
      // store fresh result in cache (best-effort)
      try { putCached(payload, result) } catch (e) { /* ignore */ }
      // update UI with fresh server result
      onComplete({ result, fromCache: false })
    } catch (err) {
      // If the network failed but we have a cached result, use it as a fallback.
      if (cached) {
        console.warn('analyze request failed, returning cached result as fallback', err)
        onComplete({ result: cached.response, fromCache: true })
      } else {
        onComplete({ error: err.message || String(err) })
      }
    }
  }

  return (
    <form className="analysis-form" onSubmit={handleSubmit}>
      <label>
        {t('form.urlLabel')}
        <input
          value={url}
          onChange={e => { setUrl(e.target.value); if (urlError) setUrlError(false) }}
          placeholder={t('form.urlPlaceholder')}
          className={urlError ? 'input-error' : ''}
        />
      </label>

      <label>
        {t('form.toleranceLabel')}
        <select value={tolerance} onChange={e => setTolerance(e.target.value)}>
          <option value="low">{t('form.tolerance.low')}</option>
          <option value="medium">{t('form.tolerance.medium')}</option>
          <option value="high">{t('form.tolerance.high')}</option>
        </select>
      </label>

      <label>
        {t('form.languageLabel')}
        <select value={language} onChange={e => setLanguage(e.target.value)}>
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="fr">Français</option>
          <option value="de">Deutsch</option>
        </select>
      </label>

      <div className="categories-section">
        <label className="categories-label">
          {t('form.categoriesLabel')}
          <span className="categories-hint">
            {selectedCategories.length > 0 
              ? t('form.categoriesSelected')(selectedCategories.length)
              : t('form.selectCategoriesHint')}
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
