import { useState, useRef } from "react";

const fileIcons = {
  pdf: "📄",
  doc: "📝",
  docx: "📝",
  xls: "📊",
  xlsx: "📊",
  ppt: "📋",
  pptx: "📋",
  jpg: "🖼️",
  jpeg: "🖼️",
  png: "🖼️",
  gif: "🖼️",
  zip: "🗜️",
  rar: "🗜️",
  txt: "📃",
  mp4: "🎬",
  mp3: "🎵",
};

const getIcon = (filename) => {
  const ext = filename.split(".").pop().toLowerCase();
  return fileIcons[ext] || "📁";
};

const formatSize = (bytes) => {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
};

const demoFiles = [
  { id: 1, name: "Project_Proposal.pdf", size: 204800, uploadedAt: "2026-03-01" },
  { id: 2, name: "Budget_2026.xlsx", size: 51200, uploadedAt: "2026-03-02" },
  { id: 3, name: "Meeting_Notes.docx", size: 30720, uploadedAt: "2026-03-02" },
  { id: 4, name: "Presentation.pptx", size: 1048576, uploadedAt: "2026-03-03" },
  { id: 5, name: "Logo.png", size: 92160, uploadedAt: "2026-03-03" },
];

export default function Files() {
  const [files, setFiles] = useState(demoFiles);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef();

  const addFiles = (newFiles) => {
    const mapped = Array.from(newFiles).map((f) => ({
      id: Date.now() + Math.random(),
      name: f.name,
      size: f.size,
      uploadedAt: new Date().toISOString().split("T")[0],
      fileObj: f,
    }));
    setFiles((prev) => [...mapped, ...prev]);
  };

  const handleFileInput = (e) => {
    if (e.target.files.length) addFiles(e.target.files);
    e.target.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
  };

  const handleDelete = (id) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleDownload = (file) => {
    if (file.fileObj) {
      const url = URL.createObjectURL(file.fileObj);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      alert("Demo file — download will work with real API data.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Heading */}
      <h1 className="text-3xl font-bold mb-2" style={{ color: "#212529" }}>
        My Files
      </h1>
      <p className="text-sm mb-8" style={{ color: "#6c757d" }}>
        Upload and download your files from anywhere.
      </p>

      {/* Upload Area */}
      <div
        className={`rounded-2xl border-2 border-dashed p-10 mb-10 flex flex-col items-center justify-center gap-4 cursor-pointer transition-colors ${
          dragOver ? "border-[#6c757d] bg-[#dee2e6]" : "border-[#adb5bd] bg-[#e9ecef]"
        }`}
        onClick={() => inputRef.current.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <span className="text-4xl">☁️</span>
        <p className="text-sm font-medium text-center" style={{ color: "#212529" }}>
          Drag &amp; drop files here, or{" "}
          <span className="underline cursor-pointer" style={{ color: "#6c757d" }}>
            browse
          </span>
        </p>
        <p className="text-xs" style={{ color: "#6c757d" }}>
          Supports PDF, Word, Excel, PPT, images, ZIP and more
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileInput}
        />
      </div>

      {/* Files List */}
      {files.length === 0 ? (
        <p className="text-sm text-center py-10" style={{ color: "#6c757d" }}>
          No files uploaded yet.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between gap-4 rounded-xl px-5 py-4 shadow-sm"
              style={{ backgroundColor: "#e9ecef" }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-2xl flex-shrink-0">{getIcon(file.name)}</span>
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="font-semibold text-sm truncate" style={{ color: "#212529" }}>
                    {file.name}
                  </span>
                  <span className="text-xs" style={{ color: "#6c757d" }}>
                    {formatSize(file.size)} &middot; {file.uploadedAt}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <button
                  onClick={() => handleDownload(file)}
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white hover:opacity-85 transition-opacity"
                  style={{ backgroundColor: "#adb5bd" }}
                >
                  Download
                </button>
                <button
                  onClick={() => handleDelete(file.id)}
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white hover:opacity-85 transition-opacity"
                  style={{ backgroundColor: "#6c757d" }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
