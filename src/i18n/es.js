const es = {
    app: {
    title: 'Análisis de páginas web con IA',
    subtitle: 'Envía una URL y obtén un análisis de tu página web con IA',
    newAnalysis: 'Nuevo análisis',
    cachedRequests: 'Solicitudes en caché',
    clearCache: 'Limpiar caché',
    account: 'Cuenta',
    testHistory: 'Historial de pruebas',
    cachedRequestsCount: (n) => `Solicitudes en caché (${n})`
    },
  loading: {
    title: 'Analizando tu página',
    facts: [
      '🤖 El AI está analizando cada píxel de tu página...',
      '🔍 Buscando enlaces rotos y problemas de accesibilidad...',
      '✨ Generando insights de elementos visuales...',
      '🎯 Verificando patrones de responsividad móvil...',
      '🌐 Evaluando métricas de experiencia de usuario...',
      '🔬 Profundizando en la estructura de la página...',
      '🎨 Analizando consistencia de diseño...',
      '⚡ Ejecutando diagnósticos de performance...',
      '🛡️ Verificando prácticas de seguridad...',
      '📊 Calculando análisis comprensivo...'
    ],
    percent: (p) => `${Math.round(p)}%`,
    closeHint: 'Close (ESC)'
  },
  viewer: {
    close: 'Cerrar',
    closeEsc: 'Cerrar (ESC)'
  },
  
}

export default es
