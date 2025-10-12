import { useEffect, useState } from 'react'
import './App.css'
import AnalysisForm from './components/Form'
import History from './components/History'
import Result from './components/Result'
import LoadingScreen from './components/LoadingScreen'
import Auth from './components/Auth'
import { getAllCachedEntries, clearCache } from './cache'

// Colores por categoría
const CATEGORY_COLORS = {
  'ui-styles': { bg: 'rgba(168, 85, 247, 0.1)', border: 'rgba(168, 85, 247, 0.3)', icon: '🎨' },
  'forms': { bg: 'rgba(34, 197, 94, 0.1)', border: 'rgba(34, 197, 94, 0.3)', icon: '📝' },
  'buttons-actions': { bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.3)', icon: '🔘' },
  'images-resources': { bg: 'rgba(251, 146, 60, 0.1)', border: 'rgba(251, 146, 60, 0.3)', icon: '🖼️' },
  'texts': { bg: 'rgba(236, 72, 153, 0.1)', border: 'rgba(236, 72, 153, 0.3)', icon: '📄' },
  'accessibility': { bg: 'rgba(20, 184, 166, 0.1)', border: 'rgba(20, 184, 166, 0.3)', icon: '♿' }
}

const CATEGORY_LABELS = {
  'ui-styles': 'UI/Estilos',
  'forms': 'Formularios',
  'buttons-actions': 'Botones/Acciones',
  'images-resources': 'Imágenes/Recursos',
  'texts': 'Textos',
  'accessibility': 'Accesibilidad'
}

