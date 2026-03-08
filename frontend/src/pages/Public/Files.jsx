export default function Files() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Heading */}
      <h1 className="text-3xl font-bold mb-2" style={{ color: "#212529" }}>
        My Files
      </h1>
      <p className="text-sm mb-8" style={{ color: "#6c757d" }}>
        Upload and download your files from anywhere.
      </p>

      {/* Coming Soon */}
      <div className="rounded-2xl shadow-sm flex flex-col items-center justify-center gap-4 py-20" style={{ backgroundColor: "#e9ecef" }}>
        <span className="text-5xl">🚧</span>
        <h2 className="text-xl font-bold" style={{ color: "#212529" }}>Feature Coming Soon</h2>
        <p className="text-sm text-center max-w-xs" style={{ color: "#6c757d" }}>
          File upload and management is under development. Stay tuned!
        </p>
      </div>

    </div>
  );
}
