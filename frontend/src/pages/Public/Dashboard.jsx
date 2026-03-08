import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { getMe, changePassword } from "../../services/authApi";
import showToast from "../../components/Toast/CustomToast.jsx";
import LoadingSpinner from "../../components/Loading/LoadingSpinner";

export default function UserDashboard() {
  const { user: authUser } = useAuth();

  const [stats, setStats] = useState({ links: 0, files: 0 });
  const [lastLogin, setLastLogin] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Change password form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwLoading, setPwLoading] = useState(false);

  useEffect(() => {
    fetchMe();
  }, []);

  const fetchMe = async () => {
    try {
      const res = await getMe();
      setStats(res.data.stats);
      setLastLogin(res.data.user.lastLogin);
    } catch {
      showToast.error("Failed to load profile data.");
    } finally {
      setStatsLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast.error("New passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      showToast.error("New password must be at least 6 characters.");
      return;
    }
    setPwLoading(true);
    try {
      await changePassword({ currentPassword, newPassword });
      showToast.success("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      showToast.error(err.response?.data?.message || "Failed to change password.");
    } finally {
      setPwLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const statCards = [
    { label: "Links Saved", value: stats.links, icon: "🔗" },
    { label: "Files Uploaded", value: stats.files, icon: "📂" },
    { label: "Last Login", value: formatDate(lastLogin), icon: "🕐", wide: true },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-10">

      {/* Heading */}
      <div>
        <h1 className="text-3xl font-bold" style={{ color: "#212529" }}>
          Dashboard
        </h1>
        <p className="text-sm mt-1" style={{ color: "#6c757d" }}>
          Welcome back, <span className="font-semibold">{authUser?.name}</span>!
        </p>
      </div>

      {/* Profile Card */}
      <div className="rounded-2xl shadow-sm p-6" style={{ backgroundColor: "#e9ecef" }}>
        <h2 className="text-base font-semibold mb-5" style={{ color: "#212529" }}>
          Profile
        </h2>
        <div className="flex flex-col gap-4">
          {[
            { label: "Name", value: authUser?.name },
            { label: "Email", value: authUser?.email },
            { label: "Role", value: authUser?.role === "admin" ? "Administrator" : "User" },
          ].map(({ label, value }) => (
            <div key={label} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
              <span
                className="sm:w-28 text-xs font-semibold uppercase tracking-wide"
                style={{ color: "#6c757d" }}
              >
                {label}
              </span>
              <span
                className="flex-1 px-4 py-2 rounded-lg text-sm"
                style={{ backgroundColor: "#dee2e6", color: "#212529" }}
              >
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div>
        <h2 className="text-base font-semibold mb-4" style={{ color: "#212529" }}>
          Statistics
        </h2>
        {statsLoading ? (
          <LoadingSpinner size="sm" text="Loading stats..." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {statCards.map((s) => (
              <div
                key={s.label}
                className={`rounded-2xl px-6 py-5 shadow-sm flex flex-col gap-2${
                  s.wide ? " sm:col-span-2" : ""
                }`}
                style={{ backgroundColor: "#e9ecef" }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#6c757d" }}>
                    {s.label}
                  </span>
                  <span className="text-xl">{s.icon}</span>
                </div>
                <p className="text-2xl font-bold truncate" style={{ color: "#212529" }}>
                  {s.value}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Change Password */}
      <div className="rounded-2xl shadow-sm p-6" style={{ backgroundColor: "#e9ecef" }}>
        <h2 className="text-base font-semibold mb-5" style={{ color: "#212529" }}>
          Change Password
        </h2>
        <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
          {[
            {
              id: "currentPassword",
              label: "Current Password",
              value: currentPassword,
              setter: setCurrentPassword,
            },
            {
              id: "newPassword",
              label: "New Password",
              value: newPassword,
              setter: setNewPassword,
            },
            {
              id: "confirmPassword",
              label: "Confirm New Password",
              value: confirmPassword,
              setter: setConfirmPassword,
            },
          ].map(({ id, label, value, setter }) => (
            <div key={id} className="flex flex-col gap-1">
              <label className="text-sm font-medium" style={{ color: "#212529" }}>
                {label}
              </label>
              <input
                type="password"
                required
                value={value}
                onChange={(e) => setter(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2 rounded-lg border-0 outline-none text-sm focus:ring-2 focus:ring-[#adb5bd] transition"
                style={{ backgroundColor: "#dee2e6", color: "#212529" }}
              />
            </div>
          ))}
          <div>
            <button
              type="submit"
              disabled={pwLoading}
              className="px-6 py-2 rounded-lg font-semibold text-sm text-white hover:opacity-85 transition-opacity disabled:opacity-50"
              style={{ backgroundColor: "#6c757d" }}
            >
              {pwLoading ? "Saving..." : "Change Password"}
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}
