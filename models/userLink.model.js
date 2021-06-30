const mongoose = require("mongoose");

const UserLinkSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      populate: { select: "_id name username photo bio" },
    },
    follows: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      populate: { select: "_id name username photo bio" },
    },
  },
  { timestamps: true }
);

UserLinkSchema.index({ user: 1, follows: 1 }, { unique: true });
const UserLink = mongoose.model("UserLink", UserLinkSchema);

module.exports = UserLink;
