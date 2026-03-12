import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { ProtectedRoute } from "./features/auth/components/ProtectedRoute";
import ForgotPasswordPage from "./features/auth/pages/ForgotPasswordPage";
import LoginPage from "./features/auth/pages/LoginPage";
import RegisterPage from "./features/auth/pages/RegisterPage";
import DashboardPage from "./features/dashboard/pages/DashboardPage";
import HomePage from "./features/home/pages/HomePage";
import LandingPage from "./features/public/pages/LandingPage";
import GlobalNav from "./shared/ui/GlobalNav";
import "./App.css";

function App() {
  const location = useLocation();
  const isLandingPage = location.pathname === "/";

  return (
    <>
      <GlobalNav />

      <div
        className={`app-route-content${isLandingPage ? " app-route-content-landing" : ""}`}
      >
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/perfil"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route path="/home" element={<Navigate to="/perfil" replace />} />
          <Route path="/esqueci-minha-senha" element={<ForgotPasswordPage />} />
          <Route path="/registre-se" element={<RegisterPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
