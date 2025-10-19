import { useState } from 'react'
import { getAllCachedEntries, clearCache } from '../utils/cache'

export default function History({ list = [], onView, onUpdate, selectedItem }) {
  const [expanded, setExpanded] = useState(null)

  function handleRefresh() {
    onUpdate && onUpdate()
  }

  return (
    <div className="history">
      {list.length === 0 && <div className="empty">No cached requests yet</div>}

      {list.map((entry, idx) => (
        <div 
          key={entry.key || idx} 
          className={`history-item ${selectedItem?.key === entry.key ? 'selected' : ''}`}
        >
          <div className="meta">
            <div className="url">{entry.payload.url}</div>
            <div className="meta-right">
              <small>{new Date(entry.ts).toLocaleString()}</small>
              <button className="tiny" onClick={() => onView && onView(entry)}>View</button>
            </div>
          </div>
          {expanded === idx && <pre className="mini">{JSON.stringify(entry.response, null, 2)}</pre>}
        </div>
      ))}

      <div className="history-actions">
        <button className="small" onClick={handleRefresh}>Refresh</button>
      </div>
    </div>
  )
}
