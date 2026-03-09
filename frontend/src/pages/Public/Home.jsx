import { Link } from "react-router-dom";

const features = [
  {
    icon: "🔗",
    title: "Save Links",
    desc: "Paste any URL and store it securely. Access all your important links from a single place, no matter where you are.",
  },
  {
    icon: "📂",
    title: "Store Files",
    desc: "Upload documents, PDFs, spreadsheets, images and more. Your files are always ready to download remotely.",
  },
  {
    icon: "🌍",
    title: "Access Remotely",
    desc: "Everything you save is accessible from any device, anywhere in the world. No more emailing files to yourself.",
  },
  {
    icon: "⚡",
    title: "Instant Access",
    desc: "Lightning-fast interface built for speed. Open, manage and share your content without any friction.",
  },
  {
    icon: "🔒",
    title: "Secure Storage",
    desc: "Your data is protected behind secure authentication. Only you can see and manage your saved content.",
  },
  {
    icon: "🖥️",
    title: "Clean Interface",
    desc: "A minimal, distraction-free dashboard so you can focus on what matters — your content.",
  },
];

const steps = [
  {
    step: "01",
    title: "Create an account",
    desc: "Sign up in seconds with just your email.",
  },
  {
    step: "02",
    title: "Save your content",
    desc: "Paste links or upload files from any device.",
  },
  {
    step: "03",
    title: "Access anywhere",
    desc: "Open your panel remotely and grab what you need.",
  },
];

export default function Home() {
  return (
    <div className="w-full">
      {/* ── Hero ── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center text-center gap-6">
        <span
          className="text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full animate-fade-in"
          style={{ backgroundColor: "#e9ecef", color: "#6c757d" }}
        >
          Your personal link &amp; file panel
        </span>

        <h1
          className="text-2xl sm:text-5xl lg:text-6xl font-bold leading-tight animate-fade-up"
          style={{ color: "#212529" }}
        >
          <span className="typing-text">Paste. Store. Access.</span>
        </h1>

        <p
          className="text-base sm:text-lg max-w-xl leading-relaxed animate-fade-up-delay-1"
          style={{ color: "#6c757d" }}
        >
          LinkPanel lets you save links and files in one place and access them
          remotely from any device — instantly.
        </p>

        <div className="flex flex-wrap justify-center gap-4 animate-fade-up-delay-2">
          <Link
            to="/links"
            className="px-7 py-3 rounded-xl font-semibold text-sm text-white hover:opacity-85 transition-opacity shadow-sm"
            style={{ backgroundColor: "#6c757d" }}
          >
            My Links
          </Link>
          <Link
            to="/files"
            className="px-7 py-3 rounded-xl font-semibold text-sm hover:opacity-80 transition-opacity shadow-sm"
            style={{ backgroundColor: "#e9ecef", color: "#212529" }}
          >
            My Files
          </Link>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="h-px" style={{ backgroundColor: "#dee2e6" }} />
      </div>

      {/* ── Features ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12 animate-fade-up">
          <h2 className="text-3xl font-bold mb-3" style={{ color: "#212529" }}>
            Everything you need
          </h2>
          <p className="text-sm" style={{ color: "#6c757d" }}>
            A lightweight panel built for remote access to your own content.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <div
              key={i}
              className="group rounded-2xl p-6 shadow-sm cursor-default transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md"
              style={{ backgroundColor: "#e9ecef" }}
            >
              <span className="text-3xl mb-4 block group-hover:scale-110 transition-transform duration-300">
                {f.icon}
              </span>
              <h3
                className="font-semibold text-base mb-2 group-hover:underline underline-offset-4 transition-all"
                style={{ color: "#212529" }}
              >
                {f.title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "#6c757d" }}
              >
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="h-px" style={{ backgroundColor: "#dee2e6" }} />
      </div>

      {/* ── How it works ── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12 animate-fade-up">
          <h2 className="text-3xl font-bold mb-3" style={{ color: "#212529" }}>
            How it works
          </h2>
          <p className="text-sm" style={{ color: "#6c757d" }}>
            Get started in three simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center gap-3 animate-fade-up"
            >
              <span className="text-4xl font-bold" style={{ color: "#adb5bd" }}>
                {s.step}
              </span>
              <h4
                className="font-semibold text-base"
                style={{ color: "#212529" }}
              >
                {s.title}
              </h4>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "#6c757d" }}
              >
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="h-px" style={{ backgroundColor: "#dee2e6" }} />
      </div>

      {/* ── CTA Banner ── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center text-center gap-6">
        <h2
          className="text-3xl sm:text-4xl font-bold animate-fade-up"
          style={{ color: "#212529" }}
        >
          Ready to get started?
        </h2>
        <p
          className="text-sm max-w-md leading-relaxed animate-fade-up-delay-1"
          style={{ color: "#6c757d" }}
        >
          Join LinkPanel and keep all your links and files at your fingertips —
          anywhere, anytime.
        </p>
        <Link
          to="/login"
          className="animate-fade-up-delay-2 px-8 py-3 rounded-xl font-semibold text-sm text-white hover:opacity-85 transition-opacity shadow-sm"
          style={{ backgroundColor: "#6c757d" }}
        >
          Get Started &rarr;
        </Link>
      </section>
    </div>
  );
}
