import { useEffect, useState } from 'react'
import { t } from '../i18n'
import '../styles/LoadingScreen.css'

const funFacts = [
  t('loading.facts.0'),
  t('loading.facts.1'),
  t('loading.facts.2'),
  t('loading.facts.3'),
  t('loading.facts.4'),
  t('loading.facts.5'),
  t('loading.facts.6'),
  t('loading.facts.7'),
  t('loading.facts.8'),
  t('loading.facts.9')
]

export default function LoadingScreen() {
  const [factIndex, setFactIndex] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Rotate facts every 2.5 seconds
    const factInterval = setInterval(() => {
      setFactIndex(prev => (prev + 1) % funFacts.length)
    }, 2500)

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) return prev
        return prev + Math.random() * 3
      })
    }, 300)

    return () => {
      clearInterval(factInterval)
      clearInterval(progressInterval)
    }
  }, [])

  return (
    <div className="loading-screen">
      <div className="loading-content">
        {/* Animated circles */}
        <div className="loading-circles">
          <div className="circle circle-1"></div>
          <div className="circle circle-2"></div>
          <div className="circle circle-3"></div>
          <div className="circle circle-4"></div>
        </div>

        {/* AI Brain animation */}
        <div className="ai-brain">
          <div className="brain-pulse"></div>
          <svg viewBox="0 0 100 100" className="brain-svg">
            <circle cx="50" cy="50" r="40" className="brain-circle" />
            <circle cx="35" cy="40" r="8" className="brain-dot" />
            <circle cx="65" cy="40" r="8" className="brain-dot" />
            <circle cx="50" cy="60" r="8" className="brain-dot" />
            <line x1="35" y1="40" x2="65" y2="40" className="brain-line" />
            <line x1="35" y1="40" x2="50" y2="60" className="brain-line" />
            <line x1="65" y1="40" x2="50" y2="60" className="brain-line" />
          </svg>
        </div>

        {/* Status text */}
        <h2 className="loading-title">{t('loading.title')}</h2>
        
        {/* Fun facts carousel */}
        <div className="fun-facts">
          <p className="fact" key={factIndex}>
            {funFacts[factIndex]}
          </p>
        </div>

        {/* Progress bar */}
        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="progress-text">{t('loading.percent')(Math.round(progress))}</span>
        </div>

        {/* Animated dots */}
        <div className="loading-dots">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
      </div>

      {/* Background particles */}
      <div className="particles">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i} 
            className="particle" 
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          ></div>
        ))}
      </div>
    </div>
  )
}
