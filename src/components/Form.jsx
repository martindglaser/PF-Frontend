import { useState, useEffect, useRef } from 'react'
import { analyze } from '../utils/api'
import { getCached, putCached } from '../utils/cache'
import { t } from '../i18n'
import { sanitizeInput, sanitizeUrl } from '../utils/input'

const CATEGORIES = [
  { id: 'UI/Styles', label: t('form.categories.ui') },
  { id: 'Forms', label: t('form.categories.forms') },
  { id: 'Links', label: t('form.categories.links') },
  { id: 'Images/Assets', label: t('form.categories.images') },
  { id: 'Texts', label: t('form.categories.texts') },
  { id: 'Responsiveness', label: t('form.categories.responsiveness') }
]

export default function AnalysisForm({ onStart, onComplete }) {
  const [url, setUrl] = useState('')
  const [analysisName, setAnalysisName] = useState('')
  const [userName, setUserName] = useState('')
  const [tolerance, setTolerance] = useState('low')
  const [language, setLanguage] = useState('es')
  const [selectedCategories, setSelectedCategories] = useState([])
  const [urlError, setUrlError] = useState(false)
  const [urlErrorMessage, setUrlErrorMessage] = useState('')
  const [nameError, setNameError] = useState(false)
  const [userError, setUserError] = useState(false)
  const [submitError, setSubmitError] = useState(false)
  const urlRef = useRef(null)
  const nameRef = useRef(null)
  const userRef = useRef(null)

  const ANALYSIS_NAME_MAX = 120
  const USER_NAME_MAX = 60

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
    setUrlError(false)
    setNameError(false)
    setUserError(false)
    setSubmitError(false)

    const sanitizedUrl = sanitizeUrl(url, 2000)
    const sanitizedName = sanitizeInput(analysisName, ANALYSIS_NAME_MAX)
    const sanitizedUser = sanitizeInput(userName, USER_NAME_MAX)

    const payload = {
      url: sanitizedUrl,
      AnalysisName: sanitizedName,
      UserName: sanitizedUser,
      name: sanitizedName,
      user: sanitizedUser,
      tolerance,
      language,
      categories: selectedCategories
    }
    try { setUrl(payload.url) } catch (e) {  }
    try { setAnalysisName(payload.name) } catch (e) {  }
    try { setUserName(payload.user) } catch (e) {  }
    let hasError = false
    if (!payload.url) {
      setUrlError(true)
      setUrlErrorMessage(t('form.urlRequired') || 'El URL es obligatorio')
      hasError = true
    }
    else {
      try {
        const parsed = new URL(payload.url)
        if (!/^https?:$/i.test(parsed.protocol)) {
          throw new Error('invalid protocol')
        }
      } catch (err) {
        setUrlError(true)
        setUrlErrorMessage(t('form.urlInvalid') || 'El URL no es válido')
        hasError = true
      }
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
      setSubmitError(true)
      setTimeout(() => setSubmitError(false), 1400)
      try {
        if (!payload.url && urlRef.current) urlRef.current.focus()
        else if (!payload.name && nameRef.current) nameRef.current.focus()
        else if (!payload.user && userRef.current) userRef.current.focus()
      } catch (e) {  }
      return
    }

    onStart && onStart()

    setSubmitError(false)
    let cached
    try {
      cached = getCached(payload)

      const result = await analyze(payload)
      try { putCached(payload, result) } catch (e) {  }
      onComplete({ result, fromCache: false })
    } catch (err) {
      if (cached) {
        console.warn('analyze request failed, returning cached result as fallback', err)
        onComplete({ result: cached.response, fromCache: true })
      } else {
        onComplete({ error: err.message || String(err) })
      }
    }
  }

  function validateUrlField(value) {
    const v = sanitizeUrl(value)
    if (!v) {
      setUrlError(true)
      setUrlErrorMessage(t('form.urlRequired') || 'El URL es obligatorio')
      return false
    }
    try {
      const parsed = new URL(v)
      if (!/^https?:$/i.test(parsed.protocol)) throw new Error('invalid protocol')
      setUrlError(false)
      setUrlErrorMessage('')
      return true
    } catch (err) {
      setUrlError(true)
      setUrlErrorMessage(t('form.urlInvalid') || 'El URL no es válido')
      return false
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
          onChange={e => { setAnalysisName(e.target.value); if (nameError) setNameError(false); if (submitError) setSubmitError(false) }}
          onBlur={e => { setAnalysisName(sanitizeInput(e.target.value, ANALYSIS_NAME_MAX)) }}
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
          onChange={e => { setUserName(e.target.value); if (userError) setUserError(false); if (submitError) setSubmitError(false) }}
          onBlur={e => { setUserName(sanitizeInput(e.target.value, USER_NAME_MAX)) }}
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
          onChange={e => { setUrl(sanitizeUrl(e.target.value)); if (urlError) { setUrlError(false); setUrlErrorMessage('') } if (submitError) setSubmitError(false) }}
          onBlur={e => validateUrlField(e.target.value)}
          placeholder={t('form.urlPlaceholder')}
          className={urlError ? 'input-error' : ''}
        />
        {urlError && (
          <div role="alert" aria-live="assertive" style={{ color: 'var(--danger)', marginTop: 6, fontSize: 13, fontWeight: 700 }}>
            {urlErrorMessage || (t('form.urlRequired') || 'El URL es obligatorio')}
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
