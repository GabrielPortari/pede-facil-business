import { LoginCard } from '../components/LoginCard'
import { useLogin } from '../hooks/useLogin'
import type { LoginCredentials } from '../types/auth.type'

export default function LoginPage() {
  const { isLoading, serverError, submitLogin } = useLogin()

  async function handleLogin(formData: LoginCredentials): Promise<void> {
    const result = await submitLogin(formData)

    if (result.ok) {
      // navegar para próxima tela
      // navigate('/home')
    }
  }

  return (
    <LoginCard
      onSubmit={handleLogin}
      isLoading={isLoading}
      serverError={serverError}
    />
  )
}
