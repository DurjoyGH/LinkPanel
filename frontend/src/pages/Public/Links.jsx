import { useState, useEffect } from "react";
import { getLinks, createLink, updateLink, deleteLink } from "../../services/publicApi";
import showToast from "../../components/Toast/CustomToast";

export default function Links() {
  const [links, setLinks] = useState([]);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Edit state
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const res = await getLinks();
      setLinks(res.data.links);
    } catch (err) {
      showToast.error(err.response?.data?.message || "Failed to load links.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !url.trim()) {
      setError("Both fields are required.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const res = await createLink({ name: name.trim(), url: url.trim() });
      setLinks([res.data.link, ...links]);
      setName("");
      setUrl("");
      showToast.success("Link saved successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save link.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditStart = (link) => {
    setEditingId(link._id);
    setEditName(link.name);
    setEditUrl(link.url);
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditName("");
    setEditUrl("");
  };

  const handleUpdate = async (id) => {
    if (!editName.trim() || !editUrl.trim()) {
      showToast.error("Both fields are required.");
      return;
    }
    setUpdatingId(id);
    try {
      const res = await updateLink(id, { name: editName.trim(), url: editUrl.trim() });
      setLinks(links.map((l) => (l._id === id ? res.data.link : l)));
      setEditingId(null);
      showToast.success("Link updated successfully!");
    } catch (err) {
      showToast.error(err.response?.data?.message || "Failed to update link.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await deleteLink(id);
      setLinks(links.filter((l) => l._id !== id));
      showToast.success("Link deleted.");
    } catch (err) {
      showToast.error(err.response?.data?.message || "Failed to delete link.");
    } finally {
      setDeletingId(null);
    }
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
            disabled={submitting}
            className="self-start px-6 py-2 rounded-lg font-semibold text-sm text-white hover:opacity-85 transition-opacity disabled:opacity-50"
            style={{ backgroundColor: "#6c757d" }}
          >
            {submitting ? "Saving..." : "Save Link"}
          </button>
        </form>
      </div>

      {/* Links List */}
      {loading ? (
        <p className="text-sm text-center py-10" style={{ color: "#6c757d" }}>
          Loading links...
        </p>
      ) : links.length === 0 ? (
        <p className="text-sm text-center py-10" style={{ color: "#6c757d" }}>
          No links saved yet. Add your first one above!
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {links.map((link) => (
            <div
              key={link._id}
              className="rounded-xl shadow-sm overflow-hidden"
              style={{ backgroundColor: "#e9ecef" }}
            >
              {editingId === link._id ? (
                /* ── Edit mode ── */
                <div className="flex flex-col gap-3 px-5 py-4">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Link name"
                    className="w-full px-3 py-2 rounded-lg border-0 outline-none text-sm focus:ring-2 focus:ring-[#adb5bd] transition"
                    style={{ backgroundColor: "#dee2e6", color: "#212529" }}
                  />
                  <input
                    type="url"
                    value={editUrl}
                    onChange={(e) => setEditUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full px-3 py-2 rounded-lg border-0 outline-none text-sm focus:ring-2 focus:ring-[#adb5bd] transition"
                    style={{ backgroundColor: "#dee2e6", color: "#212529" }}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdate(link._id)}
                      disabled={updatingId === link._id}
                      className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white hover:opacity-85 transition-opacity disabled:opacity-50"
                      style={{ backgroundColor: "#6c757d" }}
                    >
                      {updatingId === link._id ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={handleEditCancel}
                      className="px-4 py-1.5 rounded-lg text-xs font-semibold hover:opacity-75 transition-opacity"
                      style={{ backgroundColor: "#dee2e6", color: "#6c757d" }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                /* ── View mode ── */
                <div className="flex items-center justify-between gap-4 px-5 py-4">
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="font-semibold text-sm truncate" style={{ color: "#212529" }}>
                      {link.name}
                    </span>
                    <span className="text-xs truncate" style={{ color: "#6c757d" }}>
                      {link.url}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
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
                      onClick={() => handleEditStart(link)}
                      className="px-4 py-1.5 rounded-lg text-xs font-semibold hover:opacity-85 transition-opacity"
                      style={{ backgroundColor: "#dee2e6", color: "#212529" }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(link._id)}
                      disabled={deletingId === link._id}
                      className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white hover:opacity-85 transition-opacity disabled:opacity-50"
                      style={{ backgroundColor: "#6c757d" }}
                    >
                      {deletingId === link._id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
