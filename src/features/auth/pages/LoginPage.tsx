import { useEffect, useState } from "react";
import { LoginCard } from "../components/LoginCard";
import { useLogin } from "../hooks/useLogin";
import type { LoginCredentials } from "../types/auth.type";
import { useNavigate } from "react-router-dom";
import {
  clearSessionNotice,
  getSessionNotice,
} from "../../../shared/state/authSession";

export default function LoginPage() {
  const { isLoading, serverError, submitLogin } = useLogin();
  const navigate = useNavigate();
  const [sessionNotice] = useState(() => getSessionNotice());

  useEffect(() => {
    if (sessionNotice) {
      clearSessionNotice();
    }
  }, [sessionNotice]);

  async function handleLogin(formData: LoginCredentials): Promise<void> {
    const result = await submitLogin(formData);
    if (result.ok) {
      navigate("/dashboard");
    }
  }

  return (
    <LoginCard
      onSubmit={handleLogin}
      isLoading={isLoading}
      serverError={sessionNotice || serverError}
    />
  );
}
