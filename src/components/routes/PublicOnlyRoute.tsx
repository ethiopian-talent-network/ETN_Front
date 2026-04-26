import { Navigate, useLocation } from "react-router";
import { type ReactNode } from "react";
import { useAuth } from "../../contexts/AuthContext";

interface PublicOnlyRouteProps {
  children: ReactNode;
}

export const PublicOnlyRoute = ({ children }: PublicOnlyRouteProps) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();
  const from = (location.state as any)?.from;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isAuthenticated && user) {
    if (from) return <Navigate to={from} replace />;
    if (user.role === "employer") return <Navigate to="/employer-dashboard" replace />;
    return <Navigate to="/talent-dashboard" replace />;
  }

  return <>{children}</>;
};
