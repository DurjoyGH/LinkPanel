const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middlewares/authMiddleware");
const {
  createLink,
  getLinks,
  getLinkById,
  updateLink,
  deleteLink,
} = require("../controllers/linkController");

// All link routes require authentication
router.use(authenticateToken);

// POST   /api/links       — Create a link
// GET    /api/links       — Get all links (admin: all, user: own)
router.route("/").post(createLink).get(getLinks);

// GET    /api/links/:id   — Get single link
// PUT    /api/links/:id   — Update link
// DELETE /api/links/:id   — Delete link
router.route("/:id").get(getLinkById).put(updateLink).delete(deleteLink);

module.exports = router;
