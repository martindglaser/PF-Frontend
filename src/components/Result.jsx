import React, { useState } from 'react'
import { t } from '../i18n'
import ImageViewer from './ImageViewer'

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
            🔍 Fullscreen
          </button>
        )}
      </div>
    </div>
  )
}

export default function Result({ result, fromCache }) {
  const [viewerImage, setViewerImage] = useState(null)

  if (!result) return null

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
          <div className="url-badge">{t('result.urlBadge')}</div>
          <h2>{result.url}</h2>
          <div className="meta">
            <span>{t('result.toleranceLabel')}: <strong>{result.tolerance}</strong></span>
            <span>{t('result.languageLabel')}: <strong>{result.language}</strong></span>
            <span className={fromCache ? 'cached-badge' : 'live-badge'}>
              {fromCache ? t('result.cachedLabel') : t('result.liveLabel')}
            </span>
          </div>
        </div>
        <div className="timestamps">
          <small>{t('result.timestampPrefix')} {new Date(result.createdAtUtc).toLocaleString()}</small>
        </div>
      </div>

      <div className="analysis-grid">
        <div className="analysis-main">
          <div className="section">
            <h3>{t('result.whatAISeesTitle')}</h3>
            <p className="whatisee">{result.whatHeSee}</p>
          </div>

          <div className="section">
            <h3>
              {result.needsModifications ? t('result.modificationsNeeded') : t('result.noModificationsNeeded')}
            </h3>
            {!result.needsModifications && (
              <p className="success-message">{t('result.successMessage')}</p>
            )}
          </div>

          {Array.isArray(result.modifications) && result.modifications.length > 0 && (
              <div className="section">
              <div className="section-header">
                <h3>{t('result.issuesFound')}</h3>
                <span className="count-badge">{t('result.issueCount')(result.modifications.length)}</span>
              </div>
              <div className="mod-list">
                {result.modifications.map((m, idx) => {
                  const labelKey = `app.categoryLabels.${m.category}`
                  const translated = t(labelKey)
                  const displayCategory = (translated && translated !== labelKey)
                    ? translated
                    : (m.category || '').toString().split('.').pop()

                  return (
                  <div key={m.id} className="mod-item">
                    <div className="mod-number">{idx + 1}</div>
                    <div className="mod-content">
                      <div className="mod-top">
                        <strong>{displayCategory}</strong>
                        <span className={`sev sev-${(m.severity || '').toLowerCase()}`}>
                          {t(`app.severity.${(m.severity || '').toLowerCase()}`) || m.severity}
                        </span>
                      </div>
                      <div className="mod-desc">{m.description}</div>
                      <div className="mod-meta">
                        <span className={`state-badge state-${m.state}`}>{m.state}</span>
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

          <details className="json-section">
            <summary>{t('result.viewRawJson')}</summary>
            <pre className="result-json-small">{JSON.stringify(result, null, 2)}</pre>
          </details>
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
