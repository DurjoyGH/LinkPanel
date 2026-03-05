import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

// Redirects logged-in users away from guest-only pages (e.g. /login)
export default function GuestRoute() {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) return null;

  if (isAuthenticated) {
    return <Navigate to={isAdmin ? "/admin" : "/links"} replace />;
  }

  return <Outlet />;
}
