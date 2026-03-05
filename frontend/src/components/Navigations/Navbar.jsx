import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import showToast from "../Toast/CustomToast.jsx";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Links", to: "/links" },
  { label: "Files", to: "/files" },
];

const linkClass = ({ isActive }) =>
  `font-medium text-lg underline-offset-4 transition-all ${
    isActive ? "underline" : "hover:underline"
  }`;

// Rounded filled button with rounded border on hover
const actionLinkClass = ({ isActive }) =>
  `px-4 py-1.5 rounded-lg font-medium text-sm text-white transition-all border-2 ${
    isActive
      ? "border-[#212529]"
      : "border-transparent hover:border-[#212529]"
  }`;

const actionBtnClass =
  "px-4 py-1.5 rounded-lg font-medium text-sm text-white transition-all border-2 border-transparent hover:border-[#212529]";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const dashboardTo = isAdmin ? "/admin" : "/dashboard";

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    showToast.success("Logged out successfully.");
    navigate("/");
  };

  return (
    <nav className="w-full relative z-50" style={{ backgroundColor: "#adb5bd" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo - Left */}
          <div className="flex-shrink-0">
            <Link to="/">
              <img
                src="/link-panel.png"
                alt="LinkPanel Logo"
                className="h-20 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Center Nav Links - Desktop */}
          <div className="hidden md:flex flex-1 justify-center items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                end={link.to === "/"}
                className={linkClass}
                style={{ color: "#212529" }}
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Auth Actions - Right (Desktop) */}
          <div className="hidden md:flex flex-shrink-0 items-center gap-2">
            {isAuthenticated ? (
              <>
                <NavLink
                  to={dashboardTo}
                  className={actionLinkClass}
                  style={{ backgroundColor: "#6c757d" }}
                >
                  Dashboard
                </NavLink>
                <button
                  onClick={handleLogout}
                  className={actionBtnClass}
                  style={{ backgroundColor: "#6c757d" }}
                >
                  Logout
                </button>
              </>
            ) : (
              <NavLink
                to="/login"
                className={actionLinkClass}
                style={{ backgroundColor: "#6c757d" }}
              >
                Login
              </NavLink>
            )}
          </div>

          {/* Hamburger - Mobile */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded focus:outline-none"
              style={{ color: "#212529" }}
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t relative z-50 shadow-md" style={{ borderColor: "#21252933", backgroundColor: "#adb5bd" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4 flex flex-col gap-3">
          {/* Nav links */}
          <div className="flex flex-col gap-3 pt-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                end={link.to === "/"}
                className={linkClass}
                style={{ color: "#212529" }}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t" style={{ borderColor: "#21252933" }} />

          {/* Auth buttons */}
          <div className="flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <NavLink
                  to={dashboardTo}
                  className={({ isActive }) =>
                    `w-full text-center px-4 py-1.5 rounded-lg font-medium text-sm text-white transition-all border-2 ${
                      isActive ? "border-[#212529]" : "border-transparent hover:border-[#212529]"
                    }`
                  }
                  style={{ backgroundColor: "#6c757d" }}
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="w-full text-center px-4 py-1.5 rounded-lg font-medium text-sm text-white transition-all border-2 border-transparent hover:border-[#212529]"
                  style={{ backgroundColor: "#6c757d" }}
                >
                  Logout
                </button>
              </>
            ) : (
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `w-full text-center px-4 py-1.5 rounded-lg font-medium text-sm text-white transition-all border-2 ${
                    isActive ? "border-[#212529]" : "border-transparent hover:border-[#212529]"
                  }`
                }
                style={{ backgroundColor: "#6c757d" }}
                onClick={() => setMenuOpen(false)}
              >
                Login
              </NavLink>
            )}
          </div>
        </div>
        </div>
      )}
    </nav>
  );
}
