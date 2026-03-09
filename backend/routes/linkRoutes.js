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

router.use(authenticateToken);
router.route("/").post(createLink).get(getLinks);
router.route("/:id").get(getLinkById).put(updateLink).delete(deleteLink);

module.exports = router;
