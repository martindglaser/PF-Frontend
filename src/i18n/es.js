const es = {
    app: {
    title: 'Análisis de páginas web con IA',
    subtitle: 'Envía una URL y obtén un análisis de tu página web con IA',
    newAnalysis: 'Nuevo análisis',
    cachedRequests: 'Solicitudes en caché',
    clearCache: 'Limpiar caché',
    account: 'Cuenta',
    testHistory: 'Historial de pruebas',
  historySubtitle: 'Ver y gestionar tus resultados',
  confirmClearCache: '¿Limpiar todas las solicitudes en caché?',
  testDetails: 'Detalles de la prueba',
  close: 'Cerrar',
  filterLabel: 'Filtrar:',
  filterPlaceholder: 'Título, Usuario o URL',
  issuesBySeverity: 'Problemas por severidad',
  issuesByCategory: 'Problemas por categoría',
    cachedRequestsCount: (n) => `Solicitudes en caché (${n})`,
    severity: {
      high: 'Alto',
      critical: 'Crítico',
      medium: 'Medio',
      low: 'Bajo'
    },
    categoryLabels: {
      ui: 'Interfaz',
      forms: 'Formularios',
      other: 'Otro'
    }
    ,
    serverError: 'Ocurrió un error en el servidor. Intente nuevamente más tarde.'
    },
  loading: {
    title: 'Analizando tu página',
    facts: [
      'La AI está analizando cada píxel de tu página...',
      'Buscando enlaces rotos y problemas de accesibilidad...',
      'Generando insights de elementos visuales...',
      'Verificando patrones de responsividad móvil...',
      'Evaluando métricas de experiencia de usuario...',
      'Profundizando en la estructura de la página...',
      'Analizando consistencia de diseño...',
      'Calculando análisis comprensivo...'
    ],
    percent: (p) => `${Math.round(p)}%`,
    closeHint: 'Close (ESC)'
  },
  viewer: {
    close: 'Cerrar',
    closeEsc: 'Cerrar (ESC)'
  },
  result: {
    toleranceLabel: 'Tolerancia',
    languageLabel: 'Idioma',
    liveLabel: 'En vivo',
    whatAISeesTitle: 'Lo que la IA ve',
    modificationsNeeded: 'Se necesitan modificaciones',
    noModificationsNeeded: 'No se necesitan modificaciones',
    successMessage: '¡Genial! Tu página se ve bien. No se detectaron problemas críticos.',
    issuesFound: 'Problemas encontrados',
    issueCount: (n) => `${n} problema${n !== 1 ? 's' : ''}`,
    selectorLabel: 'Selector',
    screenshots: 'Capturas',
    screenshotUnavailable: 'Captura no disponible',
    screenshot: {
      desktop: 'Vista de escritorio',
      mobile: 'Vista móvil'
    }
    ,
    state: {
      confirmed: 'Confirmado'
    }
  },
  form: {
    urlLabel: 'URL',
    urlPlaceholder: 'https://example.com',
    toleranceLabel: 'Tolerancia',
    tolerance: { low: 'Bajo', medium: 'Medio', high: 'Alto' },
    languageLabel: 'Idioma',
  analysisNameLabel: 'Nombre del análisis',
  analysisNamePlaceholder: 'Nombre descriptivo para este análisis',
  userNameLabel: 'Nombre del usuario',
  userNamePlaceholder: 'Nombre de quien ejecuta el análisis',
    categoriesLabel: 'Categorías',
    categoriesSelected: (n) => `${n} seleccionada${n !== 1 ? 's' : ''}`,
    selectCategoriesHint: 'Selecciona las categorías a analizar',
    categories: {
      ui: 'UI/estilos',
      forms: 'Formularios',
      links: 'Links',
      images: 'Imágenes/Recursos',
      texts: 'Textos',
      responsiveness: 'Responsividad'
    }
    ,
    runButton: 'Ejecutar análisis'
    ,analysisNameRequired: 'El nombre del análisis es obligatorio',
    userNameRequired: 'El nombre del usuario es obligatorio'
    ,urlRequired: 'El URL es obligatorio'
  },
  sidebar: {
    backendLabel: 'Backend'
  },
  history: {
    empty: 'No hay análisis ejecutados',
    loading: 'Cargando análisis...',
    view: 'Ver',
    refresh: 'Actualizar',
    delete: 'Eliminar',
    confirmDelete: '¿Eliminar esta prueba?'
    ,
    analysisTitle: 'Título',
    userLabel: 'Usuario',
    fetchError: 'No se pudieron cargar los registros. Intente más tarde.',
    deleteError: 'No se pudo eliminar la entrada. Intente más tarde.'
  },
  
}

export default es
