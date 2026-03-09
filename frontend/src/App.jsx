import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext.jsx";
import PublicLayout from "./components/Layouts/PublicLayout";
import AdminLayout from "./components/Layouts/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoutes/ProtectedRoute";
import GuestRoute from "./components/ProtectedRoutes/GuestRoute";
import Home from "./pages/Public/Home";
import Links from "./pages/Public/Links";
import Files from "./pages/Public/Files";
import SharedLinks from "./pages/Public/Share";
import UserDashboard from "./pages/Public/Dashboard";
import Login from "./pages/Auth/Login";
import Dashboard from "./pages/Admin/Dashboard";
import AddUser from "./pages/Admin/AddUser";
import ScrollToTop from "./components/ScrollTop/ScrollTop";

function App() {
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{ style: { fontFamily: "monospace" } }}
      />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Public routes — anyone can access */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/share/:token" element={<SharedLinks />} />

            {/* Guest only — redirect away if already logged in */}
            <Route element={<GuestRoute />}>
              <Route path="/login" element={<Login />} />
            </Route>

            {/* Logged-in users only */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<UserDashboard />} />
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