function App() {
  const [lastResult, setLastResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [cacheList, setCacheList] = useState([])
  const [activeView, setActiveView] = useState('analysis')
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null)

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
    setSelectedHistoryItem(entry)
    // No cambiamos de vista, nos quedamos en history
  }

  function handleClearCache() {
    if (!confirm('Clear all cached requests?')) return
    clearCache()
    setCacheList([])
  }

  return (
    <div className="app-root">
      {loading && <LoadingScreen />}
      
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <h2>
            <span className="logo-icon">🤖</span>
            QA Analysis
          </h2>
        </div>
        
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeView === 'analysis' ? 'active' : ''}`}
            onClick={() => setActiveView('analysis')}
          >
            <span className="nav-icon">💡</span>
            AI Analysis
          </button>
          <button 
            className={`nav-item ${activeView === 'history' ? 'active' : ''}`}
            onClick={() => setActiveView('history')}
          >
            <span className="nav-icon">🕒</span>
            Test History
          </button>
          <button 
            className={`nav-item ${activeView === 'auth' ? 'active' : ''}`}
            onClick={() => setActiveView('auth')}
          >
            <span className="nav-icon">👤</span>
            Account
          </button>
        </nav>
        
        <div className="sidebar-footer">
          <small>Backend: <code>localhost:5288</code></small>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {activeView === 'analysis' ? (
          <>
            <div className="page-header">
              <h1>AI Webpage Analysis</h1>
              <p>Submit a URL and get an AI-powered analysis of your webpage</p>
            </div>

            <div className="dashboard-content">
              <div className="content-section">
                <h3 className="section-title">New Analysis</h3>
                <AnalysisForm onStart={onSubmitStart} onComplete={onSubmitEnd} />
              </div>
            </div>

            <div className="result-section">
              {error && <div className="error">❌ Error: {error}</div>}
              {lastResult && (
                <Result result={lastResult.result} fromCache={lastResult.fromCache} />
              )}
            </div>
          </>
        ) : activeView === 'history' ? (
          <>
            <div className="page-header">
              <h1>Test History</h1>
              <p>View and manage your cached test results</p>
            </div>

            <div className="history-layout">
              <div className="content-section history-list-section">
                <div className="history-header">
                  <h3>Cached Requests ({cacheList.length})</h3>
                  <button className="small" onClick={handleClearCache}>Clear cache</button>
                </div>
                <div className="history-section">
                  <History 
                    list={cacheList} 
                    onView={handleViewCached} 
                    onUpdate={() => setCacheList(getAllCachedEntries())}
                    selectedItem={selectedHistoryItem}
                  />
                </div>
              </div>

              {selectedHistoryItem && (
                <div className="content-section history-detail-section">
                  <div className="detail-header">
                    <h3>Test Details</h3>
                    <button className="small" onClick={() => setSelectedHistoryItem(null)}>✕ Close</button>
                  </div>
                  
                  {/* Contadores por severidad */}
                  {selectedHistoryItem.response?.modificaciones && selectedHistoryItem.response.modificaciones.length > 0 && (
                    <>
                      <h4 className="stats-section-title">📊 Issues by Severity</h4>
                      {(() => {
                    const highCount = selectedHistoryItem.response.modificaciones.filter(m => 
                      (m.severity || m.severidad || '').toLowerCase() === 'high' || 
                      (m.severity || m.severidad || '').toLowerCase() === 'alto'
                    ).length
                    
                    const mediumCount = selectedHistoryItem.response.modificaciones.filter(m => 
                      (m.severity || m.severidad || '').toLowerCase() === 'medium' || 
                      (m.severity || m.severidad || '').toLowerCase() === 'medio'
                    ).length
                    
                    const lowCount = selectedHistoryItem.response.modificaciones.filter(m => 
                      (m.severity || m.severidad || '').toLowerCase() === 'low' || 
                      (m.severity || m.severidad || '').toLowerCase() === 'bajo'
                    ).length
                    
                    return (
                      <div className="severity-stats">
                        <div className="stat-card stat-high">
                          <div className="stat-icon">🔴</div>
                          <div className="stat-content">
                            <div className="stat-label">High</div>
                            <div className="stat-value">{highCount}</div>
                          </div>
                        </div>
                        
                        <div className="stat-card stat-medium">
                          <div className="stat-icon">🟡</div>
                          <div className="stat-content">
                            <div className="stat-label">Medium</div>
                            <div className="stat-value">{mediumCount}</div>
                          </div>
                        </div>
                        
                        <div className="stat-card stat-low">
                          <div className="stat-icon">🟢</div>
                          <div className="stat-content">
                            <div className="stat-label">Low</div>
                            <div className="stat-value">{lowCount}</div>
                          </div>
                        </div>
                      </div>
                    )
                  })()}
                    </>
                  )}
                  
                  {/* Contadores por categoría */}
                  {selectedHistoryItem.response?.modificaciones && selectedHistoryItem.response.modificaciones.length > 0 && (
                    <>
                      <h4 className="stats-section-title">🏷️ Issues by Category</h4>
                      {(() => {
                    // Agrupar modificaciones por categoría
                    const categoryCounts = {}
                    selectedHistoryItem.response.modificaciones.forEach(m => {
                      const category = m.category || 'other'
                      categoryCounts[category] = (categoryCounts[category] || 0) + 1
                    })
                    
                    return (
                      <div className="category-stats">
                        {Object.entries(categoryCounts).map(([category, count]) => {
                          const colors = CATEGORY_COLORS[category] || { 
                            bg: 'rgba(139, 149, 176, 0.1)', 
                            border: 'rgba(139, 149, 176, 0.3)', 
                            icon: '📋' 
                          }
                          const label = CATEGORY_LABELS[category] || category
                          
                          return (
                            <div 
                              key={category} 
                              className="category-stat-card"
                              style={{
                                background: colors.bg,
                                borderColor: colors.border
                              }}
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
        ) : activeView === 'auth' ? (
          <>
            <div className="page-header">
              <h1>Account</h1>
              <p>Manage your account and authentication</p>
            </div>
            
            <Auth />
          </>
        ) : null}
      </main>
    </div>
  )
}

export default App
