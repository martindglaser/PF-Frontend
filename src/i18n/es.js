const es = {
  nav: {
    dashboard: 'Dashboard',
    history: 'Historial',
    reports: 'Reports',
    analysis: 'AI Analysis',
  },
  brand: {
    title: 'QA Dashboard',
    footer: 'Proyecto colaborativo',
  },
  topbar: {
    searchPlaceholder: 'Search tests, URLs, or findings…',
    user: 'TU',
  },
  dashboard: {
    title: 'QA Testing Dashboard',
    totalTests: 'Total Tests',
    successRate: 'Success Rate',
    criticalIssues: 'Critical Issues',
    avgExecution: 'Avg. Execution',
    recentTitle: 'Recent Test Executions',
    noExecutions: 'Aún no hay ejecuciones.',
    configTitle: 'Test Configuration',
    websiteUrl: 'Website URL',
    tolerance: 'Tolerance',
    toleranceHigh: 'Alta',
    toleranceMedium: 'Media',
    toleranceLow: 'Baja',
    language: 'Language',
    lang_es: 'Español',
    lang_en: 'English',
    lang_it: 'Italiano',
    runButton: 'Run Test',
    running: 'Running…',
  },
  history: {
    title: 'Test History',
    noTests: 'No hay tests registrados.',
    headers: {
      url: 'URL',
      status: 'Estado',
      findings: 'Hallazgos',
      criticality: 'Criticidad',
      date: 'Fecha',
      duration: 'Duración',
      action: 'Acción',
    },
  },
  reports: {
    title: 'Reports',
    exportHint: 'Exportá el historial en CSV para compartir con el equipo.',
    exportButton: 'Export CSV',
  },
  analysis: {
    title: 'AI Analysis',
    empty: 'Ejecutá un test desde el Dashboard para ver resultados.',
    modifications: 'Modificaciones sugeridas',
    raw: 'Ver JSON crudo',
    noFindings: 'Sin hallazgos.',
  },
  // settings: removed — component deleted
  form: {
    urlError: 'Ingresá una URL con http(s)://',
  }
  ,
  common: {
    view: 'Ver'
  }
};

export default es;