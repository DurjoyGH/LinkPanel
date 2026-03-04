import { Link } from "react-router-dom";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Links", to: "/links" },
  { label: "Files", to: "/files" },
];

export default function Footer() {
  return (
    <footer className="w-full" style={{ backgroundColor: "#adb5bd" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between gap-10 pb-8 border-b border-[#212529]/20">

          {/* Brand Block */}
          <div className="flex flex-col gap-3 max-w-xs">
            <Link to="/">
              <img
                src="/link-panel.png"
                alt="LinkPanel Logo"
                className="h-16 w-auto object-contain"
              />
            </Link>
            <p className="text-sm leading-relaxed" style={{ color: "#212529" }}>
              Paste your link and access it remotely — anytime, anywhere. Store, manage and share your links &amp; files with ease.
            </p>
          </div>

          {/* Navigation */}
          <div className="flex flex-col gap-3">
            <h4 className="font-semibold text-base" style={{ color: "#212529" }}>
              Navigation
            </h4>
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="text-sm underline-offset-4 hover:underline transition-all w-fit"
                style={{ color: "#212529" }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Developer */}
          <div className="flex flex-col gap-3">
            <h4 className="font-semibold text-base" style={{ color: "#212529" }}>
              Developer
            </h4>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="text-sm underline-offset-4 hover:underline transition-all w-fit"
              style={{ color: "#212529" }}
            >
              GitHub
            </a>
            <a
              href="mailto:dev@linkpanel.app"
              className="text-sm underline-offset-4 hover:underline transition-all w-fit"
              style={{ color: "#212529" }}
            >
              Contact
            </a>
            <span className="text-sm" style={{ color: "#212529" }}>
              v1.0.0
            </span>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-sm font-medium" style={{ color: "#212529" }}>
            &copy; {new Date().getFullYear()} LinkPanel. All rights reserved.
          </p>
          <p className="text-sm" style={{ color: "#212529" }}>
            Built with ❤️ by the Durjoy
          </p>
        </div>

      </div>
    </footer>
  );
}
