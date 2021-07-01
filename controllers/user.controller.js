const User = require("../models/user.model");

const getUser = async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await User.findById(userId);

    res
      .status(200)
      .json({ success: true, user, message: "User data fetched successfully" });
  } catch (error) {
    res.status(404).json({ success: false, message: "Failed to get user" });
  }
};

module.exports = { getUser };
