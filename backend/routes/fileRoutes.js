const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/multerMiddleware");
const {
  uploadFile,
  getFiles,
  getFileById,
  deleteFile,
  updateFile,
} = require("../controllers/fileController");

// All file routes require authentication
router.use(authenticateToken);

// POST  /api/files/upload  — Upload a new file
router.post("/upload", upload.single("file"), uploadFile);

// GET   /api/files         — Get all files for the logged-in user
router.get("/", getFiles);

// GET   /api/files/:id     — Get a single file
// PUT   /api/files/:id     — Update file name / comment
// DELETE /api/files/:id   — Delete file (cloudinary + DB)
router.route("/:id").get(getFileById).put(updateFile).delete(deleteFile);

module.exports = router;
