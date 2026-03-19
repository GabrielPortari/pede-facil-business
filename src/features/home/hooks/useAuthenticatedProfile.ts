import { useEffect, useState } from "react";
import type { AuthMeProfile } from "../../auth/types/auth.type";
import { getAuthenticatedBusinessProfile } from "../../auth/services/authService";

interface UseAuthenticatedProfileResult {
  profile: AuthMeProfile | null;
  isLoading: boolean;
  errorMessage: string;
  reloadProfile: () => Promise<void>;
}

export function useAuthenticatedProfile(): UseAuthenticatedProfileResult {
  const [profile, setProfile] = useState<AuthMeProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  async function reloadProfile(): Promise<void> {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const nextProfile = await getAuthenticatedBusinessProfile();
      console.info(
        "[useAuthenticatedProfile] business/me response",
        nextProfile.raw,
      );
      setProfile(nextProfile);
    } catch (error) {
      console.error("[useAuthenticatedProfile] Failed to load business/me", {
        error,
      });

      setErrorMessage("Não foi possível carregar os dados do perfil.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void reloadProfile();
  }, []);

  return {
    profile,
    isLoading,
    errorMessage,
    reloadProfile,
  };
}
