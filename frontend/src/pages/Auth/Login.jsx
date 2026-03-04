import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/links", { replace: true });
      }
    } catch (err) {
      setError(
        err?.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-full py-12 px-4">
      <div
        className="w-full max-w-md rounded-2xl shadow-md p-8"
        style={{ backgroundColor: "#e9ecef" }}
      >
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
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-medium" style={{ color: "#212529" }}>
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

          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm font-medium" style={{ color: "#212529" }}>
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

          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-xs font-medium hover:opacity-70 transition-opacity"
              style={{ color: "#212529" }}
            >
              Forgot password?
            </Link>
          </div>

          {error && (
            <p className="text-xs text-center" style={{ color: "#dc3545" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg font-semibold text-sm transition-opacity hover:opacity-85 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ backgroundColor: "#adb5bd", color: "#212529" }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
