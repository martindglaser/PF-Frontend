import { useEffect } from 'react'
import '../styles/ImageViewer.css'

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

  return (
    <div className="image-viewer-overlay" onClick={onClose}>
      <button className="viewer-close" onClick={onClose} aria-label="Close">
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
            Close (ESC)
          </button>
        </div>
      </div>
    </div>
  )
}
