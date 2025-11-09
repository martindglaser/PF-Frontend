import { useState, useEffect } from 'react'
import { t } from '../i18n'
import { listAnalyses, deleteAnalysis, getAnalysis } from '../utils/api'
import { formatLocal } from '../utils/formatDate.js'
import trashImage from '../assets/trash.svg'

export default function History({ list = [], onView, onUpdate, selectedItem, filterText = '' }) {
  
  const [items, setItems] = useState(list || [])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)


  useEffect(() => {
      fetchAnalyses({ filter: filterText })
  }, [filterText])


  async function fetchAnalyses(params = {}) {
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
      setItems(normalized)
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
      setItems(prev => prev.filter(it => (it.id || it.key) !== id))
      await deleteAnalysis(id)
      onUpdate && onUpdate(items.filter(it => (it.id || it.key) !== id))
    } catch (err) {
      console.warn('deleteAnalysis error', err)
      setError(t('history.deleteError') || 'No se pudo eliminar la entrada. Intente más tarde.')
      // re-fetch to restore state
      fetchAnalyses()
    }
  }





  return (
    <div className="history">

      {!items || items.length === 0 && <div className="empty">{t('history.empty')}</div>}

      {items.map((entry, idx) => (
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

    </div>
  )
}
