import { useState } from 'react'
import { t } from '../i18n'

export default function History({ list = [], onView, onUpdate, selectedItem }) {
  const [expanded, setExpanded] = useState(null)

  function handleRefresh() {
    onUpdate && onUpdate()
  }

  return (
    <div className="history">
      {list.length === 0 && <div className="empty">{t('history.empty')}</div>}

      {list.map((entry, idx) => (
        <div 
          key={entry.key || idx} 
          className={`history-item ${selectedItem?.key === entry.key ? 'selected' : ''}`}
          onClick={() => setExpanded(expanded === idx ? null : idx)}
        >
          <div className="meta">
            <div className="url">{entry.payload.url}</div>
            <div className="meta-right">
              <small>{new Date(entry.ts).toLocaleString()}</small>
              <button className="tiny" onClick={() => onView && onView(entry)}>{t('history.view')}</button>
            </div>
          </div>
          {expanded === idx && <pre className="mini">{JSON.stringify(entry.response, null, 2)}</pre>}
        </div>
      ))}

      <div className="history-actions">
        <button className="small" onClick={handleRefresh}>{t('history.refresh')}</button>
      </div>
    </div>
  )
}
