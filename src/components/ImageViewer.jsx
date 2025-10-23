import { useEffect } from 'react'
import { t } from '../i18n'
import '../styles/ImageViewer.css'
import ReactDOM from 'react-dom'

export default function ImageViewer({ imageUrl, title, onClose }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'auto'
    }
  }, [onClose])

  const overlay = (
    <div className="image-viewer-overlay" onClick={onClose}>
      <button className="viewer-close" onClick={onClose} aria-label={t('viewer.close') || 'Close'}>
        ✕
      </button>
      <div className="viewer-content" onClick={(e) => e.stopPropagation()}>
        <div className="viewer-header">
          <h3>{title}</h3>
        </div>
        <div className="viewer-image-container">
          <img src={imageUrl} alt={title} />
        </div>
        <div className="viewer-footer">
          <button onClick={onClose} className="viewer-close-btn">
            {t('viewer.closeEsc')}
          </button>
        </div>
      </div>
    </div>
  )
  return ReactDOM.createPortal(overlay, document.body)
}
