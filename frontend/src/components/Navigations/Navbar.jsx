import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Links", to: "/links" },
  { label: "Files", to: "/files" },
];

const linkClass = ({ isActive }) =>
  `font-medium text-lg underline-offset-4 transition-all ${
    isActive ? "underline" : "hover:underline"
  }`;

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="w-full" style={{ backgroundColor: "#adb5bd" }}>
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

          {/* Login - Right (Desktop) */}
          <div className="hidden md:flex flex-shrink-0">
            <Link
              to="/login"
              className="px-4 py-1.5 rounded-lg font-medium text-sm text-white hover:opacity-85 transition-opacity"
              style={{ backgroundColor: "#6c757d" }}
            >
              Login
            </Link>
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
        <div className="md:hidden px-4 pb-4 flex flex-col gap-4">
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
          <Link
            to="/login"
            className="self-start px-4 py-1.5 rounded-lg font-medium text-sm text-white hover:opacity-85 transition-opacity"
            style={{ backgroundColor: "#6c757d" }}
            onClick={() => setMenuOpen(false)}
          >
            Login
          </Link>
        </div>
      )}
    </nav>
  );
}
