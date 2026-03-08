/**
 * LoadingSpinner — project-themed spinner
 *
 * Props:
 *   size      "sm" | "md" | "lg"   default "md"
 *   text      string                optional label below the ring
 *   fullPage  bool                  centres spinner in a tall flex area
 *   className string                extra classes on the outermost element
 */
export default function LoadingSpinner({
  size = "md",
  text,
  fullPage = false,
  className = "",
}) {
  const ringSize = {
    sm: "w-5 h-5 border-2",
    md: "w-9 h-9 border-[3px]",
    lg: "w-14 h-14 border-4",
  }[size];

  const ring = (
    <div
      className={`rounded-full animate-spin flex-shrink-0 ${ringSize}`}
      style={{ borderColor: "#dee2e6", borderTopColor: "#6c757d" }}
    />
  );

  /* bare ring only — safe to drop inside buttons / inline contexts */
  if (!text && !fullPage) {
    return <div className={className}>{ring}</div>;
  }

  const inner = (
    <div className="flex flex-col items-center justify-center gap-3">
      {ring}
      {text && (
        <p className="text-sm font-medium" style={{ color: "#6c757d" }}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className={`flex items-center justify-center py-24 ${className}`}>
        {inner}
      </div>
    );
  }

  return <div className={className}>{inner}</div>;
}
