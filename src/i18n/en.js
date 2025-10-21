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
    cachedRequestsCount: (n) => `Cached Requests (${n})`,
    severity: {
      high: 'High',
      medium: 'Medium',
      low: 'Low'
    },
    categoryLabels: {
      ui: 'UI',
      forms: 'Forms',
      other: 'Other'
    }
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
  result: {
    urlBadge: '🌐 URL',
    toleranceLabel: 'Tolerance',
    languageLabel: 'Language',
    cachedLabel: '💾 Cached',
    liveLabel: '✨ Live',
    timestampPrefix: '🕐',
    whatAISeesTitle: '🤖 What the AI sees',
    modificationsNeeded: '⚠️ Modifications needed',
    noModificationsNeeded: '✅ No modifications needed',
    successMessage: 'Great! Your page looks good. No critical issues detected.',
    issuesFound: '🔧 Issues found',
    issueCount: (n) => `${n} issue${n !== 1 ? 's' : ''}`,
    selectorLabel: 'Selector',
    viewRawJson: '📄 View raw JSON',
    screenshots: '📸 Screenshots',
    screenshotUnavailable: 'Screenshot not available'
    ,
    screenshot: {
      desktop: 'Desktop view',
      mobile: 'Mobile view'
    }
  },
  form: {
    urlLabel: 'URL',
    urlPlaceholder: 'https://example.com',
    toleranceLabel: 'Tolerance',
    tolerance: { low: 'low', medium: 'medium', high: 'high' },
    languageLabel: 'Language',
    categoriesLabel: 'Categories',
    categoriesSelected: (n) => `${n} selected`,
    selectCategoriesHint: 'Select categories to analyze',
    categories: {
      ui: 'UI/styles',
      forms: 'Forms',
      buttons: 'Buttons/Actions',
      images: 'Images/Resources',
      texts: 'Texts',
      accessibility: 'Accessibility'
    }
  },
  sidebar: {
    backendLabel: 'Backend'
  },
  history: {
    empty: 'No cached requests yet',
    view: 'View',
    refresh: 'Refresh',
    delete: 'Delete',
    confirmDelete: 'Delete this test?'
    ,
    fetchError: 'Could not load history. Please try again later.',
    deleteError: 'Could not delete the entry. Please try again later.'
  },
  
}

export default en
