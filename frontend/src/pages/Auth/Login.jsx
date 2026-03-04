import { useState } from "react";
import { Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // handle login logic
  };

  return (
    <div className="flex items-center justify-center min-h-full py-12 px-4">
      <div
        className="w-full max-w-md rounded-2xl shadow-md p-8"
        style={{ backgroundColor: "#e9ecef" }}
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src="/link-panel.png"
            alt="LinkPanel Logo"
            className="h-20 w-auto object-contain"
          />
        </div>

        <h2
          className="text-2xl font-bold text-center mb-6"
          style={{ color: "#212529" }}
        >
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Email */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="email"
              className="text-sm font-medium"
              style={{ color: "#212529" }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border-0 outline-none text-sm focus:ring-2 focus:ring-[#adb5bd] transition"
              style={{ backgroundColor: "#dee2e6", color: "#212529" }}
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="password"
              className="text-sm font-medium"
              style={{ color: "#212529" }}
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 pr-10 rounded-lg border-0 outline-none text-sm focus:ring-2 focus:ring-[#adb5bd] transition"
                style={{ backgroundColor: "#dee2e6", color: "#212529" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs"
                style={{ color: "#212529" }}
                tabIndex={-1}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-xs font-medium hover:opacity-70 transition-opacity"
              style={{ color: "#212529" }}
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2 rounded-lg font-semibold text-sm transition-opacity hover:opacity-85"
            style={{ backgroundColor: "#adb5bd", color: "#212529" }}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
