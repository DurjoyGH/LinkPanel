const crypto = require("crypto");
const Share = require("../models/share");

const createShare = async (req, res) => {
  try {
    const { linkIds } = req.body;

    if (!Array.isArray(linkIds) || linkIds.length === 0) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Select at least one link to share.",
        });
    }

    const token = crypto.randomBytes(16).toString("hex");

    const share = await Share.create({
      token,
      linkIds,
      createdBy: req.user._id,
    });

    res.status(201).json({ success: true, token: share.token });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getShare = async (req, res) => {
  try {
    const share = await Share.findOne({ token: req.params.token })
      .populate({ path: "linkIds", select: "name url comment" })
      .populate("createdBy", "name");

    if (!share) {
      return res
        .status(404)
        .json({ success: false, message: "Shared collection not found." });
    }

    res.status(200).json({
      success: true,
      owner: share.createdBy.name,
      links: share.linkIds,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createShare, getShare };
