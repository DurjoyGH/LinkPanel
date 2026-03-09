import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getShare } from "../../services/publicApi";
import LoadingSpinner from "../../components/Loading/LoadingSpinner";

export default function SharedLinks() {
  const { token } = useParams();
  const [links, setLinks] = useState([]);
  const [owner, setOwner] = useState("");
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    const fetchShare = async () => {
      try {
        const res = await getShare(token);
        setOwner(res.data.owner);
        setLinks(res.data.links);
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

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {loading ? (
        <LoadingSpinner fullPage text="Loading shared links..." />
      ) : notFound ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <span className="text-5xl">🔗</span>
          <h2 className="text-xl font-bold" style={{ color: "#212529" }}>
            Link collection not found
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
              {owner}'s Links
            </h1>
            <p className="text-sm mt-1" style={{ color: "#6c757d" }}>
              {links.length} link{links.length !== 1 ? "s" : ""} shared with you
              · view only
            </p>
          </div>

          {/* Links list */}
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
                  {/* Copy */}
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
                  {/* Open */}
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

          {/* Join Now banner */}
          <div
            className="mt-12 rounded-2xl px-6 py-8 flex flex-col items-center gap-3 text-center shadow-sm"
            style={{ backgroundColor: "#e9ecef" }}
          >
            <span className="text-3xl">�</span>
            <h2 className="text-lg font-bold" style={{ color: "#212529" }}>
              Want to save and share your own links?
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
                animation: "jerk 1.4s ease-in-out infinite, fireGlow 1.6s ease-in-out infinite",
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
