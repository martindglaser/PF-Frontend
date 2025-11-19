import React from 'react'
import { t } from '../i18n'
import '../styles/sidebar.css'
import historyImage from '../assets/history.svg'
import analysisImage from '../assets/analysis.svg'

export default function Sidebar({ activeView, setActiveView }) {
    const iconStyle = {
      height: 23
    };
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>
          <img src="/app-icon.png" alt={t('app.title')} className="logo-img" />
        </h2>
      </div>

      <nav className="sidebar-nav">
        <button
          className={`nav-item ${activeView === 'analysis' ? 'active' : ''}`}
          onClick={() => setActiveView('analysis')}
        >
          <span className="nav-icon"><img style={iconStyle} src={analysisImage} alt="Analysis" /></span>
          {t('app.title')}
        </button>

        <button
          className={`nav-item ${activeView === 'history' ? 'active' : ''}`}
          onClick={() => setActiveView('history')}
        >
          <span className="nav-icon"><img style={iconStyle} src={historyImage} alt="History" /></span>
          {t('app.testHistory')}
        </button>

      </nav>

      <div className="sidebar-footer">
        {/* <small>{t('sidebar.backendLabel')}: <code>localhost:5288</code></small> */}
      </div>
    </aside>
  )
}
