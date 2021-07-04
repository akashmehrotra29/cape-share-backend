const Notification = require("../models/notification.model");

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      targetUser: req.user.userId,
    })
      .sort({ time: "desc" })
      .populate("sourceUser");

    res.status(201).json({
      success: true,
      notifications,
      message: "Successfully returned all notifications for loggedIn user",
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      success: false,
      message: "Failed to get notifications for loggedIn user",
    });
  }
};

module.exports = { getNotifications };
