import { useEffect, useState } from 'react'
import './App.css'
import AnalysisForm from './components/Form'
import History from './components/History'
import Result from './components/Result'
import LoadingScreen from './components/LoadingScreen'
import { getAllCachedEntries, clearCache } from './cache'

function App() {
  const [lastResult, setLastResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [cacheList, setCacheList] = useState([])

  useEffect(() => {
    setCacheList(getAllCachedEntries())
  }, [])

  function onSubmitStart() {
    setLoading(true)
    setError(null)
    setLastResult(null)
  }

  function onSubmitEnd({ result, fromCache, error }) {
    setLoading(false)
    if (error) setError(error)
    else setLastResult({ result, fromCache })
    setCacheList(getAllCachedEntries())
  }

  function handleViewCached(entry) {
    setLastResult({ result: entry.response, fromCache: true })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleClearCache() {
    if (!confirm('Clear all cached requests?')) return
    clearCache()
    setCacheList([])
  }

  return (
    <div className="app-root">
      {loading && <LoadingScreen />}
      
      <header>
        <h1>AI Webpage Analysis</h1>
        <p className="subtitle">Submit a URL and get an AI analysis (backend at <code>http://localhost:5288/api/analysis/</code>)</p>
      </header>

      <main>
        <div className="top-section">
          <AnalysisForm onStart={onSubmitStart} onComplete={onSubmitEnd} />

          <aside className="right">
            <div className="history-header">
              <h3>Cached Requests</h3>
              <button className="small" onClick={handleClearCache}>Clear cache</button>
            </div>
            <History list={cacheList} onView={handleViewCached} onUpdate={() => setCacheList(getAllCachedEntries())} />
          </aside>
        </div>

        <div className="result-section">
          {error && <div className="error">❌ Error: {error}</div>}
          {lastResult && (
            <Result result={lastResult.result} fromCache={lastResult.fromCache} />
          )}
        </div>
      </main>

      <footer>
        <small>Local cache stored in localStorage under <code>pf_ai_cache_v1</code></small>
      </footer>
    </div>
  )
}

export default App
