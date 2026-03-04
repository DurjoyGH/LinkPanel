import { useState } from "react";

export default function AddUser() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      setError("All fields are required.");
      return;
    }
    // TODO: connect to API
    setSuccess(`User "${form.name}" added successfully.`);
    setForm({ name: "", email: "", password: "" });
  };

  return (
    <div className="flex flex-col gap-6 max-w-lg mx-auto w-full">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold" style={{ color: "#212529" }}>
          Add User
        </h1>
        <p className="text-sm mt-1" style={{ color: "#6c757d" }}>
          Create a new user account.
        </p>
      </div>

      {/* Divider */}
      <div className="h-px" style={{ backgroundColor: "#dee2e6" }} />

      {/* Info Note */}
      <div
        className="flex items-start gap-3 rounded-xl px-4 py-3 text-sm"
        style={{ backgroundColor: "#e9ecef", color: "#212529" }}
      >
        <span className="text-lg flex-shrink-0">📧</span>
        <p>
          Once the user is added, they will automatically receive an email with
          their login credentials — including their email and password.
        </p>
      </div>

      {/* Form */}
      <div className="rounded-2xl shadow-sm p-6" style={{ backgroundColor: "#e9ecef" }}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* Name */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium" style={{ color: "#212529" }}>
              Full Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border-0 outline-none text-sm focus:ring-2 focus:ring-[#adb5bd] transition"
              style={{ backgroundColor: "#dee2e6", color: "#212529" }}
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium" style={{ color: "#212529" }}>
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="john@example.com"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border-0 outline-none text-sm focus:ring-2 focus:ring-[#adb5bd] transition"
              style={{ backgroundColor: "#dee2e6", color: "#212529" }}
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium" style={{ color: "#212529" }}>
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-2.5 pr-16 rounded-lg border-0 outline-none text-sm focus:ring-2 focus:ring-[#adb5bd] transition"
                style={{ backgroundColor: "#dee2e6", color: "#212529" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium"
                style={{ color: "#6c757d" }}
                tabIndex={-1}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Feedback */}
          {error && (
            <p className="text-xs" style={{ color: "#dc3545" }}>{error}</p>
          )}
          {success && (
            <p className="text-xs" style={{ color: "#198754" }}>{success}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2.5 rounded-lg font-semibold text-sm text-white hover:opacity-85 transition-opacity"
            style={{ backgroundColor: "#6c757d" }}
          >
            Add User
          </button>
        </form>
      </div>

    </div>
  );
}
