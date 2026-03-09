const mongoose = require("mongoose");

const shareSchema = new mongoose.Schema(
  {
    token: { type: String, required: true, unique: true },
    linkIds: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Link", required: true },
    ],
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
