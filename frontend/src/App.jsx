import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PublicLayout from "./components/Layouts/PublicLayout";
import AdminLayout from "./components/Layouts/AdminLayout";
import Home from "./pages/Public/Home";
import Links from "./pages/Public/Links";
import Files from "./pages/Public/Files";
import Login from "./pages/Auth/Login";
import Dashboard from "./pages/Admin/Dashboard";
import AddUser from "./pages/Admin/AddUser";
import ScrollToTop from "./components/ScrollTop/ScrollTop";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/links" element={<Links />} />
          <Route path="/files" element={<Files />} />
          <Route path="/login" element={<Login />} />
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="add-user" element={<AddUser />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
