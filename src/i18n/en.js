const en = {
  app: {
    title: 'AI Webpage Analysis',
    subtitle: 'Submit a URL and get an AI-powered analysis of your webpage',
    newAnalysis: 'New Analysis',
    cachedRequests: 'Cached Requests',
    clearCache: 'Clear cache',
    account: 'Account',
    testHistory: 'Test History',
    historySubtitle: 'View and manage your cached test results',
    confirmClearCache: 'Clear all cached requests?',
    testDetails: 'Test Details',
    close: 'Close',
    issuesBySeverity: 'Issues by Severity',
    issuesByCategory: 'Issues by Category',
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
  
}

export default en
