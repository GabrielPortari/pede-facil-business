import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import {
  getStoredAccessToken,
  isAuthenticatedSession,
  setSessionExpiredNotice,
} from "../../../shared/state/authSession";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = getStoredAccessToken();
  const hasAuthenticatedSession = isAuthenticatedSession();

  if (!token) {
    if (!hasAuthenticatedSession) {
      setSessionExpiredNotice();
      return <Navigate to="/login" replace />;
    }

    // Authenticated session without a token: likely in initialization/refresh state.
    // Avoid redirecting or showing an expired notice; render a placeholder instead.
    return null;
  }

  return children;
}
