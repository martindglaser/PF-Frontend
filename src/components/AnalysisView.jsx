import React, { useEffect, useRef } from 'react'
import { t } from '../i18n'
import AnalysisForm from './Form'
import Result from './Result'
import '../styles/analysisview.css'

export default function AnalysisView({ onSubmitStart, onSubmitEnd, lastResult, error }) {
  const resultRef = useRef(null)

  useEffect(() => {
    if (lastResult && resultRef.current) {
      try {
        resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
        resultRef.current.focus({ preventScroll: true })
      } catch {
        // ignore
      }
    }
  }, [lastResult])
  return (
    <>
      <div className="page-header">
        <h1>{t('app.title')}</h1>
        <p>{t('app.subtitle')}</p>
      </div>

      <div className="dashboard-content">
        <div className="content-section panel-centered wide">
          <h3 className="section-title">{t('app.newAnalysis')}</h3>
          <AnalysisForm onStart={onSubmitStart} onComplete={onSubmitEnd} />
        </div>
      </div>

      <div className="result-section">
        {error && <div className="error">❌ Error: {error}</div>}
        {lastResult && (
          <div ref={resultRef} tabIndex={-1} className="panel-width centered wide" aria-live="polite">
            <Result result={lastResult.result} fromCache={lastResult.fromCache} />
          </div>
        )}
      </div>
    </>
  )
}
