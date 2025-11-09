import React, { useEffect, useState } from 'react'
import { t } from '../i18n'
import History from './History'
import Result from './Result'
import { exportReportCSV } from '../utils/exportCSV' 
import '../styles/historyview.css'
import closeIcon from '../assets/exit.svg'

export default function HistoryView({
  cacheList,
  onView,
  onUpdate,
  selectedHistoryItem,
  setSelectedHistoryItem
}) {
  const [filterText, setFilterText] = useState('')


  return (
    <>
      <div className="page-header">
        <h1>{t('app.testHistory')}</h1>
        <p>{t('app.historySubtitle')}</p>

        <div className="history-filter">
          <label htmlFor="history-filter-input" className="filter-label">
            {t('app.filterLabel') || 'Filtrar:'}
          </label>
          <input
            id="history-filter-input"
            type="text"
            placeholder={t('app.filterPlaceholder') || 'Título, URL o Usuario...'}
            value={filterText}
            onChange={e => setFilterText(e.target.value)}
            autoComplete="off"
          />
        </div>

   
        <div style={{ marginTop: 12 }}>
      <button
  className="small"
  onClick={() => {
    exportReportCSV(filteredList, 'reporte_consolidado.csv');
  }}
  title="Exportar reporte consolidado (CSV)"
>
 Exportar reporte
</button>
        </div>
      </div>

      <div className="history-layout">
        <div className="content-section history-list-section">
          <div className="history-section">
            <History
              onView={onView}
              onUpdate={onUpdate}
              selectedItem={selectedHistoryItem}
              filterText={filterText}
            />
          </div>
        </div>

        {selectedHistoryItem && (
          <div
            id="history-detail"
            tabIndex={-1}
            className="content-section history-detail-section"
          >
            <div className="detail-header">
              <h3>{t('app.testDetails')}</h3>

              <div className="detail-buttons" style={{ display: 'flex', gap: 8 }}>
       
                <button className="small" onClick={() => setSelectedHistoryItem(null)}>
                  <img src={closeIcon} alt="Close" />
                  {t('app.close')}
                </button>
              </div>
            </div>

            {selectedHistoryItem.response?.modificaciones?.length > 0 && (
              <>
                <h4 className="stats-section-title">{t('app.issuesBySeverity')}</h4>
                {(() => {
                  const mods = selectedHistoryItem.response.modificaciones
                  const norm = (x) => (x || '').toLowerCase()
                  const highCount   = mods.filter(m => ['high', 'alto'].includes(norm(m.severity || m.severidad))).length
                  const mediumCount = mods.filter(m => ['medium', 'medio'].includes(norm(m.severity || m.severidad))).length
                  const lowCount    = mods.filter(m => ['low', 'bajo'].includes(norm(m.severity || m.severidad))).length

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

            {selectedHistoryItem.response?.modificaciones?.length > 0 && (
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
                        const colors =
                          {
                            ui:    { bg: 'rgba(168,85,247,0.1)', border: 'rgba(168,85,247,0.3)', icon: '🎨' },
                            forms: { bg: 'rgba(34,197,94,0.1)',  border: 'rgba(34,197,94,0.3)',  icon: '📝' }
                          }[category] ||
                          { bg: 'rgba(139,149,176,0.1)', border: 'rgba(139,149,176,0.3)', icon: '📋' }

                        const label = t(`app.categoryLabels.${category}`) || category

                        return (
                          <div
                            key={category}
                            className="category-stat-card"
                            style={{ background: colors.bg, borderColor: colors.border }}
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
