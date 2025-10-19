const en = {
  app: {
    title: 'AI Webpage Analysis',
    subtitle: 'Submit a URL and get an AI-powered analysis of your webpage',
    newAnalysis: 'New Analysis',
    cachedRequests: 'Cached Requests',
    clearCache: 'Clear cache',
    account: 'Account',
    testHistory: 'Test History',
    cachedRequestsCount: (n) => `Cached Requests (${n})`
  },
  loading: {
    title: 'Analyzing your webpage',
    facts: [
      '🤖 AI is analyzing every pixel of your webpage...',
      '🔍 Scanning for broken links and accessibility issues...',
      '✨ Generating insights from visual elements...',
      '🎯 Checking mobile responsiveness patterns...',
      '🌐 Evaluating user experience metrics...',
      '🔬 Deep diving into page structure...',
      '🎨 Analyzing design consistency...',
      '⚡ Running performance diagnostics...',
      '🛡️ Checking security best practices...',
      '📊 Computing comprehensive analysis...'
    ],
    percent: (p) => `${Math.round(p)}%`,
    closeHint: 'Close (ESC)'
  },
  viewer: {
    close: 'Close',
    closeEsc: 'Close (ESC)'
  },
  auth: {
    loginSuccess: 'Login successful!',
    regSuccess: 'Registration successful!',
    loggedOut: 'Logged out successfully',
    accountTitle: '👤 Account',
    accountSubtitle: 'You are logged in',
    activeStatus: '✓ Active',
    authLogin: '🔐 Login',
    authRegister: '📝 Register',
    signInPrompt: 'Sign in to access your account',
    createAccountPrompt: 'Create a new account to get started',
    tabLogin: 'Login',
    tabRegister: 'Register',
    emailLabel: 'Email',
    emailPlaceholder: 'your@email.com',
    passwordLabel: 'Password',
    passwordPlaceholder: '••••••••',
    confirmPasswordLabel: 'Confirm Password',
    processing: '⏳ Processing...',
    signInButton: '🔓 Sign In',
    createAccountButton: '✨ Create Account',
    dontHaveAccount: "Don't have an account? ",
    alreadyHaveAccount: 'Already have an account? ',
    registerHere: 'Register here',
    loginHere: 'Login here',
    logoutButton: '🚪 Logout',
    errors: {
      required: 'Email and password are required',
      passwordsMismatch: 'Passwords do not match',
      passwordShort: 'Password must be at least 6 characters',
      authFailed: 'Authentication failed',
      generic: 'An error occurred'
    }
  }
}

export default en
