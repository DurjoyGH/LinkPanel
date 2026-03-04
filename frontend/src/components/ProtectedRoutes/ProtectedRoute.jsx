import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export default function ProtectedRoute({ adminOnly = false, redirectTo = "/login" }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) return null;

  if (!isAuthenticated) return <Navigate to={redirectTo} replace />;

  if (adminOnly && !isAdmin) return <Navigate to="/" replace />;

  return <Outlet />;
}
