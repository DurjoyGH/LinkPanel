import { Link } from "react-router-dom";

const stats = [
  { label: "Total Users", value: "128", icon: "👥", change: "+12 this month" },
  {
    label: "Total Links",
    value: "3,842",
    icon: "🔗",
    change: "+340 this week",
  },
  { label: "Total Files", value: "916", icon: "📂", change: "+58 this week" },
  { label: "Admins", value: "4", icon: "🔒", change: "No change" },
];

const recentUsers = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice@example.com",
    role: "User",
    joined: "2026-03-01",
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob@example.com",
    role: "Admin",
    joined: "2026-03-02",
  },
  {
    id: 3,
    name: "Carol White",
    email: "carol@example.com",
    role: "User",
    joined: "2026-03-03",
  },
  {
    id: 4,
    name: "David Lee",
    email: "david@example.com",
    role: "User",
    joined: "2026-03-03",
  },
  {
    id: 5,
    name: "Eva Brown",
    email: "eva@example.com",
    role: "User",
    joined: "2026-03-04",
  },
];

const quickActions = [
  { label: "Add User", to: "/admin/add-user", icon: "➕" },
  { label: "User Management", to: "/admin/users", icon: "👤" },
  { label: "Make Admin", to: "/admin/make-admin", icon: "🔑" },
  { label: "Go to Home", to: "/", icon: "🏠" },
];

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold" style={{ color: "#212529" }}>
          Admin Dashboard
        </h1>
        <p className="text-sm mt-1" style={{ color: "#6c757d" }}>
          Welcome back! Here's what's happening on LinkPanel.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((s, i) => (
          <div
            key={i}
            className="rounded-2xl px-6 py-5 shadow-sm flex flex-col gap-2 group hover:-translate-y-1 hover:shadow-md transition-all duration-300"
            style={{ backgroundColor: "#e9ecef" }}
          >
            <div className="flex items-center justify-between">
              <span
                className="text-sm font-medium"
                style={{ color: "#6c757d" }}
              >
                {s.label}
              </span>
              <span className="text-2xl group-hover:scale-110 transition-transform duration-300">
                {s.icon}
              </span>
            </div>
            <p className="text-3xl font-bold" style={{ color: "#212529" }}>
              {s.value}
            </p>
            <p className="text-xs" style={{ color: "#6c757d" }}>
              {s.change}
            </p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold mb-4" style={{ color: "#212529" }}>
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          {quickActions.map((a) => (
            <Link
              key={a.label}
              to={a.to}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-85 transition-opacity shadow-sm"
              style={{ backgroundColor: "#6c757d" }}
            >
              <span>{a.icon}</span>
              {a.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px" style={{ backgroundColor: "#dee2e6" }} />

      {/* Recent Users Table */}
      <div>
        <h2 className="text-lg font-semibold mb-4" style={{ color: "#212529" }}>
          Recent Users
        </h2>
        <div
          className="rounded-2xl shadow-sm overflow-hidden"
          style={{ backgroundColor: "#e9ecef" }}
        >
          {/* Table Header */}
          <div
            className="hidden sm:grid grid-cols-4 px-6 py-3 text-xs font-semibold uppercase tracking-wide border-b"
            style={{ color: "#6c757d", borderColor: "#dee2e6" }}
          >
            <span>Name</span>
            <span>Email</span>
            <span>Role</span>
            <span>Joined</span>
          </div>

          {/* Rows */}
          {recentUsers.map((u, i) => (
            <div
              key={u.id}
              className={`flex flex-col sm:grid sm:grid-cols-4 gap-1 sm:gap-0 px-6 py-4 text-sm transition-colors hover:bg-[#dee2e6] ${
                i !== recentUsers.length - 1 ? "border-b" : ""
              }`}
              style={{ borderColor: "#dee2e6" }}
            >
              <span className="font-medium" style={{ color: "#212529" }}>
                {u.name}
              </span>
              <span style={{ color: "#6c757d" }}>{u.email}</span>
              <span>
                <span
                  className="px-2 py-0.5 rounded-full text-xs font-semibold"
                  style={{
                    backgroundColor: u.role === "Admin" ? "#adb5bd" : "#dee2e6",
                    color: "#212529",
                  }}
                >
                  {u.role}
                </span>
              </span>
              <span style={{ color: "#6c757d" }}>{u.joined}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
