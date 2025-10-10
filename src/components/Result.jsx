import React, { useState } from 'react'
import ImageViewer from './ImageViewer'

function Screenshot({ id, mobile, onView }) {
  const base = 'http://localhost:5288/assets/screenshots'
  const url = mobile ? `${base}/${id}_mobile.png` : `${base}/${id}.png`
  const title = mobile ? '📱 Mobile' : '🖥️ Desktop'
  
  return (
    <div className="screenshot">
      <div className="screenshot-label">{title}</div>
      <div 
        className="screenshot-image-wrapper"
        onClick={() => onView(url, title)}
        title="Click to view fullscreen"
      >
        <img 
          src={url} 
          alt={mobile ? 'Mobile screenshot' : 'Desktop screenshot'} 
          onError={(e)=>{
            e.target.style.opacity = 0.3
            e.target.alt = 'Screenshot not available'
          }} 
        />
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
          <div className="url-badge">🌐 URL</div>
          <h2>{result.url}</h2>
          <div className="meta">
            <span>📊 Tolerance: <strong>{result.tolerance}</strong></span>
            <span>🌍 Language: <strong>{result.language}</strong></span>
            <span className={fromCache ? 'cached-badge' : 'live-badge'}>
              {fromCache ? '💾 Cached' : '✨ Live'}
            </span>
          </div>
        </div>
        <div className="timestamps">
          <small>🕐 {new Date(result.createdAtUtc).toLocaleString()}</small>
        </div>
      </div>

      <div className="analysis-grid">
        <div className="analysis-main">
          <div className="section">
            <h3>🤖 What the AI sees</h3>
            <p className="whatisee">{result.whatHeSee}</p>
          </div>

          <div className="section">
            <h3>
              {result.needsModifications ? '⚠️ Modifications needed' : '✅ No modifications needed'}
            </h3>
            {!result.needsModifications && (
              <p className="success-message">Great! Your page looks good. No critical issues detected.</p>
            )}
          </div>

          {Array.isArray(result.modifications) && result.modifications.length > 0 && (
            <div className="section">
              <div className="section-header">
                <h3>🔧 Issues found</h3>
                <span className="count-badge">{result.modifications.length} issue{result.modifications.length > 1 ? 's' : ''}</span>
              </div>
              <div className="mod-list">
                {result.modifications.map((m, idx) => (
                  <div key={m.id} className="mod-item">
                    <div className="mod-number">{idx + 1}</div>
                    <div className="mod-content">
                      <div className="mod-top">
                        <strong>📌 {m.category}</strong>
                        <span className={`sev sev-${m.severity.toLowerCase()}`}>
                          {m.severity}
                        </span>
                      </div>
                      <div className="mod-desc">{m.description}</div>
                      <div className="mod-meta">
                        <span className="state-badge state-{m.state}">{m.state}</span>
                        <span className="selector-info">
                          Selector: <code>{m.cssSelector}</code>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <details className="json-section">
            <summary>📄 View raw JSON</summary>
            <pre className="result-json-small">{JSON.stringify(result, null, 2)}</pre>
          </details>
        </div>

        <aside className="analysis-side">
          <h4>📸 Screenshots</h4>
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
