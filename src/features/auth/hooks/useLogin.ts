import { useState } from "react";
import { loginRequest } from "../services/authService";
import type { LoginCredentials, SubmitLoginResult } from "../types/auth.type";
import { ServiceRequestError } from "../../../shared/lib/serviceRequest";
import {
  fetchAuthenticatedBusiness,
  getAccessTokenFromNestedAuthPayload,
  getBusinessIdFromAuthPayload,
  refreshAccessToken,
  setAuthSession,
} from "../../../shared/state/authSession";

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  async function submitLogin(
    credentials: LoginCredentials,
  ): Promise<SubmitLoginResult> {
    try {
      setIsLoading(true);
      setServerError("");

      const result = await loginRequest(credentials);
      const accessTokenFromResponse =
        getAccessTokenFromNestedAuthPayload(result);
      const accessToken =
        accessTokenFromResponse ?? (await refreshAccessToken(true));
      const businessId = getBusinessIdFromAuthPayload(result, accessToken);

      setAuthSession({
        accessToken,
        businessId,
      });

      try {
        await fetchAuthenticatedBusiness();
      } catch {
        // Keep login successful even if business/me fails; navbar can use placeholder.
      }

      return { ok: true, data: result };
    } catch (error) {
      console.error("[useLogin] Login failed", {
        email: credentials.email,
        error,
      });

      if (error instanceof ServiceRequestError) {
        setServerError(error.message);
      } else {
        setServerError("Não foi possível entrar. Verifique seus dados.");
      }

      return { ok: false };
    } finally {
      setIsLoading(false);
    }
  }

  return { isLoading, serverError, submitLogin };
}
