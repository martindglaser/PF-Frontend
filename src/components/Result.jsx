import React, { useState } from 'react'
import { t } from '../i18n'
import ImageViewer from './ImageViewer'
import { formatLocal } from '../utils/formatDate.js'
import internetImage from '../assets/internet.svg'
import clockImage from '../assets/clock.svg'
import robotImage from '../assets/robot.svg'
import alertImage from '../assets/alert.svg'
import tickImage from '../assets/tick.svg'
import fixImage from '../assets/fix.svg'

function Screenshot({ id, mobile, onView }) {
  const base = 'http://localhost:5288/assets/screenshots'
  const url = mobile ? `${base}/${id}_mobile.png` : `${base}/${id}.png`
  const title = mobile ? t('result.screenshot.mobile') : t('result.screenshot.desktop')
  const [imgError, setImgError] = React.useState(false)

  return (
    <div className="screenshot">
      <div className="screenshot-label">{title}</div>
      <div 
        className="screenshot-image-wrapper"
        onClick={() => !imgError && onView(url, title)}
        title={imgError ? t('result.screenshotUnavailable') : 'Click to view fullscreen'}
      >
        {!imgError ? (
          <img 
            src={url} 
            alt={mobile ? 'Mobile screenshot' : 'Desktop screenshot'} 
            onError={() => { setImgError(true); console.warn('Screenshot failed to load:', url) }} 
          />
        ) : (
          <div className="screenshot-missing">
            <div className="screenshot-missing-icon">📷</div>
            <div className="screenshot-missing-text">{t('result.screenshotUnavailable')}</div>
          </div>
        )}

        {!imgError && (
          <button 
            className="fullscreen-btn" 
            onClick={(e) => {
              e.stopPropagation()
              onView(url, title)
            }}
            aria-label="View fullscreen"
          >
            Fullscreen
          </button>
        )}
      </div>
    </div>
  )
}

export default function Result({ result, fromCache }) {
  const [viewerImage, setViewerImage] = useState(null)

  if (!result) return null

  // translate tolerance via i18n if possible (form.tolerance.low|medium|high)
  const rawTol = result?.tolerance ?? ''
  let displayTolerance = rawTol || '—'
  if (rawTol) {
    try {
      const key = rawTol.toString().toLowerCase()
      const trans = t(`form.tolerance.${key}`)
      displayTolerance = (typeof trans === 'string' && trans !== `form.tolerance.${key}`) ? trans : rawTol
    } catch (e) {
      displayTolerance = rawTol
    }
  }

  return (
    <div className="result-card">
      {viewerImage && (
        <ImageViewer 
          imageUrl={viewerImage.url} 
          title={viewerImage.title}
          onClose={() => setViewerImage(null)} 
        />
      )}
      <div className="result-header">
        <div>
          <div className="url-badge">
            <img src={internetImage} alt="URL" style={{height: 18}} />
          </div>
          {/* analysisName: display title/label above the URL if provided */}
          {result.analysisName && (
            <div className="analysis-title">
              <strong>{t('history.analysisTitle')}:</strong> {result.analysisName}
            </div>
          )}
          <h2>{result.url}</h2>
            <div className="meta">
            <span>{t('result.toleranceLabel')}: <strong>{displayTolerance}</strong></span>
            {/* userName: show next to tolerance if present */}
            {result.userName && (
              <span className="user-meta">{t('history.userLabel')}: <strong>{result.userName}</strong></span>
            )}
            <span>{t('result.languageLabel')}: <strong>{result.language}</strong></span>
          </div>
        </div>
        <div className="timestamps">
          <small>
            <img src={clockImage} style={{height: 12}} alt="Timestamp" />
            {formatLocal(result.createdAtUtc)}
          </small>
        </div>
      </div>

      <div className="analysis-grid">
        <div className="analysis-main">
          <div className="section">
            <h3 className="section-heading-left">
              <img src={robotImage} alt="AI" />
              {t('result.whatAISeesTitle')}
            </h3>
            <p className="whatisee">{result.whatHeSee}</p>
          </div>

          <div className="section">
            <h3>
              {result.needsModifications ? (
                <>
                  <img src={alertImage} alt="Alert" />
                  {t('result.modificationsNeeded')}
                </>
              ) : (
                <>
                  <img src={tickImage} alt="Success" />
                  {t('result.noModificationsNeeded')}
                </>
              )}
            </h3>
            {!result.needsModifications && (
              <p className="success-message">{t('result.successMessage')}</p>
            )}
          </div>

          {Array.isArray(result.modifications) && result.modifications.length > 0 && (
              <div className="section">
              <div className="section-header">
                <h3>
                  <img src={fixImage} alt="Issues" />
                  {t('result.issuesFound')}
                </h3>
                <span className="count-badge">{t('result.issueCount')(result.modifications.length)}</span>
              </div>
              <div className="mod-list">
                {result.modifications.map((m, idx) => {
                  const labelKey = `app.categoryLabels.${m.category}`
                  const translated = t(labelKey)
                  const displayCategory = (translated && translated !== labelKey)
                    ? translated
                    : (m.category || '').toString().split('.').pop()

                  // severity display and safe class
                  const sevKey = `app.severity.${(m.severity || '').toString().toLowerCase()}`
                  const sevTranslated = t(sevKey)
                  const displaySeverity = (sevTranslated && !sevTranslated.includes('app.severity'))
                    ? sevTranslated
                    : (() => { const raw = (m.severity || '').toString().split('.').pop() || ''; return raw.charAt(0).toUpperCase() + raw.slice(1) })()
                  const sevClass = (m.severity || '').toString().toLowerCase().split('.').pop().replace(/[^a-z0-9\-]/g, '').replace(/\s+/g, '-')
                  
                  return (
                  <div key={m.id} className="mod-item">
                    <div className="mod-number">{idx + 1}</div>
                    <div className="mod-content">
                      <div className="mod-top">
                        <strong>{displayCategory}</strong>
                        <span className={`sev sev-${sevClass}`}>{displaySeverity}</span>
                      </div>
                      <div className="mod-desc">{m.description}</div>
                      {m.refactoringSuggestion && (
                        <div className="mod-suggestion">{m.refactoringSuggestion}</div>
                      )}
                      <div className="mod-meta">
                        {(() => {
                          const stateKey = `result.state.${(m.state || '').toString().toLowerCase()}`
                          const stateTranslated = t(stateKey)
                          const displayState = (stateTranslated && stateTranslated !== stateKey)
                            ? stateTranslated
                            : (() => { const raw = (m.state || '').toString().split('.').pop() || ''; return raw.charAt(0).toUpperCase() + raw.slice(1) })()
                          return <span className={`state-badge state-${m.state}`}>{displayState}</span>
                        })()}
                        <span className="selector-info">
                          {t('result.selectorLabel')}: <code>{m.cssSelector}</code>
                        </span>
                      </div>
                    </div>
                  </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        <aside className="analysis-side">
          <h4>{t('result.screenshots')}</h4>
          <Screenshot 
            id={result.id} 
            mobile={false} 
            onView={(url, title) => setViewerImage({ url, title })}
          />
          <Screenshot 
            id={result.id} 
            mobile={true}
            onView={(url, title) => setViewerImage({ url, title })}
          />
        </aside>
      </div>
    </div>
  )
}
