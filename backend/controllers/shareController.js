const crypto = require("crypto");
const Share = require("../models/share");

const createShare = async (req, res) => {
  try {
    const { linkIds, fileIds } = req.body;

    const isLinks = Array.isArray(linkIds) && linkIds.length > 0;
    const isFiles = Array.isArray(fileIds) && fileIds.length > 0;

    if (!isLinks && !isFiles) {
      return res.status(400).json({
        success: false,
        message: "Select at least one item to share.",
      });
    }

    const token = crypto.randomBytes(16).toString("hex");

    const share = await Share.create({
      token,
      type: isFiles ? "files" : "links",
      linkIds: isLinks ? linkIds : [],
      fileIds: isFiles ? fileIds : [],
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
      .populate({
        path: "fileIds",
        select: "name originalName url mimeType size comment",
      })
      .populate("createdBy", "name");

    if (!share) {
      return res
        .status(404)
        .json({ success: false, message: "Shared collection not found." });
    }

    res.status(200).json({
      success: true,
      type: share.type,
      owner: share.createdBy.name,
      links: share.linkIds,
      files: share.fileIds,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createShare, getShare };
