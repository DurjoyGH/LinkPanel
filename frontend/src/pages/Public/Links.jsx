import { useState, useEffect } from "react";
import {
  getLinks,
  createLink,
  updateLink,
  deleteLink,
  createShare,
} from "../../services/publicApi";
import showToast from "../../components/Toast/CustomToast";
import LoadingSpinner from "../../components/Loading/LoadingSpinner";

export default function Links() {
  const [links, setLinks] = useState([]);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [editComment, setEditComment] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const [commentModalLink, setCommentModalLink] = useState(null);

  // Share state
  const [shareOpen, setShareOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [sharing, setSharing] = useState(false);
  const [sharedUrl, setSharedUrl] = useState("");
  const [shareCopied, setShareCopied] = useState(false);

  // Search
  const [searchQuery, setSearchQuery] = useState("");
  const filteredLinks = searchQuery.trim()
    ? links.filter(
        (l) =>
          l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.url.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : links;

  // Pagination
  const PAGE_SIZE = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(filteredLinks.length / PAGE_SIZE));
  const paginatedLinks = filteredLinks.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

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
      setError("Please fill up required fields.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const res = await createLink({
        name: name.trim(),
        url: url.trim(),
        comment: comment.trim(),
      });
      setLinks([res.data.link, ...links]);
      setCurrentPage(1);
      setSearchQuery("");
      setName("");
      setUrl("");
      setComment("");
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
    setEditComment(link.comment || "");
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditName("");
    setEditUrl("");
    setEditComment("");
  };

  const handleUpdate = async (id) => {
    if (!editName.trim() || !editUrl.trim()) {
      showToast.error("Both fields are required.");
      return;
    }
    setUpdatingId(id);
    try {
      const res = await updateLink(id, {
        name: editName.trim(),
        url: editUrl.trim(),
        comment: editComment.trim(),
      });
      setLinks(links.map((l) => (l._id === id ? res.data.link : l)));
      setEditingId(null);
      showToast.success("Link updated successfully!");
    } catch (err) {
      showToast.error(err.response?.data?.message || "Failed to update link.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCopy = (link) => {
    navigator.clipboard.writeText(link.url).then(() => {
      setCopiedId(link._id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await deleteLink(id);
      const next = links.filter((l) => l._id !== id);
      setLinks(next);
      const newTotal = Math.max(1, Math.ceil(next.length / PAGE_SIZE));
      if (currentPage > newTotal) setCurrentPage(newTotal);
      showToast.success("Link deleted.");
    } catch (err) {
      showToast.error(err.response?.data?.message || "Failed to delete link.");
    } finally {
      setDeletingId(null);
    }
  };

  const openShareModal = () => {
    setSelectedIds(links.map((l) => l._id));
    setSharedUrl("");
    setShareCopied(false);
    setShareOpen(true);
  };

  const toggleSelectId = (id) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const handleShareDone = async () => {
    if (selectedIds.length === 0) {
      showToast.error("Select at least one link.");
      return;
    }
    setSharing(true);
    try {
      const res = await createShare(selectedIds);
      const url = `${window.location.origin}/share/${res.data.token}`;
      setSharedUrl(url);
    } catch (err) {
      showToast.error(
        err.response?.data?.message || "Failed to create share link.",
      );
    } finally {
      setSharing(false);
    }
  };

  const handleCopyShareUrl = () => {
    navigator.clipboard.writeText(sharedUrl).then(() => {
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    });
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
      <div
        className="rounded-2xl shadow-sm p-6 mb-10"
        style={{ backgroundColor: "#e9ecef" }}
      >
        <h2 className="text-lg font-semibold mb-4" style={{ color: "#212529" }}>
          Add New Link
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium" style={{ color: "#212529" }}>
              Link Name <span style={{ color: "#dc3545" }}>*</span>
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
              URL <span style={{ color: "#dc3545" }}>*</span>
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
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium" style={{ color: "#212529" }}>
              Comment
            </label>
            <textarea
              placeholder="Optional note about this link"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 rounded-lg border-0 outline-none text-sm focus:ring-2 focus:ring-[#adb5bd] transition resize-none"
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

      {/* Search Bar */}
      {!loading && links.length > 0 && (
        <div className="relative mb-5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#adb5bd"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search by name or URL…"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border-0 outline-none text-sm focus:ring-2 focus:ring-[#adb5bd] transition"
            style={{ backgroundColor: "#e9ecef", color: "#212529" }}
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                setCurrentPage(1);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:opacity-70 transition-opacity"
              style={{ color: "#6c757d" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
      )}

      {/* Links List */}
      {loading ? (
        <LoadingSpinner fullPage text="Loading links..." />
      ) : links.length === 0 ? (
        <p className="text-sm text-center py-10" style={{ color: "#6c757d" }}>
          No links saved yet. Add your first one above!
        </p>
      ) : filteredLinks.length === 0 ? (
        <p className="text-sm text-center py-10" style={{ color: "#6c757d" }}>
          No links match your search.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {paginatedLinks.map((link) => (
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
                  <textarea
                    value={editComment}
                    onChange={(e) => setEditComment(e.target.value)}
                    placeholder="Comment (optional)"
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg border-0 outline-none text-sm focus:ring-2 focus:ring-[#adb5bd] transition resize-none"
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
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-4">
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span
                      className="font-semibold text-sm truncate"
                      style={{ color: "#212529" }}
                    >
                      {link.name}
                    </span>
                    <span
                      className="text-xs truncate"
                      style={{ color: "#6c757d" }}
                    >
                      {link.url}
                    </span>
                    <button
                      onClick={() => setCommentModalLink(link)}
                      className="text-xs underline underline-offset-2 text-left w-fit hover:opacity-70 transition-opacity cursor-pointer mt-2"
                      style={{ color: "#6c757d" }}
                    >
                      Show Comment
                    </button>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleCopy(link)}
                      title="Copy link"
                      className="p-1.5 rounded-lg hover:opacity-85 transition-opacity"
                      style={{
                        backgroundColor: "#dee2e6",
                        color: copiedId === link._id ? "#198754" : "#6c757d",
                      }}
                    >
                      {copiedId === link._id ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect
                            x="9"
                            y="9"
                            width="13"
                            height="13"
                            rx="2"
                            ry="2"
                          />
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                      )}
                    </button>
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

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-6 flex-wrap">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-opacity hover:opacity-85 disabled:opacity-40"
            style={{ backgroundColor: "#dee2e6", color: "#212529" }}
          >
            ← Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className="w-8 h-8 rounded-lg text-xs font-semibold transition-opacity hover:opacity-85"
              style={{
                backgroundColor: page === currentPage ? "#6c757d" : "#dee2e6",
                color: page === currentPage ? "#fff" : "#212529",
              }}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-opacity hover:opacity-85 disabled:opacity-40"
            style={{ backgroundColor: "#dee2e6", color: "#212529" }}
          >
            Next →
          </button>
        </div>
      )}

      {/* ── Share FAB ── */}
      {links.length > 0 && (
        <div className="flex justify-center mt-10">
          <button
            onClick={openShareModal}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white hover:opacity-85 transition-opacity shadow-sm"
            style={{ backgroundColor: "#6c757d" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
            Share My Links
          </button>
        </div>
      )}

      {/* ── Share Modal ── */}
      {shareOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
          onClick={() => {
            setShareOpen(false);
            setSharedUrl("");
          }}
        >
          <div
            className="w-full max-w-md rounded-2xl shadow-xl p-6 relative flex flex-col gap-4"
            style={{ backgroundColor: "#f8f9fa" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3
                className="text-base font-semibold"
                style={{ color: "#212529" }}
              >
                Share Links
              </h3>
              <button
                onClick={() => {
                  setShareOpen(false);
                  setSharedUrl("");
                }}
                className="p-1 rounded-lg hover:opacity-70 transition-opacity"
                style={{ color: "#6c757d" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Select All */}
            {!sharedUrl && (
              <>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === links.length}
                    onChange={(e) =>
                      setSelectedIds(
                        e.target.checked ? links.map((l) => l._id) : [],
                      )
                    }
                    className="w-4 h-4 accent-[#6c757d]"
                  />
                  <span
                    className="text-sm font-medium"
                    style={{ color: "#495057" }}
                  >
                    Select All
                  </span>
                </label>

                <hr style={{ borderColor: "#dee2e6" }} />

                {/* Links checklist */}
                <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1">
                  {links.map((link) => (
                    <label
                      key={link._id}
                      className="flex items-center gap-3 cursor-pointer select-none rounded-lg px-3 py-2 transition-colors hover:bg-[#e9ecef]"
                    >
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(link._id)}
                        onChange={() => toggleSelectId(link._id)}
                        className="w-4 h-4 flex-shrink-0 accent-[#6c757d]"
                      />
                      <div className="flex flex-col min-w-0">
                        <span
                          className="text-sm font-semibold truncate"
                          style={{ color: "#212529" }}
                        >
                          {link.name}
                        </span>
                        <span
                          className="text-xs truncate"
                          style={{ color: "#6c757d" }}
                        >
                          {link.url}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>

                <button
                  onClick={handleShareDone}
                  disabled={sharing || selectedIds.length === 0}
                  className="w-full py-2 rounded-xl font-semibold text-sm text-white hover:opacity-85 transition-opacity disabled:opacity-50"
                  style={{ backgroundColor: "#6c757d" }}
                >
                  {sharing
                    ? "Generating..."
                    : `Done · ${selectedIds.length} link${selectedIds.length !== 1 ? "s" : ""} selected`}
                </button>
              </>
            )}

            {/* Generated URL */}
            {sharedUrl && (
              <div className="flex flex-col gap-3">
                <p className="text-sm" style={{ color: "#495057" }}>
                  ✅ Share link generated! Anyone with this link can view your
                  selected links.
                </p>
                <div
                  className="flex items-center gap-2 rounded-xl px-3 py-2"
                  style={{ backgroundColor: "#e9ecef" }}
                >
                  <span
                    className="flex-1 text-xs break-all"
                    style={{ color: "#212529" }}
                  >
                    {sharedUrl}
                  </span>
                  <button
                    onClick={handleCopyShareUrl}
                    className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold text-white hover:opacity-85 transition-opacity"
                    style={{
                      backgroundColor: shareCopied ? "#198754" : "#6c757d",
                    }}
                  >
                    {shareCopied ? "Copied!" : "Copy"}
                  </button>
                </div>
                <button
                  onClick={() => setSharedUrl("")}
                  className="self-start text-xs underline underline-offset-2 hover:opacity-70 transition-opacity"
                  style={{ color: "#6c757d" }}
                >
                  ← Change selection
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Comment Modal */}
      {commentModalLink && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
          onClick={() => setCommentModalLink(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl shadow-xl p-6 relative"
            style={{ backgroundColor: "#f8f9fa" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setCommentModalLink(null)}
              className="absolute top-4 right-4 p-1 rounded-lg hover:opacity-70 transition-opacity"
              style={{ color: "#6c757d" }}
              title="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Modal header */}
            <h3
              className="text-base font-semibold mb-1 pr-6"
              style={{ color: "#212529" }}
            >
              {commentModalLink.name}
            </h3>
            <a
              href={commentModalLink.url}
              target="_blank"
              rel="noreferrer"
              className="text-xs underline break-all"
              style={{ color: "#6c757d" }}
            >
              {commentModalLink.url}
            </a>

            {/* Divider */}
            <hr className="my-4" style={{ borderColor: "#dee2e6" }} />

            {/* Comment content */}
            <p
              className="text-sm font-medium mb-2"
              style={{ color: "#495057" }}
            >
              💬 Comment
            </p>
            {commentModalLink.comment ? (
              <p
                className="text-sm leading-relaxed whitespace-pre-wrap"
                style={{ color: "#212529" }}
              >
                {commentModalLink.comment}
              </p>
            ) : (
              <p className="text-sm italic" style={{ color: "#adb5bd" }}>
                No comment added for this link.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
