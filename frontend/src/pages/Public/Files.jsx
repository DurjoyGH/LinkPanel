import { useState, useEffect, useRef } from "react";
import {
  getFiles,
  uploadFile,
  updateFile,
  deleteFile,
  createFileShare,
} from "../../services/publicApi";
import showToast from "../../components/Toast/CustomToast";
import LoadingSpinner from "../../components/Loading/LoadingSpinner";

const formatSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const getFileIcon = (mimeType = "") => {
  if (mimeType.startsWith("image/")) return "🖼️";
  if (mimeType === "application/pdf") return "📄";
  if (mimeType.includes("word")) return "📝";
  if (mimeType.includes("excel") || mimeType.includes("spreadsheet"))
    return "📊";
  if (mimeType.includes("powerpoint") || mimeType.includes("presentation"))
    return "📑";
  if (mimeType.includes("zip")) return "🗜️";
  if (mimeType.startsWith("text/")) return "📃";
  return "📁";
};

const ACCEPTED =
  ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip," +
  ".jpg,.jpeg,.png,.gif,.webp,.svg";

export default function Files() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const fileInputRef = useRef(null);

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editComment, setEditComment] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const [deletingId, setDeletingId] = useState(null);

  const [commentModalFile, setCommentModalFile] = useState(null);

  // Search
  const [searchQuery, setSearchQuery] = useState("");
  const filteredFiles = searchQuery.trim()
    ? files.filter(
        (f) =>
          f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.originalName.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : files;

  // Pagination
  const PAGE_SIZE = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(filteredFiles.length / PAGE_SIZE));
  const paginatedFiles = filteredFiles.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  // Share state
  const [shareOpen, setShareOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [sharing, setSharing] = useState(false);
  const [sharedUrl, setSharedUrl] = useState("");
  const [shareCopied, setShareCopied] = useState(false);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const res = await getFiles();
      setFiles(res.data.files);
    } catch {
      showToast.error("Failed to load files.");
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) pickFile(file);
  };

  const pickFile = (file) => {
    if (file.size > 10 * 1024 * 1024) {
      setFormError("File is too large. Maximum allowed size is 10 MB.");
      return;
    }
    setSelectedFile(file);
    setFormError("");
    if (!name) setName(file.name.replace(/\.[^/.]+$/, ""));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError("Please enter a file name.");
      return;
    }
    if (!selectedFile) {
      setFormError("Please select a file to upload.");
      return;
    }
    setFormError("");
    setSubmitting(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("name", name.trim());
    formData.append("comment", comment.trim());

    try {
      const res = await uploadFile(formData, (e) => {
        if (e.total) setUploadProgress(Math.round((e.loaded * 100) / e.total));
      });
      setFiles([res.data.file, ...files]);
      setCurrentPage(1);
      setSearchQuery("");
      setName("");
      setComment("");
      setSelectedFile(null);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = "";
      showToast.success("File uploaded successfully!");
    } catch (err) {
      setFormError(err.response?.data?.message || "Upload failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditStart = (file) => {
    setEditingId(file._id);
    setEditName(file.name);
    setEditComment(file.comment || "");
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditName("");
    setEditComment("");
  };

  const handleUpdate = async (id) => {
    if (!editName.trim()) {
      showToast.error("Name is required.");
      return;
    }
    setUpdatingId(id);
    try {
      const res = await updateFile(id, {
        name: editName.trim(),
        comment: editComment.trim(),
      });
      setFiles(files.map((f) => (f._id === id ? res.data.file : f)));
      setEditingId(null);
      showToast.success("File updated successfully!");
    } catch (err) {
      showToast.error(err.response?.data?.message || "Failed to update.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDownload = (url, filename) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const openShareModal = () => {
    setSelectedIds(files.map((f) => f._id));
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
      showToast.error("Select at least one file.");
      return;
    }
    setSharing(true);
    try {
      const res = await createFileShare(selectedIds);
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

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await deleteFile(id);
      const next = files.filter((f) => f._id !== id);
      setFiles(next);
      const nextFiltered = searchQuery.trim()
        ? next.filter(
            (f) =>
              f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              f.originalName.toLowerCase().includes(searchQuery.toLowerCase()),
          )
        : next;
      const newTotal = Math.max(1, Math.ceil(nextFiltered.length / PAGE_SIZE));
      if (currentPage > newTotal) setCurrentPage(newTotal);
      showToast.success("File deleted.");
    } catch (err) {
      showToast.error(err.response?.data?.message || "Failed to delete.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Heading */}
      <h1 className="text-3xl font-bold mb-2" style={{ color: "#212529" }}>
        My Files
      </h1>
      <p className="text-sm mb-8" style={{ color: "#6c757d" }}>
        Upload and access your files from anywhere.
      </p>

      {/* ── Upload Form ── */}
      <div
        className="rounded-2xl shadow-sm p-6 mb-10"
        style={{ backgroundColor: "#e9ecef" }}
      >
        <h2 className="text-lg font-semibold mb-4" style={{ color: "#212529" }}>
          Upload New File
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* File Name */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium" style={{ color: "#212529" }}>
              File Name <span style={{ color: "#dc3545" }}>*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Project Report"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border-0 outline-none text-sm focus:ring-2 focus:ring-[#adb5bd] transition"
              style={{ backgroundColor: "#dee2e6", color: "#212529" }}
            />
          </div>

          {/* Drag & Drop / File Picker */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium" style={{ color: "#212529" }}>
              File <span style={{ color: "#dc3545" }}>*</span>
              <span className="font-normal ml-1" style={{ color: "#6c757d" }}>
                (max 10 MB)
              </span>
            </label>
            <div
              className={`relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed py-8 px-4 cursor-pointer transition-colors ${dragOver ? "border-[#adb5bd] bg-[#dee2e6]" : "border-[#ced4da]"}`}
              style={{ backgroundColor: dragOver ? "#dee2e6" : "#d9dde1" }}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <span className="text-3xl">
                {selectedFile ? getFileIcon(selectedFile.type) : "☁️"}
              </span>
              {selectedFile ? (
                <div className="text-center">
                  <p
                    className="text-sm font-semibold truncate max-w-xs"
                    style={{ color: "#212529" }}
                  >
                    {selectedFile.name}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "#6c757d" }}>
                    {formatSize(selectedFile.size)}
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <p
                    className="text-sm font-medium"
                    style={{ color: "#495057" }}
                  >
                    Drag & drop a file here
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "#6c757d" }}>
                    or click to browse
                  </p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPTED}
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) pickFile(e.target.files[0]);
                }}
              />
            </div>
            {selectedFile && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="self-start text-xs underline underline-offset-2 hover:opacity-70 transition-opacity mt-1"
                style={{ color: "#6c757d" }}
              >
                Remove file
              </button>
            )}
          </div>

          {/* Comment */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium" style={{ color: "#212529" }}>
              Comment
            </label>
            <textarea
              placeholder="Optional note about this file"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={2}
              className="w-full px-4 py-2 rounded-lg border-0 outline-none text-sm focus:ring-2 focus:ring-[#adb5bd] transition resize-none"
              style={{ backgroundColor: "#dee2e6", color: "#212529" }}
            />
          </div>

          {/* Progress bar */}
          {submitting && (
            <div
              className="w-full rounded-full overflow-hidden h-2"
              style={{ backgroundColor: "#dee2e6" }}
            >
              <div
                className="h-2 rounded-full w-16"
                style={{
                  backgroundColor: "#6c757d",
                  animation: "slideLoop 1.1s linear infinite",
                }}
              />
            </div>
          )}

          {formError && (
            <p className="text-xs" style={{ color: "#dc3545" }}>
              {formError}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="self-start px-6 py-2 rounded-lg font-semibold text-sm text-white hover:opacity-85 transition-opacity disabled:opacity-50"
            style={{ backgroundColor: "#6c757d" }}
          >
            {submitting ? "Uploading..." : "Upload File"}
          </button>
        </form>
      </div>

      {/* Search Bar */}
      {!loading && files.length > 0 && (
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
            placeholder="Search by file name…"
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

      {/* ── Files List ── */}
      {loading ? (
        <LoadingSpinner fullPage text="Loading files..." />
      ) : files.length === 0 ? (
        <p className="text-sm text-center py-10" style={{ color: "#6c757d" }}>
          No files uploaded yet. Add your first one above!
        </p>
      ) : filteredFiles.length === 0 ? (
        <p className="text-sm text-center py-10" style={{ color: "#6c757d" }}>
          No files match your search.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {paginatedFiles.map((file) => (
            <div
              key={file._id}
              className="rounded-xl shadow-sm overflow-hidden"
              style={{ backgroundColor: "#e9ecef" }}
            >
              {editingId === file._id ? (
                /* ── Edit mode ── */
                <div className="flex flex-col gap-3 px-5 py-4">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="File name"
                    className="w-full px-3 py-2 rounded-lg border-0 outline-none text-sm focus:ring-2 focus:ring-[#adb5bd] transition"
                    style={{ backgroundColor: "#dee2e6", color: "#212529" }}
                  />
                  <textarea
                    value={editComment}
                    onChange={(e) => setEditComment(e.target.value)}
                    placeholder="Comment (optional)"
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg border-0 outline-none text-sm focus:ring-2 focus:ring-[#adb5bd] transition resize-none"
                    style={{ backgroundColor: "#dee2e6", color: "#212529" }}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdate(file._id)}
                      disabled={updatingId === file._id}
                      className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white hover:opacity-85 transition-opacity disabled:opacity-50"
                      style={{ backgroundColor: "#6c757d" }}
                    >
                      {updatingId === file._id ? "Saving..." : "Save"}
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
                  <div className="flex items-start gap-3 min-w-0">
                    <span className="text-2xl flex-shrink-0 mt-0.5">
                      {getFileIcon(file.mimeType)}
                    </span>
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <span
                        className="font-semibold text-sm truncate"
                        style={{ color: "#212529" }}
                      >
                        {file.name}
                      </span>
                      <span
                        className="text-xs truncate"
                        style={{ color: "#6c757d" }}
                      >
                        {file.originalName} · {formatSize(file.size)}
                      </span>
                      <button
                        onClick={() => setCommentModalFile(file)}
                        className="text-xs underline underline-offset-2 text-left w-fit hover:opacity-70 transition-opacity cursor-pointer mt-2"
                        style={{ color: "#6c757d" }}
                      >
                        Show Comment
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                    <button
                      onClick={() =>
                        handleDownload(file.url, file.originalName)
                      }
                      className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white hover:opacity-85 transition-opacity"
                      style={{ backgroundColor: "#adb5bd" }}
                    >
                      Download
                    </button>
                    <button
                      onClick={() => handleEditStart(file)}
                      className="px-4 py-1.5 rounded-lg text-xs font-semibold hover:opacity-85 transition-opacity"
                      style={{ backgroundColor: "#dee2e6", color: "#212529" }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(file._id)}
                      disabled={deletingId === file._id}
                      className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white hover:opacity-85 transition-opacity disabled:opacity-50"
                      style={{ backgroundColor: "#6c757d" }}
                    >
                      {deletingId === file._id ? "Deleting..." : "Delete"}
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
      {files.length > 0 && (
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
            Share My Files
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
                Share Files
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

            {!sharedUrl && (
              <>
                {/* Select All */}
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === files.length}
                    onChange={(e) =>
                      setSelectedIds(
                        e.target.checked ? files.map((f) => f._id) : [],
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

                {/* Files checklist */}
                <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1">
                  {files.map((file) => (
                    <label
                      key={file._id}
                      className="flex items-center gap-3 cursor-pointer select-none rounded-lg px-3 py-2 transition-colors hover:bg-[#e9ecef]"
                    >
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(file._id)}
                        onChange={() => toggleSelectId(file._id)}
                        className="w-4 h-4 flex-shrink-0 accent-[#6c757d]"
                      />
                      <div className="flex flex-col min-w-0">
                        <span
                          className="text-sm font-semibold truncate"
                          style={{ color: "#212529" }}
                        >
                          {file.name}
                        </span>
                        <span
                          className="text-xs truncate"
                          style={{ color: "#6c757d" }}
                        >
                          {file.originalName} · {formatSize(file.size)}
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
                    : `Done · ${selectedIds.length} file${selectedIds.length !== 1 ? "s" : ""} selected`}
                </button>
              </>
            )}

            {/* Generated URL */}
            {sharedUrl && (
              <div className="flex flex-col gap-3">
                <p className="text-sm" style={{ color: "#495057" }}>
                  ✅ Share link generated! Anyone with this link can view and
                  download your selected files.
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

      {/* ── Comment Modal ── */}
      {commentModalFile && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
          onClick={() => setCommentModalFile(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl shadow-xl p-6 relative"
            style={{ backgroundColor: "#f8f9fa" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setCommentModalFile(null)}
              className="absolute top-4 right-4 p-1 rounded-lg hover:opacity-70 transition-opacity"
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
            <div className="flex items-center gap-3 pr-6 mb-1">
              <span className="text-2xl">
                {getFileIcon(commentModalFile.mimeType)}
              </span>
              <h3
                className="text-base font-semibold truncate"
                style={{ color: "#212529" }}
              >
                {commentModalFile.name}
              </h3>
            </div>
            <p className="text-xs ml-9" style={{ color: "#6c757d" }}>
              {commentModalFile.originalName} ·{" "}
              {formatSize(commentModalFile.size)}
            </p>
            <hr className="my-4" style={{ borderColor: "#dee2e6" }} />
            <p
              className="text-sm font-medium mb-2"
              style={{ color: "#495057" }}
            >
              💬 Comment
            </p>
            {commentModalFile.comment ? (
              <p
                className="text-sm leading-relaxed whitespace-pre-wrap"
                style={{ color: "#212529" }}
              >
                {commentModalFile.comment}
              </p>
            ) : (
              <p className="text-sm italic" style={{ color: "#adb5bd" }}>
                No comment added for this file.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
