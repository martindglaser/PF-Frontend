import { useState, useEffect } from 'react'
import { t } from '../i18n'
import { listAnalyses } from '../utils/api'

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
      setItems(resolved)
      onUpdate && onUpdate(resolved)
    } catch (err) {
      setError(err?.message ?? String(err))
    } finally {
      setLoading(false)
    }
  }

  function handleRefresh() {
    fetchAnalyses()
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
              <small>{new Date(entry.ts ?? entry.createdAt ?? Date.now()).toLocaleString()}</small>
              <button
                className="tiny"
                onClick={(e) => {
                  e.stopPropagation()
                  onView && onView(entry)
                }}
              >
                {t('history.view')}
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
