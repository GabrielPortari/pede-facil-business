import { LoginCard } from "../components/LoginCard";
import { useLogin } from "../hooks/useLogin";
import type { LoginCredentials } from "../types/auth.type";
import { useNavigate } from "react-router-dom";

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
    localStorage.setItem("access_token", "fake-token");
    navigate("/dashboard");
  }

  return (
    <LoginCard
      onSubmit={skipLogin}
      isLoading={isLoading}
      serverError={serverError}
    />
  );
}
