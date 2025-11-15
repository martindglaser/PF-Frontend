const en = {
  app: {
    title: 'AI Webpage Analysis',
    subtitle: 'Submit a URL and get an AI-powered analysis of your webpage',
    newAnalysis: 'New Analysis',
    cachedRequests: 'Cached Requests',
    clearCache: 'Clear cache',
    account: 'Account',
    testHistory: 'Test History',
    historySubtitle: 'View and manage your test results',
    confirmClearCache: 'Clear all cached requests?',
    testDetails: 'Test Details',
    close: 'Close',
    fromDateLabel: 'From:',
    toDateLabel: 'To:',
    issuesBySeverity: 'Issues by Severity',
    issuesByCategory: 'Issues by Category',
    cachedRequestsCount: (n) => `Cached Requests (${n})`,
    severity: {
      high: 'High',
      critical: 'Critical',
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
      'AI is analyzing every pixel of your webpage...',
      'Scanning for broken links and accessibility issues...',
      'Generating insights from visual elements...',
      'Checking mobile responsiveness patterns...',
      'Evaluating user experience metrics...',
      'Deep diving into page structure...',
      'Analyzing design consistency...',
      'Computing comprehensive analysis...'
    ],
    percent: (p) => `${Math.round(p)}%`,
    closeHint: 'Close (ESC)'
  },
  viewer: {
    close: 'Close',
    closeEsc: 'Close (ESC)'
  },
  result: {
    toleranceLabel: 'Tolerance',
    languageLabel: 'Language',
    liveLabel: 'Live',
    whatAISeesTitle: 'What the AI sees',
    modificationsNeeded: 'Modifications needed',
    noModificationsNeeded: 'No modifications needed',
    successMessage: 'Great! Your page looks good. No critical issues detected.',
    issuesFound: 'Issues found',
    issueCount: (n) => `${n} issue${n !== 1 ? 's' : ''}`,
    selectorLabel: 'Selector',
    screenshots: 'Screenshots',
    screenshotUnavailable: 'Screenshot not available'
    ,
    screenshot: {
      desktop: 'Desktop view',
      mobile: 'Mobile view'
    }
    ,
    state: {
      confirmed: 'Confirmed'
    }
  },
  form: {
    urlLabel: 'URL',
    urlPlaceholder: 'https://example.com',
    toleranceLabel: 'Tolerance',
    tolerance: { low: 'low', medium: 'medium', high: 'high' },
    languageLabel: 'Language',
  analysisNameLabel: 'Analysis name',
  analysisNamePlaceholder: 'Descriptive name for this analysis',
  userNameLabel: 'User name',
  userNamePlaceholder: 'Name of the user running the analysis',
    categoriesLabel: 'Categories',
    categoriesSelected: (n) => `${n} selected`,
    selectCategoriesHint: 'Select categories to analyze',
    categories: {
      ui: 'UI/styles',
      forms: 'Forms',
      links: 'Links',
      images: 'Images/Resources',
      texts: 'Texts',
      responsiveness: 'Responsiveness'
    }
    ,
    runButton: 'Run analysis'
    ,analysisNameRequired: 'Analysis name is required',
    userNameRequired: 'User name is required'
    ,urlRequired: 'URL is required'
  },
  sidebar: {
    backendLabel: 'Backend'
  },
  history: {
    empty: 'No analysis executed',
    loading: 'Loading analyses...',
    view: 'View',
    refresh: 'Refresh',
    delete: 'Delete',
    confirmDelete: 'Delete this test?'
    ,
    analysisTitle: 'Title',
    userLabel: 'User',
    fetchError: 'Could not load history. Please try again later.',
    deleteError: 'Could not delete the entry. Please try again later.'
  },
  
}

export default en
