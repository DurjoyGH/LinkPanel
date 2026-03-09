const mongoose = require("mongoose");

const shareSchema = new mongoose.Schema(
  {
    token: { type: String, required: true, unique: true },
    type: { type: String, enum: ["links", "files"], required: true },
    linkIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Link" }],
    fileIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "File" }],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

const Share = mongoose.model("Share", shareSchema);

module.exports = Share;
