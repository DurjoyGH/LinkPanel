const express = require("express");
const router = express.Router();
const { authenticateToken, requireAdmin } = require("../middlewares/authMiddleware");
const { addUser } = require("../controllers/adminController");

// All admin routes require a valid token + admin role
router.use(authenticateToken, requireAdmin);

// POST /api/admin/add-user
router.post("/add-user", addUser);

module.exports = router;
