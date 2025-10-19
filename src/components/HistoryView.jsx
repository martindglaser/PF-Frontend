import React from 'react'
import { t } from '../i18n'
import History from './History'
import Result from './Result'
import '../styles/historyview.css'

export default function HistoryView({ cacheList, onView, onUpdate, selectedHistoryItem, setSelectedHistoryItem, onClearCache }) {
  return (
    <>
      <div className="page-header">
        <h1>{t('app.testHistory')}</h1>
        <p>{t('app.historySubtitle')}</p>
      </div>

      <div className="history-layout">
        <div className="content-section history-list-section">
          <div className="history-section">
            <History 
              onView={onView} 
              onUpdate={onUpdate}
              selectedItem={selectedHistoryItem}
            />
          </div>
        </div>

        {selectedHistoryItem && (
          <div className="content-section history-detail-section">
            <div className="detail-header">
              <h3>{t('app.testDetails')}</h3>
              <button className="small" onClick={() => setSelectedHistoryItem(null)}>✕ {t('app.close')}</button>
            </div>

            {/* Severity counts */}
            {selectedHistoryItem.response?.modificaciones && selectedHistoryItem.response.modificaciones.length > 0 && (
              <>
                <h4 className="stats-section-title">📊 {t('app.issuesBySeverity')}</h4>
                {(() => {
                  const highCount = selectedHistoryItem.response.modificaciones.filter(m => 
                    (m.severity || m.severidad || '').toLowerCase() === 'high' || 
                    (m.severity || m.severidad || '').toLowerCase() === 'alto'
                  ).length

                  const mediumCount = selectedHistoryItem.response.modificaciones.filter(m => 
                    (m.severity || m.severidad || '').toLowerCase() === 'medium' || 
                    (m.severity || m.severidad || '').toLowerCase() === 'medio'
                  ).length

                  const lowCount = selectedHistoryItem.response.modificaciones.filter(m => 
                    (m.severity || m.severidad || '').toLowerCase() === 'low' || 
                    (m.severity || m.severidad || '').toLowerCase() === 'bajo'
                  ).length

                  return (
                    <div className="severity-stats">
                          <div className="stat-card stat-high">
                            <div className="stat-icon">🔴</div>
                            <div className="stat-content">
                              <div className="stat-label">{t('app.severity.high')}</div>
                              <div className="stat-value">{highCount}</div>
                            </div>
                          </div>

                          <div className="stat-card stat-medium">
                            <div className="stat-icon">🟡</div>
                            <div className="stat-content">
                              <div className="stat-label">{t('app.severity.medium')}</div>
                              <div className="stat-value">{mediumCount}</div>
                            </div>
                          </div>

                          <div className="stat-card stat-low">
                            <div className="stat-icon">🟢</div>
                            <div className="stat-content">
                              <div className="stat-label">{t('app.severity.low')}</div>
                              <div className="stat-value">{lowCount}</div>
                            </div>
                          </div>
                    </div>
                  )
                })()}
              </>
            )}

            {/* Category counts */}
            {selectedHistoryItem.response?.modificaciones && selectedHistoryItem.response.modificaciones.length > 0 && (
              <>
                <h4 className="stats-section-title">🏷️ {t('app.issuesByCategory')}</h4>
                {(() => {
                  const categoryCounts = {}
                  selectedHistoryItem.response.modificaciones.forEach(m => {
                    const category = m.category || 'other'
                    categoryCounts[category] = (categoryCounts[category] || 0) + 1
                  })

                  return (
                    <div className="category-stats">
                      {Object.entries(categoryCounts).map(([category, count]) => {
                        const colors = {
                          ui: { bg: 'rgba(168, 85, 247, 0.1)', border: 'rgba(168, 85, 247, 0.3)', icon: '🎨' },
                          forms: { bg: 'rgba(34, 197, 94, 0.1)', border: 'rgba(34, 197, 94, 0.3)', icon: '📝' }
                        }[category] || { bg: 'rgba(139, 149, 176, 0.1)', border: 'rgba(139, 149, 176, 0.3)', icon: '📋' }

                        const label = t(`app.categoryLabels.${category}`) || category

                        return (
                          <div 
                            key={category} 
                            className="category-stat-card"
                            style={{
                              background: colors.bg,
                              borderColor: colors.border
                            }}
                          >
                            <div className="stat-icon">{colors.icon}</div>
                            <div className="stat-content">
                              <div className="stat-label">{label}</div>
                              <div className="stat-value">{count}</div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )
                })()}
              </>
            )}

            <Result result={selectedHistoryItem.response} fromCache={true} />
          </div>
        )}
      </div>
    </>
  )
}
