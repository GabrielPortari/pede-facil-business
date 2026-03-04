import { useState } from "react";
import { forgotPasswordRequest } from "../services/authService";
import type {
  ForgotPasswordPayload,
  SubmitForgotPasswordResult,
} from "../types/auth.type";

export function useForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  async function submitForgotPassword(
    payload: ForgotPasswordPayload,
  ): Promise<SubmitForgotPasswordResult> {
    try {
      setIsLoading(true);
      setServerError("");

      const result = await forgotPasswordRequest(payload);

      return { ok: true, data: result };
    } catch {
      setServerError(
        "Não foi possível solicitar a redefinição de senha. Tente novamente.",
      );
      return { ok: false };
    } finally {
      setIsLoading(false);
    }
  }

  return { isLoading, serverError, submitForgotPassword };
}
