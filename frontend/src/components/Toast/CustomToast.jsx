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

const showToast = {
  success: (message, opts = {}) =>
    toast.success(message, {
      style: { ...base, borderLeft: "4px solid #6c757d" },
      iconTheme: { primary: "#6c757d", secondary: "#e9ecef" },
      duration: 3000,
      ...opts,
    }),

  error: (message, opts = {}) =>
    toast.error(message, {
      style: { ...base, borderLeft: "4px solid #dc3545" },
      iconTheme: { primary: "#dc3545", secondary: "#e9ecef" },
      duration: 4000,
      ...opts,
    }),

  loading: (message, opts = {}) =>
    toast.loading(message, {
      style: { ...base, borderLeft: "4px solid #adb5bd" },
      iconTheme: { primary: "#adb5bd", secondary: "#e9ecef" },
      ...opts,
    }),

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
