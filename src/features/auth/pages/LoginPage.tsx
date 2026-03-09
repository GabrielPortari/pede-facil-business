import { LoginCard } from "../components/LoginCard";
import { useLogin } from "../hooks/useLogin";
import type { LoginCredentials } from "../types/auth.type";
import { useNavigate } from "react-router-dom";
import { setStoredAccessToken } from "../../../shared/state/authSession";

export default function LoginPage() {
  const { isLoading, serverError, submitLogin } = useLogin();
  const navigate = useNavigate();

  async function handleLogin(formData: LoginCredentials): Promise<void> {
    const result = await submitLogin(formData);
    if (result.ok) {
      navigate("/dashboard");
    }
  }

  function skipLogin() {
    setStoredAccessToken("fake-token");
    navigate("/dashboard");
  }

  return (
    <LoginCard
      onSubmit={handleLogin}
      isLoading={isLoading}
      serverError={serverError}
    />
  );
}
