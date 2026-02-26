import type { LoginCredentials, LoginResponse } from '../types/auth.type'

export async function loginRequest({
  email,
  password,
}: LoginCredentials): Promise<LoginResponse> {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  if (!response.ok) {
    throw new Error('Login failed')
  }

  return response.json() as Promise<LoginResponse>
}
