const express = require("express");
const { login, getMe, changePassword } = require("../controllers/authController");
const { authenticateToken } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/login", login);
router.get("/me", authenticateToken, getMe);
router.put("/change-password", authenticateToken, changePassword);

module.exports = router;
