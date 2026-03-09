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

router.use(authenticateToken);
router.post("/upload", upload.single("file"), uploadFile);
router.get("/", getFiles);
router.route("/:id").get(getFileById).put(updateFile).delete(deleteFile);

module.exports = router;
