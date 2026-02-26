import { useState } from 'react'
import { loginRequest } from '../services/authService'
import type { LoginCredentials, SubmitLoginResult } from '../types/auth.type'

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState('')

  async function submitLogin(
    credentials: LoginCredentials,
  ): Promise<SubmitLoginResult> {
    try {
      setIsLoading(true)
      setServerError('')

      const result = await loginRequest(credentials)

      localStorage.setItem('access_token', result.accessToken)

      return { ok: true, data: result }
    } catch {
      setServerError('Não foi possível entrar. Verifique seus dados.')
      return { ok: false }
    } finally {
      setIsLoading(false)
    }
  }

  return { isLoading, serverError, submitLogin }
}
