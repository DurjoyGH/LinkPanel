import toast from "react-hot-toast";

const base = {
  background: "#e9ecef",
  color: "#212529",
  fontFamily: "monospace",
  fontSize: "0.875rem",
  borderRadius: "0.75rem",
  padding: "12px 16px",
  boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
};

/* ── icons ── */
const SuccessIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6c757d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ErrorIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#dc3545" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const LoadingIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#adb5bd" strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink: 0, animation: "spin 0.8s linear infinite" }}>
    <path d="M12 2a10 10 0 1 0 10 10" />
  </svg>
);

const CloseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

/* ── shared toast renderer ── */
const renderToast = (t, message, icon, borderColor) => (
  <div
    style={{
      ...base,
      borderLeft: `4px solid ${borderColor}`,
      display: "flex",
      alignItems: "center",
      gap: "10px",
      opacity: t.visible ? 1 : 0,
      transition: "opacity 0.2s ease",
      maxWidth: "360px",
      width: "100%",
    }}
  >
    {icon}
    <span style={{ flex: 1, lineHeight: 1.4 }}>{message}</span>
    <button
      onClick={() => toast.dismiss(t.id)}
      aria-label="Dismiss"
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: "2px",
        color: "#adb5bd",
        display: "flex",
        alignItems: "center",
        flexShrink: 0,
        borderRadius: "4px",
        transition: "color 0.15s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.color = "#6c757d")}
      onMouseLeave={(e) => (e.currentTarget.style.color = "#adb5bd")}
    >
      <CloseIcon />
    </button>
  </div>
);

const showToast = {
  success: (message, opts = {}) =>
    toast.custom(
      (t) => renderToast(t, message, <SuccessIcon />, "#6c757d"),
      { duration: 3000, ...opts }
    ),

  error: (message, opts = {}) =>
    toast.custom(
      (t) => renderToast(t, message, <ErrorIcon />, "#dc3545"),
      { duration: 4000, ...opts }
    ),

  loading: (message, opts = {}) =>
    toast.custom(
      (t) => renderToast(t, message, <LoadingIcon />, "#adb5bd"),
      { duration: Infinity, ...opts }
    ),

  dismiss: (id) => toast.dismiss(id),

  promise: (promise, messages, opts = {}) =>
    toast.promise(
      promise,
      {
        loading: messages.loading ?? "Loading...",
        success: messages.success ?? "Done!",
        error: messages.error ?? "Something went wrong.",
      },
      {
        style: base,
        success: {
          style: { ...base, borderLeft: "4px solid #6c757d" },
          iconTheme: { primary: "#6c757d", secondary: "#e9ecef" },
        },
        error: {
          style: { ...base, borderLeft: "4px solid #dc3545" },
          iconTheme: { primary: "#dc3545", secondary: "#e9ecef" },
        },
        ...opts,
      }
    ),
};

export default showToast;
