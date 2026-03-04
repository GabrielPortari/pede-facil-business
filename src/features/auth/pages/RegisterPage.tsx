import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RegisterBusinessCard } from "../components/index";
import { useSignupBusiness } from "../hooks/useSignupBusiness";
import type { SignupBusinessPayload } from "../types/auth.type";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { isLoading, serverError, submitSignup } = useSignupBusiness();
  const [successMessage, setSuccessMessage] = useState("");

  async function handleRegister(payload: SignupBusinessPayload): Promise<void> {
    const result = await submitSignup(payload);

    if (result.ok) {
      setSuccessMessage("Cadastro realizado com sucesso! Redirecionando...");
      window.setTimeout(() => {
        navigate("/login");
      }, 900);
    }
  }

  return (
    <RegisterBusinessCard
      onSubmit={handleRegister}
      isLoading={isLoading}
      serverError={serverError}
      successMessage={successMessage}
    />
  );
}
