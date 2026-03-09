const express = require("express");
const router = express.Router();
const { authenticateToken, requireAdmin } = require("../middlewares/authMiddleware");
const { addUser } = require("../controllers/adminController");

router.use(authenticateToken, requireAdmin);

router.post("/add-user", addUser);

module.exports = router;
