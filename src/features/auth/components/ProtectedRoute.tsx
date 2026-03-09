import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { getStoredAccessToken } from "../../../shared/state/authSession";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = getStoredAccessToken();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
