import React from 'react'
import { t } from '../i18n'

export default function Sidebar({ activeView, setActiveView }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>
          <span className="logo-icon">🤖</span>
          {t('app.title')}
        </h2>
      </div>

      <nav className="sidebar-nav">
        <button
          className={`nav-item ${activeView === 'analysis' ? 'active' : ''}`}
          onClick={() => setActiveView('analysis')}
        >
          <span className="nav-icon">💡</span>
          {t('app.title')}
        </button>

        <button
          className={`nav-item ${activeView === 'history' ? 'active' : ''}`}
          onClick={() => setActiveView('history')}
        >
          <span className="nav-icon">🕒</span>
          {t('app.testHistory')}
        </button>

        {/* Auth removed: nav item omitted */}
      </nav>

      <div className="sidebar-footer">
        <small>Backend: <code>localhost:5288</code></small>
      </div>
    </aside>
  )
}
