require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const linkRoutes = require("./routes/linkRoutes");
const fileRoutes = require("./routes/fileRoutes");

const app = express();

// --- Allowed origins ---
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:3000",
  "https://link-panel-silk.vercel.app",
  "https://link-panel-backend.vercel.app",
  "https://link-panel-backend.vercel.app/api"
];

// --- CORS Middleware ---
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      console.log("Blocked CORS origin:", origin);
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
    ],
    optionsSuccessStatus: 204,
  }),
);

app.use(express.json());

// --- Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/links", linkRoutes);
app.use("/api/files", fileRoutes);


app.get("/", (req, res) => {
    res.send("API is Running!")
})

// --- Global Error Handler ---
app.use((err, req, res, next) => {
  // Handle Multer-specific errors
  if (err.name === "MulterError") {
    const msg = err.code === "LIMIT_FILE_SIZE"
      ? "File is too large. Maximum allowed size is 10 MB."
      : err.message;
    return res.status(400).json({ success: false, message: msg });
  }

  // Handle file-type rejection from fileFilter
  if (err.message?.startsWith("File type")) {
    return res.status(400).json({ success: false, message: err.message });
  }

  console.error("Error occurred:", {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    body: req.body,
    timestamp: new Date().toISOString(),
  });

  const statusCode =
    err.statusCode || res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    error:
      process.env.NODE_ENV === "production"
        ? "Something went wrong"
        : err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

module.exports = app;
