const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },        // user-given label
    originalName: { type: String, required: true, trim: true }, // original filename
    url: { type: String, required: true },                      // cloudinary secure_url
    publicId: { type: String, required: true },                 // cloudinary public_id
    resourceType: { type: String, required: true },             // image | raw | video
    format: { type: String, default: "" },                      // e.g. pdf, xlsx, jpg
    size: { type: Number, required: true },                     // bytes
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
