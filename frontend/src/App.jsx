import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import PublicLayout from "./components/Layouts/PublicLayout";
import AdminLayout from "./components/Layouts/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoutes/ProtectedRoute";
import Home from "./pages/Public/Home";
import Links from "./pages/Public/Links";
import Files from "./pages/Public/Files";
import Login from "./pages/Auth/Login";
import Dashboard from "./pages/Admin/Dashboard";
import AddUser from "./pages/Admin/AddUser";
import ScrollToTop from "./components/ScrollTop/ScrollTop";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Public routes — anyone can access */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />

            {/* Logged-in users only */}
            <Route element={<ProtectedRoute />}>
              <Route path="/links" element={<Links />} />
              <Route path="/files" element={<Files />} />
            </Route>
          </Route>

          {/* Admin only */}
          <Route element={<ProtectedRoute adminOnly />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="add-user" element={<AddUser />} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
