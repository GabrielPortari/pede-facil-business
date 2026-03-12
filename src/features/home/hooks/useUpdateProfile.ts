import { useState } from "react";
import type { UpdateBusinessPayload } from "../../auth/types/auth.type";
import { updateBusinessProfile } from "../../auth/services/authService";
import { ServiceRequestError } from "../../../shared/lib/serviceRequest";

interface UseUpdateProfileResult {
  isSubmitting: boolean;
  serverError: string;
  submitUpdate: (payload: UpdateBusinessPayload) => Promise<boolean>;
}

export function useUpdateProfile(): UseUpdateProfileResult {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  async function submitUpdate(
    payload: UpdateBusinessPayload,
  ): Promise<boolean> {
    try {
      setIsSubmitting(true);
      setServerError("");

      await updateBusinessProfile(payload);

      return true;
    } catch (error) {
      console.error("[useUpdateProfile] Failed to update business profile", {
        error,
      });

      if (error instanceof ServiceRequestError) {
        setServerError(error.message);
      } else {
        setServerError(
          "Não foi possível salvar as alterações. Tente novamente.",
        );
      }

      return false;
    } finally {
      setIsSubmitting(false);
    }
  }

  return { isSubmitting, serverError, submitUpdate };
}
