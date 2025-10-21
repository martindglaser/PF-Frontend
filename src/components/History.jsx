import { useState, useEffect } from 'react'
import { t } from '../i18n'
import { listAnalyses, deleteAnalysis, getAnalysis } from '../utils/api'

export default function History({ list = [], onView, onUpdate, selectedItem }) {
  const [expanded, setExpanded] = useState(null)
  const [items, setItems] = useState(list || [])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

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

  function handleRefresh() {
    fetchAnalyses()
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

  useEffect(() => {
    if (!list || list.length === 0) {
      fetchAnalyses()
    } else {
      setItems(list)
      // optionally refresh in background: fetchAnalyses()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="history">
      {loading && <div className="empty">{t('loading.title')}</div>}
      {error && <div className="error">{error}</div>}

      {!loading && items.length === 0 && <div className="empty">{t('history.empty')}</div>}

      {items.map((entry, idx) => (
        <div
          key={entry.key || entry.id || idx}
          className={`history-item ${selectedItem?.key === entry.key ? 'selected' : ''}`}
          onClick={() => setExpanded(expanded === idx ? null : idx)}
        >
          <div className="meta">
            <div className="url">{entry.payload?.url ?? entry.url}</div>

            <div className="meta-right">
              {/* additional badges/info */}
              {(() => {
                const response = entry.response ?? entry.result ?? entry
                const mods = response?.modifications || response?.modificaciones || []
                const issueCount = Array.isArray(mods) ? mods.length : 0
                return (
                  <>
                    <span className="badge small">{t('result.toleranceLabel')}: <strong style={{marginLeft:6}}>{response?.tolerance ?? entry.tolerance ?? '—'}</strong></span>
                    <span className="badge small">{t('result.languageLabel')}: <strong style={{marginLeft:6}}>{response?.language ?? entry.language ?? '—'}</strong></span>
                    {entry.fromCache || response?.fromCache ? (
                      <span className="badge cached small">{t('result.cachedLabel')}</span>
                    ) : null}
                    <span className="badge issues small">{t('result.issueCount')(issueCount)}</span>
                  </>
                )
              })()}

              <small>{new Date(entry.ts ?? entry.createdAt ?? Date.now()).toLocaleString()}</small>
              <button
                className="tiny"
                onClick={async (e) => {
                  e.stopPropagation()
                  // try to fetch full analysis from backend to get accurate timestamp
                  if (entry.id) {
                    try {
                      const full = await getAnalysis(entry.id)
                      const combined = { ...entry, response: full, result: full }
                      onView && onView(combined)
                      // scroll the details pane into view after parent updates selection
                      setTimeout(() => {
                        const el = document.querySelector('#history-detail')
                        if (el && typeof el.scrollIntoView === 'function') {
                          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                          try { el.focus({ preventScroll: true }) } catch (e) { /* ignore */ }
                        }
                      }, 80)
                      return
                    } catch (err) {
                      // fallback to passing existing entry
                      console.warn('getAnalysis failed', err)
                    }
                  }
                  onView && onView(entry)
                  // scroll the details pane into view after parent updates selection
                  setTimeout(() => {
                    const el = document.querySelector('#history-detail')
                    if (el && typeof el.scrollIntoView === 'function') {
                      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                      try { el.focus({ preventScroll: true }) } catch (e) { /* ignore */ }
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
                🗑️
              </button>
            </div>
          </div>

          {expanded === idx && (
            <pre className="mini">{JSON.stringify(entry.response ?? entry.result ?? entry, null, 2)}</pre>
          )}
        </div>
      ))}

      <div className="history-actions">
        <button className="small" onClick={handleRefresh}>
          {t('history.refresh')}
        </button>
      </div>
    </div>
  )
}
