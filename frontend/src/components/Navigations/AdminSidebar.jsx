import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import showToast from "../Toast/CustomToast.jsx";

const menuItems = [
  {
    label: "Dashboard",
    to: "/admin",
    icon: (
      <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    label: "Add User",
    to: "/admin/add-user",
    icon: (
      <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
      </svg>
    ),
  },
  {
    label: "User Management",
    to: "/admin/users",
    icon: (
      <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" />
      </svg>
    ),
  },
  {
    label: "Make Admin",
    to: "/admin/make-admin",
    icon: (
      <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
];

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
    isActive ? "underline underline-offset-4" : "hover:underline hover:underline-offset-4"
  }`;

function SidebarInner({ onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    if (onClose) onClose();
    showToast.success("Logged out successfully.");
    navigate("/");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo + close button (mobile only) */}
      <div
        className="flex items-center justify-between px-4 py-4 border-b"
        style={{ borderColor: "#21252933" }}
      >
        <Link to="/admin" onClick={onClose} className="flex items-center gap-2">
          <img src="/link-panel.png" alt="LinkPanel" className="h-12 w-auto object-contain" />
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#212529" }}>
            Admin Panel
          </span>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded focus:outline-none md:hidden"
            style={{ color: "#212529" }}
            aria-label="Close sidebar"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Nav links */}
      <nav className="flex flex-col gap-1 px-3 py-4 flex-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            end={item.to === "/admin"}
            className={linkClass}
            style={{ color: "#212529" }}
            onClick={onClose}
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="px-3 py-4 border-t flex flex-col gap-1" style={{ borderColor: "#21252933" }}>
        {/* User info */}
        {user && (
          <div className="px-4 py-2 text-xs mb-1" style={{ color: "#21252999" }}>
            Signed in as <span className="font-semibold" style={{ color: "#212529" }}>{user.name || user.email}</span>
          </div>
        )}

        {/* Go to Home */}
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-3 text-sm font-medium hover:underline underline-offset-4 transition-all"
          style={{ color: "#212529" }}
          onClick={onClose}
        >
          <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Go to Home
        </Link>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-sm font-medium w-full text-left hover:underline underline-offset-4 transition-all"
          style={{ color: "#dc3545" }}
        >
          <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </div>
  );
}

export default function AdminSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside
        className="hidden md:flex flex-col w-64 flex-shrink-0 h-screen sticky top-0 overflow-y-auto"
        style={{ backgroundColor: "#adb5bd" }}
      >
        <SidebarInner onClose={null} />
      </aside>

      {/* ── Mobile top bar ── */}
      <div
        className="md:hidden flex items-center justify-between px-4 h-16 flex-shrink-0"
        style={{ backgroundColor: "#adb5bd" }}
      >
        <Link to="/">
          <img src="/link-panel.png" alt="LinkPanel" className="h-10 w-auto object-contain" />
        </Link>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded focus:outline-none"
          style={{ color: "#212529" }}
          aria-label="Open sidebar"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* ── Mobile drawer overlay ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer panel */}
          <div
            className="relative z-10 w-72 max-w-[85vw] min-h-screen shadow-xl"
            style={{ backgroundColor: "#adb5bd" }}
          >
            <SidebarInner onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}

