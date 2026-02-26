import { useState } from 'react'
import type { FormEvent } from 'react'
import type { LoginCredentials } from '../types/auth.type'

interface LoginCardProps {
  onSubmit: (credentials: LoginCredentials) => void | Promise<void>
  isLoading?: boolean
  serverError?: string
}

interface LoginTouchedState {
  email: boolean
  password: boolean
}

export function LoginCard({
  onSubmit,
  isLoading = false,
  serverError = '',
}: LoginCardProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [touched, setTouched] = useState<LoginTouchedState>({
    email: false,
    password: false,
  })

  const emailError =
    touched.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      ? 'Informe um e-mail válido.'
      : ''

  const passwordError =
    touched.password && password.length < 6
      ? 'A senha deve ter pelo menos 6 caracteres.'
      : ''

  const hasErrors = Boolean(emailError || passwordError)

  function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setTouched({ email: true, password: true })

    if (hasErrors || !email || !password || isLoading) {
      return
    }

    onSubmit({ email: email.trim(), password })
  }

  return (
    <main className="login-page">
      <section className="login-section">
        <h1 id="login-title">Entrar</h1>
        <p>Acesse sua conta para continuar</p>
        <form className="login-form" onSubmit={handleLogin} noValidate>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
              aria-invalid={Boolean(emailError)}
              aria-describedby={emailError ? 'email-error' : undefined}
              required
            />
            {emailError && (
              <small id="email-error" role="alert">
                {emailError}
              </small>
            )}
          </div>

          <div className="field">
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              onBlur={() =>
                setTouched((prev) => ({ ...prev, password: true }))
              }
              aria-invalid={Boolean(passwordError)}
              aria-describedby={passwordError ? 'password-error' : undefined}
              required
            />
            {passwordError && (
              <small id="password-error" role="alert">
                {passwordError}
              </small>
            )}
          </div>

          {serverError && (
            <p role="alert" className="form-error">
              {serverError}
            </p>
          )}

          <button type="submit" disabled={isLoading || hasErrors}>
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </section>
    </main>
  )
}
