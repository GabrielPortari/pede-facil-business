import { useState } from "react";
import { signupBusinessRequest } from "../services/authService";
import type {
  SignupBusinessPayload,
  SubmitSignupBusinessResult,
} from "../types/auth.type";

export function useSignupBusiness() {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  async function submitSignup(
    payload: SignupBusinessPayload,
  ): Promise<SubmitSignupBusinessResult> {
    try {
      setIsLoading(true);
      setServerError("");

      const result = await signupBusinessRequest(payload);

      return { ok: true, data: result };
    } catch {
      setServerError("Não foi possível concluir o cadastro da empresa.");
      return { ok: false };
    } finally {
      setIsLoading(false);
    }
  }

  return { isLoading, serverError, submitSignup };
}
