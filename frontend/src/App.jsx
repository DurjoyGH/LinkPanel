import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PublicLayout from "./components/Layouts/PublicLayout";
import Home from "./pages/Public/Home";
import Links from "./pages/Public/Links";
import Files from "./pages/Public/Files";
import Login from "./pages/Auth/Login";
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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
