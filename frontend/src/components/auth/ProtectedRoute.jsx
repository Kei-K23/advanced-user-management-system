import { Navigate, useLocation } from "react-router";
import { useAuth } from "../../providers/AuthProvider";

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();
  const pathname = location.pathname;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === "MEMBER" && pathname === "/") {
    return <Navigate to="/account" replace />;
  }

  return children;
};
