import { useState } from "react";

const demoLinks = [
  { id: 1, name: "GitHub", url: "https://github.com" },
  { id: 2, name: "Tailwind CSS Docs", url: "https://tailwindcss.com/docs" },
  { id: 3, name: "React Docs", url: "https://react.dev" },
  { id: 4, name: "Vite", url: "https://vitejs.dev" },
  { id: 5, name: "MDN Web Docs", url: "https://developer.mozilla.org" },
];

export default function Links() {
  const [links, setLinks] = useState(demoLinks);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !url.trim()) {
      setError("Both fields are required.");
      return;
    }
    setError("");
    setLinks([
      { id: Date.now(), name: name.trim(), url: url.trim() },
      ...links,
    ]);
    setName("");
    setUrl("");
  };

  const handleDelete = (id) => {
    setLinks(links.filter((l) => l.id !== id));
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Heading */}
      <h1 className="text-3xl font-bold mb-2" style={{ color: "#212529" }}>
        My Links
      </h1>
      <p className="text-sm mb-8" style={{ color: "#6c757d" }}>
        Save your links and open them from anywhere.
      </p>

      {/* Add Link Form */}
      <div className="rounded-2xl shadow-sm p-6 mb-10" style={{ backgroundColor: "#e9ecef" }}>
        <h2 className="text-lg font-semibold mb-4" style={{ color: "#212529" }}>
          Add New Link
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium" style={{ color: "#212529" }}>
              Link Name
            </label>
            <input
              type="text"
              placeholder="e.g. GitHub"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border-0 outline-none text-sm focus:ring-2 focus:ring-[#adb5bd] transition"
              style={{ backgroundColor: "#dee2e6", color: "#212529" }}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium" style={{ color: "#212529" }}>
              URL
            </label>
            <input
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border-0 outline-none text-sm focus:ring-2 focus:ring-[#adb5bd] transition"
              style={{ backgroundColor: "#dee2e6", color: "#212529" }}
            />
          </div>
          {error && (
            <p className="text-xs" style={{ color: "#dc3545" }}>
              {error}
            </p>
          )}
          <button
            type="submit"
            className="self-start px-6 py-2 rounded-lg font-semibold text-sm text-white hover:opacity-85 transition-opacity"
            style={{ backgroundColor: "#6c757d" }}
          >
            Save Link
          </button>
        </form>
      </div>

      {/* Links List */}
      {links.length === 0 ? (
        <p className="text-sm text-center py-10" style={{ color: "#6c757d" }}>
          No links saved yet. Add your first one above!
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {links.map((link) => (
            <div
              key={link.id}
              className="flex items-center justify-between gap-4 rounded-xl px-5 py-4 shadow-sm"
              style={{ backgroundColor: "#e9ecef" }}
            >
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="font-semibold text-sm truncate" style={{ color: "#212529" }}>
                  {link.name}
                </span>
                <span className="text-xs truncate" style={{ color: "#6c757d" }}>
                  {link.url}
                </span>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <a
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white hover:opacity-85 transition-opacity"
                  style={{ backgroundColor: "#adb5bd" }}
                >
                  Open
                </a>
                <button
                  onClick={() => handleDelete(link.id)}
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white hover:opacity-85 transition-opacity"
                  style={{ backgroundColor: "#6c757d" }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
