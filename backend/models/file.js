const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    originalName: { type: String, required: true, trim: true },
    url: { type: String, required: true },
    storagePath: { type: String, required: true },
    format: { type: String, default: "" },
    size: { type: Number, required: true },
    mimeType: { type: String, required: true },
    comment: { type: String, trim: true, default: "" },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

const File = mongoose.model("File", fileSchema);

module.exports = File;
