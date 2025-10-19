import { useEffect, useState } from 'react'
import './styles/app.css'
import LoadingScreen from './components/LoadingScreen'
import Sidebar from './components/Sidebar'
import AnalysisView from './components/AnalysisView'
import HistoryView from './components/HistoryView'
import { getAllCachedEntries, clearCache } from './utils/cache'

export default function App() {
  const [activeView, setActiveView] = useState('analysis')
  const [cacheList, setCacheList] = useState([])
  const [lastResult, setLastResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null)

  useEffect(() => {
    setCacheList(getAllCachedEntries())
  }, [])

  function onSubmitStart() {
    setLoading(true)
    setError(null)
    setLastResult(null)
    setSelectedHistoryItem(null)
    setActiveView('analysis')
  }

  function onSubmitEnd(payload = {}) {
    setLoading(false)
    if (payload.error) {
      setError(payload.error)
      setLastResult(null)
      return
    }
    if (payload.result) {
      setLastResult({ result: payload.result, fromCache: !!payload.fromCache })
      // refresh cache list
      setCacheList(getAllCachedEntries())
    }
  }

  function handleViewCached(entry) {
    setSelectedHistoryItem(entry)
    setActiveView('history')
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
      <Sidebar activeView={activeView} setActiveView={setActiveView} />

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
