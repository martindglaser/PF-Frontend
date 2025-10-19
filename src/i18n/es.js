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
  auth: {
    loginSuccess: '¡Login exitoso!',
    regSuccess: '¡Registro exitoso!',
    loggedOut: 'Sesión cerrada',
    accountTitle: '👤 Cuenta',
    accountSubtitle: 'Has iniciado sesión',
    activeStatus: '✓ Activo',
    authLogin: '🔐 Iniciar sesión',
    authRegister: '📝 Registrarse',
    signInPrompt: 'Inicia sesión para acceder a tu cuenta',
    createAccountPrompt: 'Crea una cuenta nueva para comenzar',
    tabLogin: 'Iniciar',
    tabRegister: 'Registrarse',
    emailLabel: 'Email',
    emailPlaceholder: 'tu@email.com',
    passwordLabel: 'Contraseña',
    passwordPlaceholder: '••••••••',
    confirmPasswordLabel: 'Confirmar contraseña',
    processing: '⏳ Procesando...',
    signInButton: '🔓 Entrar',
    createAccountButton: '✨ Crear cuenta',
    dontHaveAccount: '¿No tienes cuenta? ',
    alreadyHaveAccount: '¿Ya tienes cuenta? ',
    registerHere: 'Regístrate',
    loginHere: 'Inicia sesión',
    logoutButton: '🚪 Cerrar sesión',
    errors: {
      required: 'Email y contraseña son obligatorios',
      passwordsMismatch: 'Las contraseñas no coinciden',
      passwordShort: 'La contraseña debe tener al menos 6 caracteres',
      authFailed: 'Autenticación fallida',
      generic: 'Ocurrió un error'
    }
  }
}

export default es
