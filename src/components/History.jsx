import { useState, useEffect } from 'react'
import { t } from '../i18n'
import { listAnalyses, deleteAnalysis, getAnalysis } from '../utils/api'
import { formatLocal } from '../utils/formatDate.js'
import trashImage from '../assets/trash.svg'
import fowardImage from '../assets/forward.svg'
import previousImage from '../assets/previous.svg'

export default function History({ list = [], onView, onUpdate, selectedItem, filterText = '' }) {
  
  const [response, setResponse] = useState({ items: [] })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)


  useEffect(() => {
    setPage(1)
  }, [filterText])

  useEffect(() => {
      fetchAnalyses()
  }, [filterText, page])


  async function fetchAnalyses(params = {}) {
    params = { filter: filterText, pageSize: 6, page}
    setLoading(true)
    setError(null)
    try {
      const data = await listAnalyses(params)

      const resolved = Array.isArray(data) ? data : (data?.items ?? [])
      
      // normalize timestamps so we display the real run time instead of falling back to now
      const normalized = resolved.map(item => {
        const resp = item.response ?? item.result ?? item
        const ts = resp?.createdAtUtc ?? resp?.createdAt ?? item.createdAt ?? item.ts ?? resp?.timestamp ?? resp?.time
        return { ...item, ts }
      })
      setResponse(data)
      onUpdate && onUpdate(resolved)
    } catch (err) {
      // keep technical details in console for debugging, but show a generic message to users
      console.warn('listAnalyses error', err)
      setError(t('history.fetchError') || 'No se pudieron cargar los registros. Intente más tarde.')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(entry, e) {
    e.stopPropagation()
    const id = entry.id || entry.key
  if (!id) return setError(t('history.deleteError') || 'No se pudo eliminar la entrada. Intente más tarde.')
    const ok = window.confirm(t('history.confirmDelete') || 'Delete this entry?')
    if (!ok) return

    try {
      // optimistic UI update
      await deleteAnalysis(id)
      fetchAnalyses()
    } catch (err) {
      console.warn('deleteAnalysis error', err)
      setError(t('history.deleteError') || 'No se pudo eliminar la entrada. Intente más tarde.')
      // re-fetch to restore state
      fetchAnalyses()
    }
  }



  return (
    <div className="history">
      {loading && (
        <div className="loading-message" style={{ padding: '20px', textAlign: 'center', color: 'var(--muted)' }}>
          {t('history.loading') || 'Cargando análisis...'}
        </div>
      )}

      {!loading && (!response.items || response.items.length === 0) && <div className="empty">{t('history.empty')}</div>}

      {response.items.map((entry, idx) => (
        <div
          key={entry.key || entry.id || idx}
          className={`history-item ${selectedItem?.key === entry.key ? 'selected' : ''}`}
        >
          <div className="meta">
            {/* */}
            {(() => {
              const response = entry.response ?? entry.result ?? entry
              const title = response?.AnalysisName ?? response?.analysisName ?? entry.payload?.AnalysisName ?? entry.payload?.name ?? response?.name ?? '—'
              const userDisplay = response?.UserName ?? response?.userName ?? entry.payload?.UserName ?? entry.payload?.user ?? response?.user ?? '—'
              return (
                <div>
                  {title && (
                    <div className="analysis-title"><strong>{t('history.analysisTitle')}:</strong> {title}</div>
                  )}
                </div>
              )
            })()}

            <div className="url"><strong className="url-label">URL:</strong> {entry.payload?.url ?? entry.url}</div>

            <div className="meta-right">
              {(() => {
                const response = entry.response ?? entry.result ?? entry
                const mods = response?.modifications || response?.modificaciones || []
                const issueCount = Array.isArray(mods) ? mods.length : 0

                const rawTol = response?.tolerance ?? entry.tolerance ?? ''
                let displayTol = rawTol || '—'
                if (rawTol) {
                  try {
                    const key = rawTol.toString().toLowerCase()
                    const trans = t(`form.tolerance.${key}`)
                    displayTol = (typeof trans === 'string' && trans !== `form.tolerance.${key}`) ? trans : rawTol
                  } catch (e) {
                    displayTol = rawTol
                  }
                }

                const title = response?.AnalysisName ?? response?.analysisName ?? entry.payload?.AnalysisName ?? entry.payload?.name ?? response?.name ?? '—'
                const userDisplay = response?.UserName ?? response?.userName ?? entry.payload?.UserName ?? entry.payload?.user ?? response?.user ?? '—'

                return (
                  <>
                    <span className="badge small">{t('result.toleranceLabel')}: <strong style={{marginLeft:6}}>{displayTol}</strong></span>
                    <span className="badge small">{t('history.userLabel')}: <strong style={{marginLeft:6}}>{userDisplay}</strong></span>
                    <span className="badge small">{t('result.languageLabel')}: <strong style={{marginLeft:6}}>{response?.language ?? entry.language ?? '—'}</strong></span>
                    <span className="badge issues small">{t('result.issueCount')(issueCount)}</span>
                  </>
                )
              })()}

              <small>{formatLocal(entry.ts ?? entry.createdAt ?? Date.now())}</small>
              <button
                className="tiny"
                onClick={async (e) => {
                  e.stopPropagation()
                  if (entry.id) {
                    try {
                      const full = await getAnalysis(entry.id)
                      const combined = { ...entry, response: full, result: full }
                      onView && onView(combined)
                      setTimeout(() => {
                        const el = document.querySelector('#history-detail')
                        if (el && typeof el.scrollIntoView === 'function') {
                          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                          try { el.focus({ preventScroll: true }) } catch (e) { /*  */ }
                        }
                      }, 80)
                      return
                    } catch (err) {
                      console.warn('getAnalysis failed', err)
                    }
                  }
                  onView && onView(entry)
                  setTimeout(() => {
                    const el = document.querySelector('#history-detail')
                    if (el && typeof el.scrollIntoView === 'function') {
                      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                      try { el.focus({ preventScroll: true }) } catch (e) { /*  */ }
                    }
                  }, 80)
                }}
              >
                {t('history.view')}
              </button>
              <button
                className="tiny"
                onClick={(e) => handleDelete(entry, e)}
                title={t('history.delete')}
                style={{ marginLeft: 8, background: 'transparent', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <img src={trashImage} style={{height: 14}} alt={t('history.delete')} />
              </button>
            </div>
          </div>

        </div>
      ))}
      
      {response.totalPages > 0 && (
      <div className="pagination" style={{display:'flex', alignItems:'center', justifyContent: 'center', gap:8, width: '100%'}}>
        <button
          className="tiny"
          disabled={!response.currentPage || response.currentPage <= 1}
          onClick={() => setPage(Math.max(1, page - 1))}
          title={t('history.previousPage')}
          style={{ visibility: (!response.currentPage || response.currentPage <= 1) ? 'hidden' : 'visible', width: 40, height: 32, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <img src={previousImage} style={{height: 15}} alt={t('history.previousPage')} />
        </button>

        <span style={{minWidth: 100, textAlign: 'center', display: 'inline-block'}}>
          {(response.currentPage ?? 0)} / {(response.totalPages ?? 0)}
        </span>

        <button
          className="tiny"
          disabled={!response.totalPages || response.currentPage >= response.totalPages}
          onClick={() => setPage(Math.min(response.totalPages || page, page + 1))}
          title={t('history.nextPage')}
          style={{ visibility: (!response.totalPages || response.currentPage >= response.totalPages) ? 'hidden' : 'visible', width: 40, height: 32, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <img src={fowardImage} style={{height: 15}} alt={t('history.nextPage')} />
        </button>
      </div>        
      )}
    </div>
  )
}
