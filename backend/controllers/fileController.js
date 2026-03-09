const supabase = require("../configs/supabase");
const File = require("../models/file");

const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file provided." });
    }

    const { name, comment } = req.body;
    if (!name?.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "File name is required." });
    }

    // Build a unique storage path: userId/timestamp-originalname
    const sanitizedName = req.file.originalname.replace(
      /[^a-zA-Z0-9._-]/g,
      "_",
    );
    const storagePath = `${req.user._id}/${Date.now()}/${sanitizedName}`;
    const ext = req.file.originalname.split(".").pop().toLowerCase();

    console.log(
      `Uploading file: ${req.file.originalname}, size: ${req.file.size}, path: ${storagePath}`,
    );

    const { error: uploadError } = await supabase.storage
      .from(process.env.SUPABASE_BUCKET)
      .upload(storagePath, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false,
      });

    if (uploadError) {
      console.error("❌ Supabase upload error:", uploadError);
      return res
        .status(500)
        .json({ success: false, message: uploadError.message });
    }

    const {
      data: { publicUrl },
    } = supabase.storage
      .from(process.env.SUPABASE_BUCKET)
      .getPublicUrl(storagePath);

    console.log(`Supabase upload successful. Public URL: ${publicUrl}`);

    const file = await File.create({
      name: name.trim(),
      originalName: req.file.originalname,
      url: publicUrl,
      storagePath,
      format: ext,
      size: req.file.size,
      mimeType: req.file.mimetype,
      comment: comment?.trim() || "",
      createdBy: req.user._id,
    });

    console.log(`File saved to DB with ID: ${file._id}`);
    res
      .status(201)
      .json({ success: true, message: "File uploaded successfully.", file });
  } catch (error) {
    console.error("❌ Upload error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

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

const getFileById = async (req, res) => {
  try {
    const file = await File.findById(req.params.id).populate(
      "createdBy",
      "name email role",
    );

    if (!file) {
      return res
        .status(404)
        .json({ success: false, message: "File not found." });
    }

    if (
      req.user.role !== "admin" &&
      file.createdBy._id.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ success: false, message: "Access denied." });
    }

    res.status(200).json({ success: true, file });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res
        .status(404)
        .json({ success: false, message: "File not found." });
    }

    if (
      req.user.role !== "admin" &&
      file.createdBy._id.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ success: false, message: "Access denied." });
    }

    // Delete from Supabase Storage
    const { error: storageError } = await supabase.storage
      .from(process.env.SUPABASE_BUCKET)
      .remove([file.storagePath]);

    if (storageError) {
      console.error("❌ Supabase delete error:", storageError);
      return res
        .status(500)
        .json({ success: false, message: storageError.message });
    }

    await file.deleteOne();

    res
      .status(200)
      .json({ success: true, message: "File deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateFile = async (req, res) => {
  try {
    const { name, comment } = req.body;

    const file = await File.findById(req.params.id);

    if (!file) {
      return res
        .status(404)
        .json({ success: false, message: "File not found." });
    }

    if (
      req.user.role !== "admin" &&
      file.createdBy._id.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ success: false, message: "Access denied." });
    }

    if (name?.trim()) file.name = name.trim();
    if (comment !== undefined) file.comment = comment.trim();

    await file.save();

    res
      .status(200)
      .json({ success: true, message: "File updated successfully.", file });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { uploadFile, getFiles, getFileById, deleteFile, updateFile };
