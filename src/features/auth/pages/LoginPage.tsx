import { LoginCard } from "../components/LoginCard";
import { useLogin } from "../hooks/useLogin";
import type { LoginCredentials } from "../types/auth.type";
import { useNavigate } from "react-router-dom";
import { setAuthSession } from "../../../shared/state/authSession";

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
    setAuthSession({ accessToken: "fake-token", businessId: "dev-business" });
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
