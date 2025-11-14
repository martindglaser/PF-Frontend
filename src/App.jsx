import { useEffect, useState } from 'react'
import { t } from './i18n'
import './styles/app.css'
import LoadingScreen from './components/LoadingScreen'
import Sidebar from './components/Sidebar'
import AnalysisView from './components/AnalysisView'
import HistoryView from './components/HistoryView'
import { getAllCachedEntries, clearCache } from './utils/cache'

export default function App() {
  const [activeView, setActiveView] = useState(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem('activeView') || 'analysis'
      }
    } catch (e) {
      // ignore storage errors
    }
    return 'analysis'
  })
  const [cacheList, setCacheList] = useState([])
  const [lastResult, setLastResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null)

  useEffect(() => {
    setCacheList(getAllCachedEntries())
  }, [])

  // set page title from i18n
  useEffect(() => {
    try {
      document.title = t('app.title') || document.title
    } catch (e) {
      // ignore if document not available
    }
  }, [])

  function onSubmitStart() {
    setLoading(true)
    setError(null)
    setLastResult(null)
    setSelectedHistoryItem(null)
    changeView('analysis')
  }

  function onSubmitEnd(payload = {}) {
    setLoading(false)
    if (payload.error) {
      // Log full error for debugging, but show a generic message to the user to avoid leaking server internals
      try { console.warn('Backend error:', payload.error) } catch (e) { /* ignore */ }
      setError(t('app.serverError') || 'Ocurrió un error. Intente nuevamente más tarde.')
      setLastResult(null)
      return
    }
    if (payload.result) {
      // Instead of showing result in analysis view, redirect to history
      const historyItem = {
        response: payload.result,
        result: payload.result,
        fromCache: !!payload.fromCache,
        ts: payload.result.createdAtUtc || payload.result.createdAt || new Date().toISOString()
      }
      setSelectedHistoryItem(historyItem)
      changeView('history')
      setLastResult(null)
      // refresh cache list
      setCacheList(getAllCachedEntries())
      
      // Scroll to detail after view changes
      setTimeout(() => {
        const el = document.querySelector('#history-detail')
        if (el && typeof el.scrollIntoView === 'function') {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
          try { el.focus({ preventScroll: true }) } catch (e) { /* ignore */ }
        }
      }, 100)
    }
  }

  function handleViewCached(entry) {
    const responseSrc = entry.response ?? entry.result ?? entry
    // ensure response.createdAtUtc is present so details show the original timestamp
  const createdAt = responseSrc.createdAtUtc ?? responseSrc.createdAt ?? entry.createdAt ?? entry.ts
  const response = { ...responseSrc, createdAtUtc: createdAt }

    const normalized = {
      ...entry,
      response
    }
    setSelectedHistoryItem(normalized)
    changeView('history')
  }

  function changeView(view) {
    setActiveView(view)
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem('activeView', view)
      }
    } catch (e) {
      // ignore
    }
  }

  function handleClearCache() {
    if (confirm('Clear all cached requests?')) {
      clearCache()
      setCacheList([])
      setSelectedHistoryItem(null)
    }
  }

  return (
    <div className="app-root">
  <Sidebar activeView={activeView} setActiveView={changeView} />

      {loading && <LoadingScreen />}

      <main className="main-content">
        {activeView === 'analysis' ? (
          <AnalysisView onSubmitStart={onSubmitStart} onSubmitEnd={onSubmitEnd} lastResult={lastResult} error={error} />
        ) : activeView === 'history' ? (
          <HistoryView
            cacheList={cacheList}
            onView={handleViewCached}
            onUpdate={() => setCacheList(getAllCachedEntries())}
            selectedHistoryItem={selectedHistoryItem}
            setSelectedHistoryItem={setSelectedHistoryItem}
            onClearCache={handleClearCache}
          />
        ) : null}
      </main>
    </div>
  )
}
