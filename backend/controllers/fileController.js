const cloudinary = require("../configs/cloudinary");
const File = require("../models/file");

// ── Helper: upload buffer → Cloudinary ──────────────────────────────────────
const uploadToCloudinary = (buffer, options) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
    stream.end(buffer);
  });

// ── POST /api/files/upload ───────────────────────────────────────────────────
const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file provided." });
    }

    const { name, comment } = req.body;
    if (!name?.trim()) {
      return res.status(400).json({ success: false, message: "File name is required." });
    }

    const isImage = req.file.mimetype.startsWith("image/");
    const resourceType = isImage ? "image" : "raw";

    const result = await uploadToCloudinary(req.file.buffer, {
      resource_type: resourceType,
      folder: "LinkPanel Files",
      use_filename: true,
      unique_filename: true,
    });

    const file = await File.create({
      name: name.trim(),
      originalName: req.file.originalname,
      url: result.secure_url,
      publicId: result.public_id,
      resourceType: result.resource_type,
      format: result.format || "",
      size: req.file.size,
      mimeType: req.file.mimetype,
      comment: comment?.trim() || "",
      createdBy: req.user._id,
    });

    res.status(201).json({ success: true, message: "File uploaded successfully.", file });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── GET /api/files ───────────────────────────────────────────────────────────
const getFiles = async (req, res) => {
  try {
    const files = await File.find({ createdBy: req.user._id })
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: files.length, files });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── GET /api/files/:id ───────────────────────────────────────────────────────
const getFileById = async (req, res) => {
  try {
    const file = await File.findById(req.params.id).populate("createdBy", "name email role");

    if (!file) {
      return res.status(404).json({ success: false, message: "File not found." });
    }

    if (req.user.role !== "admin" && file.createdBy._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Access denied." });
    }

    res.status(200).json({ success: true, file });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── DELETE /api/files/:id ────────────────────────────────────────────────────
const deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ success: false, message: "File not found." });
    }

    if (req.user.role !== "admin" && file.createdBy._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Access denied." });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(file.publicId, { resource_type: file.resourceType });

    await file.deleteOne();

    res.status(200).json({ success: true, message: "File deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── PUT /api/files/:id ───────────────────────────────────────────────────────
const updateFile = async (req, res) => {
  try {
    const { name, comment } = req.body;

    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ success: false, message: "File not found." });
    }

    if (req.user.role !== "admin" && file.createdBy._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Access denied." });
    }

    if (name?.trim()) file.name = name.trim();
    if (comment !== undefined) file.comment = comment.trim();

    await file.save();

    res.status(200).json({ success: true, message: "File updated successfully.", file });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { uploadFile, getFiles, getFileById, deleteFile, updateFile };
