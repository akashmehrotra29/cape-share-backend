const mongoose = require("mongoose");

const NotificationSchema = mongoose.Schema(
  {
    read: { type: Boolean, default: false },
    notificationType: {
      type: String,
      enum: ["NEW POST", "NEW FOLLOWER", "LIKE", "COMMENT"],
    },
    time: { type: Date },
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
    targetUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      populate: { select: "name username photo" },
    },
    sourceUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      populate: { select: "name username photo" },
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", NotificationSchema);

module.exports = Notification;
