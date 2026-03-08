const Link = require("../models/link");

// POST /api/links — Create a new link
const createLink = async (req, res) => {
  try {
    const { name, url, comment } = req.body;

    if (!name || !url) {
      return res.status(400).json({ success: false, message: "Name and URL are required." });
    }

    const link = await Link.create({ name, url, comment: comment?.trim() || "", createdBy: req.user._id });

    res.status(201).json({ success: true, message: "Link created successfully.", link });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/links — Get links
const getLinks = async (req, res) => {
  try {
   const filter = { createdBy: req.user._id };

    const links = await Link.find(filter)
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: links.length, links });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/links/:id — Get a single link
const getLinkById = async (req, res) => {
  try {
    const link = await Link.findById(req.params.id).populate("createdBy", "name email role");

    if (!link) {
      return res.status(404).json({ success: false, message: "Link not found." });
    }

    // Only owner or admin can view
    if (req.user.role !== "admin" && link.createdBy._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Access denied." });
    }

    res.status(200).json({ success: true, link });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/links/:id — Update a link (owner or admin)
const updateLink = async (req, res) => {
  try {
    const { name, url, comment } = req.body;

    const link = await Link.findById(req.params.id);

    if (!link) {
      return res.status(404).json({ success: false, message: "Link not found." });
    }

    // Only owner or admin can update
    if (req.user.role !== "admin" && link.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Access denied." });
    }

    if (name) link.name = name;
    if (url) link.url = url;
    if (comment !== undefined) link.comment = comment.trim();

    await link.save();

    res.status(200).json({ success: true, message: "Link updated successfully.", link });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/links/:id — Delete a link (owner or admin)
const deleteLink = async (req, res) => {
  try {
    const link = await Link.findById(req.params.id);

    if (!link) {
      return res.status(404).json({ success: false, message: "Link not found." });
    }

    // Only owner or admin can delete
    if (req.user.role !== "admin" && link.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Access denied." });
    }

    await link.deleteOne();

    res.status(200).json({ success: true, message: "Link deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createLink, getLinks, getLinkById, updateLink, deleteLink };
