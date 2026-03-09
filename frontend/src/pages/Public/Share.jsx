import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getShare } from "../../services/publicApi";
import LoadingSpinner from "../../components/Loading/LoadingSpinner";

const formatSize = (bytes) => {
  if (!bytes) return "";
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

export default function SharedLinks() {
  const { token } = useParams();
  const [type, setType] = useState(null);
  const [links, setLinks] = useState([]);
  const [files, setFiles] = useState([]);
  const [owner, setOwner] = useState("");
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    const fetchShare = async () => {
      try {
        const res = await getShare(token);
        setType(res.data.type);
        setOwner(res.data.owner);
        setLinks(res.data.links || []);
        setFiles(res.data.files || []);
      } catch (err) {
        if (err.response?.status === 404) setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchShare();
  }, [token]);

  const handleCopy = (link) => {
    navigator.clipboard.writeText(link.url).then(() => {
      setCopiedId(link._id);
      setTimeout(() => setCopiedId(null), 2000);
    });
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

  const items = type === "files" ? files : links;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {loading ? (
        <LoadingSpinner fullPage text="Loading shared collection..." />
      ) : notFound ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <span className="text-5xl">{type === "files" ? "📂" : "🔗"}</span>
          <h2 className="text-xl font-bold" style={{ color: "#212529" }}>
            Collection not found
          </h2>
          <p className="text-sm" style={{ color: "#6c757d" }}>
            This share link may be invalid or has been removed.
          </p>
          <Link
            to="/"
            className="px-5 py-2 rounded-xl font-semibold text-sm text-white hover:opacity-85 transition-opacity"
            style={{ backgroundColor: "#6c757d" }}
          >
            Go Home
          </Link>
        </div>
      ) : (
        <>
          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold" style={{ color: "#212529" }}>
              {owner}'s {type === "files" ? "Files" : "Links"}
            </h1>
            <p className="text-sm mt-1" style={{ color: "#6c757d" }}>
              {items.length} {type === "files" ? "file" : "link"}
              {items.length !== 1 ? "s" : ""} shared with you · view only
            </p>
          </div>

          {/* ── Files list ── */}
          {type === "files" && (
            <div className="flex flex-col gap-3">
              {files.map((file) => (
                <div
                  key={file._id}
                  className="rounded-xl shadow-sm px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                  style={{ backgroundColor: "#e9ecef" }}
                >
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
                      {file.comment && (
                        <span
                          className="text-xs mt-1 italic"
                          style={{ color: "#6c757d" }}
                        >
                          {file.comment}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownload(file.url, file.originalName)}
                    className="flex-shrink-0 px-4 py-1.5 rounded-lg text-xs font-semibold text-white hover:opacity-85 transition-opacity"
                    style={{ backgroundColor: "#adb5bd" }}
                  >
                    Download
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* ── Links list ── */}
          {type === "links" && (
            <div className="flex flex-col gap-3">
              {links.map((link) => (
                <div
                  key={link._id}
                  className="rounded-xl shadow-sm px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                  style={{ backgroundColor: "#e9ecef" }}
                >
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
                    {link.comment && (
                      <span
                        className="text-xs mt-1 italic"
                        style={{ color: "#6c757d" }}
                      >
                        {link.comment}
                      </span>
                    )}
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
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Join Now banner */}
          <div
            className="mt-12 rounded-2xl px-6 py-8 flex flex-col items-center gap-3 text-center shadow-sm"
            style={{ backgroundColor: "#e9ecef" }}
          >
            <span className="text-3xl">🔥</span>
            <h2 className="text-lg font-bold" style={{ color: "#212529" }}>
              Want to save and share your own{" "}
              {type === "files" ? "files" : "links"}?
            </h2>
            <p className="text-sm max-w-xs" style={{ color: "#6c757d" }}>
              Join LinkPanel and start organising your links and files from
              anywhere.
            </p>
            <button
              disabled
              title="Coming soon"
              className="mt-2 px-8 py-2.5 rounded-xl font-bold text-sm text-white cursor-not-allowed select-none"
              style={{
                backgroundColor: "#ff5722",
                animation:
                  "jerk 1.4s ease-in-out infinite, fireGlow 1.6s ease-in-out infinite",
                border: "none",
              }}
            >
              🔥 Join Now 🔥
            </button>
          </div>
        </>
      )}
    </div>
  );
}
