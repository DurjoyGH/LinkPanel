import { Outlet } from "react-router-dom";
import AdminSidebar from "../Navigations/AdminSidebar";

export default function AdminLayout() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-5 md:p-10 overflow-x-hidden" style={{ backgroundColor: "#f8f9fa" }}>
        <Outlet />
      </main>
    </div>
  );
}
