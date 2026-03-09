const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middlewares/authMiddleware");
const { createShare, getShare } = require("../controllers/shareController");

router.post("/", authenticateToken, createShare);
router.get("/:token", getShare);

module.exports = router;
