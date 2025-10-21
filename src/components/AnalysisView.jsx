import React from 'react'
import { t } from '../i18n'
import AnalysisForm from './Form'
import Result from './Result'
import '../styles/analysisview.css'

export default function AnalysisView({ onSubmitStart, onSubmitEnd, lastResult, error }) {
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
          <div className="panel-width centered wide">
            <Result result={lastResult.result} fromCache={lastResult.fromCache} />
          </div>
        )}
      </div>
    </>
  )
}
