import { useState, useEffect, useRef } from "react";
import {
  getFiles,
  uploadFile,
  updateFile,
  deleteFile,
} from "../../services/publicApi";
import showToast from "../../components/Toast/CustomToast";
import LoadingSpinner from "../../components/Loading/LoadingSpinner";

// ── Helpers ──────────────────────────────────────────────────────────────────
const formatSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const getFileIcon = (mimeType = "") => {
  if (mimeType.startsWith("image/")) return "🖼️";
  if (mimeType === "application/pdf") return "📄";
  if (mimeType.includes("word")) return "📝";
  if (mimeType.includes("excel") || mimeType.includes("spreadsheet")) return "📊";
  if (mimeType.includes("powerpoint") || mimeType.includes("presentation")) return "📑";
  if (mimeType.includes("zip")) return "🗜️";
  if (mimeType.startsWith("text/")) return "📃";
  return "📁";
};

// Inject Cloudinary's fl_attachment flag so the browser always downloads
// the file instead of opening it inline (critical for PDFs cross-origin).
const getDownloadUrl = (url) => url.replace("/upload/", "/upload/fl_attachment/");

const ACCEPTED =
  ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip," +
  ".jpg,.jpeg,.png,.gif,.webp,.svg";

// ── Component ─────────────────────────────────────────────────────────────────
export default function Files() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Upload form
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const fileInputRef = useRef(null);

  // Edit state
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editComment, setEditComment] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  // Delete state
  const [deletingId, setDeletingId] = useState(null);

  // Comment modal
  const [commentModalFile, setCommentModalFile] = useState(null);

  useEffect(() => { fetchFiles(); }, []);

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

  // ── Drag & drop ────────────────────────────────────────────────────────────
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

  // ── Upload ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) { setFormError("Please enter a file name."); return; }
    if (!selectedFile) { setFormError("Please select a file to upload."); return; }
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
      setName(""); setComment(""); setSelectedFile(null); setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = "";
      showToast.success("File uploaded successfully!");
    } catch (err) {
      setFormError(err.response?.data?.message || "Upload failed.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Edit ───────────────────────────────────────────────────────────────────
  const handleEditStart = (file) => {
    setEditingId(file._id);
    setEditName(file.name);
    setEditComment(file.comment || "");
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditName(""); setEditComment("");
  };

  const handleUpdate = async (id) => {
    if (!editName.trim()) { showToast.error("Name is required."); return; }
    setUpdatingId(id);
    try {
      const res = await updateFile(id, { name: editName.trim(), comment: editComment.trim() });
      setFiles(files.map((f) => (f._id === id ? res.data.file : f)));
      setEditingId(null);
      showToast.success("File updated successfully!");
    } catch (err) {
      showToast.error(err.response?.data?.message || "Failed to update.");
    } finally {
      setUpdatingId(null);
    }
  };

  // ── Download ────────────────────────────────────────────────────────────────
  const handleDownload = (url, filename) => {
    // Direct download using anchor tag - bypasses CORS issues
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.target = "_blank"; // Opens in new tab if download fails
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await deleteFile(id);
      setFiles(files.filter((f) => f._id !== id));
      showToast.success("File deleted.");
    } catch (err) {
      showToast.error(err.response?.data?.message || "Failed to delete.");
    } finally {
      setDeletingId(null);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Heading */}
      <h1 className="text-3xl font-bold mb-2" style={{ color: "#212529" }}>My Files</h1>
      <p className="text-sm mb-8" style={{ color: "#6c757d" }}>
        Upload and access your files from anywhere.
      </p>

      {/* ── Upload Form ── */}
      <div className="rounded-2xl shadow-sm p-6 mb-10" style={{ backgroundColor: "#e9ecef" }}>
        <h2 className="text-lg font-semibold mb-4" style={{ color: "#212529" }}>Upload New File</h2>
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
              <span className="font-normal ml-1" style={{ color: "#6c757d" }}>(max 10 MB)</span>
            </label>
            <div
              className={`relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed py-8 px-4 cursor-pointer transition-colors ${dragOver ? "border-[#adb5bd] bg-[#dee2e6]" : "border-[#ced4da]"}`}
              style={{ backgroundColor: dragOver ? "#dee2e6" : "#d9dde1" }}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <span className="text-3xl">{selectedFile ? getFileIcon(selectedFile.type) : "☁️"}</span>
              {selectedFile ? (
                <div className="text-center">
                  <p className="text-sm font-semibold truncate max-w-xs" style={{ color: "#212529" }}>
                    {selectedFile.name}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "#6c757d" }}>{formatSize(selectedFile.size)}</p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-sm font-medium" style={{ color: "#495057" }}>
                    Drag & drop a file here
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "#6c757d" }}>or click to browse</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPTED}
                className="hidden"
                onChange={(e) => { if (e.target.files?.[0]) pickFile(e.target.files[0]); }}
              />
            </div>
            {selectedFile && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setSelectedFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                className="self-start text-xs underline underline-offset-2 hover:opacity-70 transition-opacity mt-1"
                style={{ color: "#6c757d" }}
              >
                Remove file
              </button>
            )}
          </div>

          {/* Comment */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium" style={{ color: "#212529" }}>Comment</label>
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
          {submitting && uploadProgress > 0 && (
            <div className="w-full rounded-full overflow-hidden h-2" style={{ backgroundColor: "#dee2e6" }}>
              <div
                className="h-2 rounded-full transition-all duration-200"
                style={{ width: `${uploadProgress}%`, backgroundColor: "#6c757d" }}
              />
            </div>
          )}

          {formError && <p className="text-xs" style={{ color: "#dc3545" }}>{formError}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="self-start px-6 py-2 rounded-lg font-semibold text-sm text-white hover:opacity-85 transition-opacity disabled:opacity-50"
            style={{ backgroundColor: "#6c757d" }}
          >
            {submitting ? `Uploading${uploadProgress ? ` ${uploadProgress}%` : "…"}` : "Upload File"}
          </button>
        </form>
      </div>

      {/* ── Files List ── */}
      {loading ? (
        <LoadingSpinner fullPage text="Loading files..." />
      ) : files.length === 0 ? (
        <p className="text-sm text-center py-10" style={{ color: "#6c757d" }}>
          No files uploaded yet. Add your first one above!
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {files.map((file) => (
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
                    <span className="text-2xl flex-shrink-0 mt-0.5">{getFileIcon(file.mimeType)}</span>
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <span className="font-semibold text-sm truncate" style={{ color: "#212529" }}>
                        {file.name}
                      </span>
                      <span className="text-xs truncate" style={{ color: "#6c757d" }}>
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
                      onClick={() => handleDownload(getDownloadUrl(file.url), file.originalName)}
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
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <div className="flex items-center gap-3 pr-6 mb-1">
              <span className="text-2xl">{getFileIcon(commentModalFile.mimeType)}</span>
              <h3 className="text-base font-semibold truncate" style={{ color: "#212529" }}>
                {commentModalFile.name}
              </h3>
            </div>
            <p className="text-xs ml-9" style={{ color: "#6c757d" }}>
              {commentModalFile.originalName} · {formatSize(commentModalFile.size)}
            </p>
            <hr className="my-4" style={{ borderColor: "#dee2e6" }} />
            <p className="text-sm font-medium mb-2" style={{ color: "#495057" }}>💬 Comment</p>
            {commentModalFile.comment ? (
              <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "#212529" }}>
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
