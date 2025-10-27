import { useState, useEffect, useRef } from 'react'
import { analyze } from '../utils/api'
import { getCached, putCached } from '../utils/cache'
import { t } from '../i18n'

// sanitize user-provided short text fields: strip tags, control chars, collapse whitespace, truncate
function sanitizeInput(input, maxLen = 100) {
  if (input == null) return ''
  let s = String(input)
  // remove HTML tags
  s = s.replace(/<[^>]*>/g, '')
  // remove common control characters (newlines, tabs) and replace with single space
  s = s.replace(/[\r\n\t]+/g, ' ')
  // collapse multiple whitespace into single space and trim
  s = s.replace(/\s+/g, ' ').trim()
  // remove angle brackets left over and other problematic chars if needed
  s = s.replace(/[<>]/g, '')
  if (maxLen && s.length > maxLen) s = s.slice(0, maxLen)
  return s
}

// sanitize URL-like input: remove tags, control chars, and all whitespace (URLs shouldn't contain spaces)
function sanitizeUrl(input, maxLen = 2000) {
  if (input == null) return ''
  let s = String(input)
  // remove HTML tags
  s = s.replace(/<[^>]*>/g, '')
  // remove control characters (newlines, tabs)
  s = s.replace(/[\r\n\t]+/g, '')
  // remove all whitespace
  s = s.replace(/\s+/g, '')
  // remove angle brackets if any
  s = s.replace(/[<>]/g, '')
  if (maxLen && s.length > maxLen) s = s.slice(0, maxLen)
  return s
}

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
  const [analysisName, setAnalysisName] = useState('')
  const [userName, setUserName] = useState('')
  const [tolerance, setTolerance] = useState('low')
  const [language, setLanguage] = useState('es')
  const [selectedCategories, setSelectedCategories] = useState([])
  const [urlError, setUrlError] = useState(false)
  const [nameError, setNameError] = useState(false)
  const [userError, setUserError] = useState(false)
  const [submitError, setSubmitError] = useState(false)
  const urlRef = useRef(null)
  const nameRef = useRef(null)
  const userRef = useRef(null)
  // field character limits
  const ANALYSIS_NAME_MAX = 120
  const USER_NAME_MAX = 60

  // On mount, select all categories by default
  useEffect(() => {
    setSelectedCategories(CATEGORIES.map(c => c.id))
  }, [])

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
      url: sanitizeUrl(url, 2000),
      name: sanitizeInput(analysisName, ANALYSIS_NAME_MAX),
      user: sanitizeInput(userName, USER_NAME_MAX),
      tolerance,
      language,
      categories: selectedCategories
    }
    // validate required fields: url, analysis name and user
    let hasError = false
    if (!payload.url) {
      setUrlError(true)
      // do not call onComplete here; show inline error next to URL instead to match other fields
      hasError = true
    }
    if (!payload.name) {
      setNameError(true)
      hasError = true
    }
    if (!payload.user) {
      setUserError(true)
      hasError = true
    }
    if (hasError) {
      // highlight submit button and focus first invalid field
      setSubmitError(true)
      setTimeout(() => setSubmitError(false), 1400)
      // focus order: url, name, user
      try {
        if (!payload.url && urlRef.current) urlRef.current.focus()
        else if (!payload.name && nameRef.current) nameRef.current.focus()
        else if (!payload.user && userRef.current) userRef.current.focus()
      } catch (e) { /* ignore */ }
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
        {t('form.analysisNameLabel')}
        <input
          ref={nameRef}
          className={nameError ? 'input-error' : ''}
          value={analysisName}
          onChange={e => { setAnalysisName(sanitizeInput(e.target.value, ANALYSIS_NAME_MAX)); if (nameError) setNameError(false); if (submitError) setSubmitError(false) }}
          placeholder={t('form.analysisNamePlaceholder') || 'Nombre del análisis'}
          maxLength={ANALYSIS_NAME_MAX}
        />
        {nameError && (
          <div role="alert" aria-live="assertive" style={{ color: 'var(--danger)', marginTop: 6, fontSize: 13, fontWeight: 700 }}>
            {t('form.analysisNameRequired') || 'El nombre del análisis es obligatorio'}
          </div>
        )}
      </label>

      <label>
        {t('form.userNameLabel')}
        <input
          ref={userRef}
          className={userError ? 'input-error' : ''}
          value={userName}
          onChange={e => { setUserName(sanitizeInput(e.target.value, USER_NAME_MAX)); if (userError) setUserError(false); if (submitError) setSubmitError(false) }}
          placeholder={t('form.userNamePlaceholder') || 'Nombre del usuario'}
          maxLength={USER_NAME_MAX}
        />
        {userError && (
          <div role="alert" aria-live="assertive" style={{ color: 'var(--danger)', marginTop: 6, fontSize: 13, fontWeight: 700 }}>
            {t('form.userNameRequired') || 'El nombre del usuario es obligatorio'}
          </div>
        )}
      </label>
      <label>
        {t('form.urlLabel')}
        <input
          ref={urlRef}
          value={url}
          onChange={e => { setUrl(sanitizeUrl(e.target.value)); if (urlError) setUrlError(false); if (submitError) setSubmitError(false) }}
          placeholder={t('form.urlPlaceholder')}
          className={urlError ? 'input-error' : ''}
        />
        {urlError && (
          <div role="alert" aria-live="assertive" style={{ color: 'var(--danger)', marginTop: 6, fontSize: 13, fontWeight: 700 }}>
            {t('form.urlRequired') || 'El URL es obligatorio'}
          </div>
        )}
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
        <button
          type="submit"
          disabled={selectedCategories.length === 0}
          className={submitError ? 'btn-error' : ''}
          style={submitError ? { borderColor: 'var(--danger)', boxShadow: '0 0 0 6px rgba(220, 38, 38, 0.12)' } : {}}
        >
          {t('form.runButton')}
        </button>
        {selectedCategories.length === 0 && (
          <div
            role="alert"
            aria-live="assertive"
            style={{ color: 'var(--danger)', marginTop: 8, fontSize: 13, fontWeight: 700 }}
          >
            {'Seleccione al menos una categoría'}
          </div>
        )}
      </div>
    </form>
  )
}
