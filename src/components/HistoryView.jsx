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
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  const handleFilterChange = (newFilterText) => {
    setFilterText(newFilterText)
    if (onUpdate) {
      onUpdate({ resetPage: true })
    }
  }

  const handleDateChange = () => {
    if (onUpdate) {
      onUpdate({ resetPage: true })
    }
  }

  const formatDateForBackend = (dateStr) => {
    if (!dateStr) return ''
    const [year, month, day] = dateStr.split('-')
    return `${day}/${month}/${year}`
  }

  const openDatePicker = (id) => {
    const el = document.getElementById(id)
    if (!el) return
    try {
      if (typeof el.showPicker === 'function') {
        el.showPicker()
        return
      }
    } catch (e) {
    }
    el.focus()
    try { el.click() } catch (e) { /* noop */ }
  }

  const handleDateKeyDown = (e, id) => {
    const allowed = ['Tab', 'Escape', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown']
    if (e.key === 'Enter') {
      e.preventDefault()
      openDatePicker(id)
      return
    }

    if (!allowed.includes(e.key)) {
      e.preventDefault()
    }
  }

  return (
    <>
      <div className="page-header">
        <h1>{t('app.testHistory')}</h1>
        <p>{t('app.historySubtitle')}</p>

        <div className="history-filter">
          <div className="filter-text-group">
            <label htmlFor="history-filter-input" className="filter-label">
              {t('app.filterLabel') || 'Filtrar:'}
            </label>
            <input
              id="history-filter-input"
              type="text"
              placeholder={t('app.filterPlaceholder') || 'Título, URL o Usuario...'}
              value={filterText}
              onChange={e => handleFilterChange(e.target.value)}
              autoComplete="off"
            />
          </div>
          
          <div className="date-filters">
            <div className="date-group">
              <label htmlFor="from-date" className="date-label">
                {t('app.fromDateLabel') || 'Desde:'}
              </label>
              <input
                id="from-date"
                type="date"
                value={fromDate}
                max={toDate || undefined}
                onKeyDown={(e) => handleDateKeyDown(e, 'from-date')}
                onFocus={() => openDatePicker('from-date')}
                onClick={() => openDatePicker('from-date')}
                onChange={e => {
                  const v = e.target.value
                  setFromDate(v)
                  if (toDate && toDate < v) {
                    setToDate(v)
                  }
                  handleDateChange()
                  if (v) {
                    document.getElementById('to-date')?.focus()
                  }
                }}
                className="date-input"
              />
              <button
                type="button"
                className="date-picker-btn"
                aria-label={t('app.openCalendar') || 'Abrir calendario'}
                onClick={() => openDatePicker('from-date')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path fill="#00D4FF" d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H5V9h14v9zM7 11h5v5H7z"/>
                </svg>
              </button>
            </div>
            
            <div className="date-group">
              <label htmlFor="to-date" className="date-label">
                {t('app.toDateLabel') || 'Hasta:'}
              </label>
              <input
                id="to-date"
                type="date"
                value={toDate}
                min={fromDate || undefined}
                onKeyDown={(e) => handleDateKeyDown(e, 'to-date')}
                onFocus={() => openDatePicker('to-date')}
                onClick={() => openDatePicker('to-date')}
                onChange={e => {
                  const v = e.target.value
                  setToDate(v)
                  if (fromDate && fromDate > v) {
                    setFromDate(v)
                  }
                  handleDateChange()
                }}
                className="date-input"
              />
              <button
                type="button"
                className="date-picker-btn"
                aria-label={t('app.openCalendar') || 'Abrir calendario'}
                onClick={() => openDatePicker('to-date')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path fill="#00D4FF" d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H5V9h14v9zM7 11h5v5H7z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
   
        <div style={{ marginTop: 12 }}>
        <button
          className="small"
          onClick={() => {
            const params = new URLSearchParams()
            if (filterText) params.append('filter', filterText)
            if (fromDate) params.append('from', formatDateForBackend(fromDate))
            if (toDate) params.append('to', formatDateForBackend(toDate))

            const url = `http://localhost:5288/api/analysis/export?${params.toString()}`
            window.location.href = url; // dispara el GET y la descarga
          }}
          title="Exportar reporte consolidado (Excel)"
        >
          Exportar reporte
        </button>
        </div>
      </div>

      <div className="history-layout">
        <div className="content-section history-list-section">
          <div className="history-section no-scroll">
            <History
              onView={onView}
              onUpdate={onUpdate}
              selectedItem={selectedHistoryItem}
              filterText={filterText}
              fromDate={fromDate}
              toDate={toDate}
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
