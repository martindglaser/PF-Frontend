import { useState } from 'react'
import { t } from '../i18n/index'

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    // Validaciones básicas
    if (!email || !password) {
      setError(t('auth.errors.required'))
      return
    }

    if (!isLogin && password !== confirmPassword) {
      setError(t('auth.errors.passwordsMismatch'))
      return
    }

    if (password.length < 6) {
      setError(t('auth.errors.passwordShort'))
      return
    }

    setLoading(true)

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register'
      const response = await fetch(`http://localhost:5288${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed')
      }

      // Guardar token en localStorage
      if (data.token) {
        localStorage.setItem('auth_token', data.token)
        localStorage.setItem('user_email', email)
      }

      // Limpiar formulario
      setEmail('')
      setPassword('')
      setConfirmPassword('')
      
      alert(isLogin ? t('auth.loginSuccess') : t('auth.regSuccess'))
    } catch (err) {
      // Prefer server-provided message when available, otherwise localized generic
      setError(err.message || t('auth.errors.generic'))
    } finally {
      setLoading(false)
    }
  }

  function handleLogout() {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_email')
    setEmail('')
    setPassword('')
    setConfirmPassword('')
    alert(t('auth.loggedOut'))
  }

  const isLoggedIn = !!localStorage.getItem('auth_token')
  const userEmail = localStorage.getItem('user_email')

  if (isLoggedIn) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h2>{t('auth.accountTitle')}</h2>
            <p className="auth-subtitle">{t('auth.accountSubtitle')}</p>
          </div>

          <div className="user-info">
            <div className="user-avatar">
              {userEmail?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="user-details">
              <p className="user-email">{userEmail}</p>
              <span className="user-status">{t('auth.activeStatus')}</span>
            </div>
          </div>

          <button 
            onClick={handleLogout}
            className="auth-button logout-button"
          >
            {t('auth.logoutButton')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>{isLogin ? t('auth.authLogin') : t('auth.authRegister')}</h2>
          <p className="auth-subtitle">
            {isLogin 
              ? t('auth.signInPrompt') 
              : t('auth.createAccountPrompt')}
          </p>
        </div>

        <div className="auth-tabs">
          <button 
            className={`auth-tab ${isLogin ? 'active' : ''}`}
            onClick={() => {
              setIsLogin(true)
              setError('')
              setConfirmPassword('')
            }}
          >
            {t('auth.tabLogin')}
          </button>
          <button 
            className={`auth-tab ${!isLogin ? 'active' : ''}`}
            onClick={() => {
              setIsLogin(false)
              setError('')
            }}
          >
            {t('auth.tabRegister')}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="auth-error">
              ⚠️ {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">{t('auth.emailLabel')}</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('auth.emailPlaceholder')}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">{t('auth.passwordLabel')}</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('auth.passwordPlaceholder')}
              required
              autoComplete={isLogin ? 'current-password' : 'new-password'}
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label htmlFor="confirmPassword">{t('auth.confirmPasswordLabel')}</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t('auth.passwordPlaceholder')}
                required
                autoComplete="new-password"
              />
            </div>
          )}

          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? t('auth.processing') : (isLogin ? t('auth.signInButton') : t('auth.createAccountButton'))}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {isLogin ? t('auth.dontHaveAccount') : t('auth.alreadyHaveAccount')}
            <button 
              className="auth-link"
              onClick={() => {
                setIsLogin(!isLogin)
                setError('')
                setConfirmPassword('')
              }}
            >
              {isLogin ? t('auth.registerHere') : t('auth.loginHere')}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
