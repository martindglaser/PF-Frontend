import React from 'react'
import { t } from '../i18n'
import '../styles/trafficLight.css'

export default function TrafficLight({ light }) {
  const aria = (typeof t === 'function') ? t('result.trafficLight') : `Traffic light: ${light}`

  return (
    <div
      className="traffic-light"
      role="img"
      aria-label={aria || `Traffic light: ${light}`}
    >
      <span className={`bulb red ${light === 'red' ? 'active' : ''}`} />
      <span className={`bulb yellow ${light === 'yellow' ? 'active' : ''}`} />
      <span className={`bulb green ${light === 'green' ? 'active' : ''}`} />
    </div>
  )
}
