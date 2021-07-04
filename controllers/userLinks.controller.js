const UserLink = require("../models/userLink.model");
const User = require("../models/user.model");

const createNewFollowerNotification = async (user, follows) => {
  try {
    const notification = {
      notificationType: "NEW FOLLOWER",
      time: new Date(),
      targetUser: follows,
      sourceUser: user,
    };
    Notification.create(notification);
  } catch (error) {
    console.log(error);
  }
};

const createUserConnection = async (req, res) => {
  try {
    const user = req.body.user;
    const follows = req.body.follows;
    const following = await UserLink.create({ user, follows });

    const sourceUser = await User.findById(user);
    const targetUser = await User.findById(follows);
    sourceUser.followingCount = sourceUser.followingCount + 1;
    targetUser.followerCount = targetUser.followerCount + 1;
    await sourceUser.save();
    await targetUser.save();

    createNewFollowerNotification(user, follows);

    res.status(201).json({
      success: true,
      following,
      message: "Successfully created following connection",
    });
  } catch (error) {
    console.log(error);
    res
      .status(404)
      .json({ success: false, message: "Failed to create connecton link" });
  }
};

const getUsersByTypeOfConnection = async (req, res) => {
  try {
    const userId = req.query.userId;
    const type = req.query.type;

    if (type === "following") {
      const followings = await UserLink.find({ user: userId })
        .select("follows")
        .populate("follows");

      res.status(200).json({
        success: true,
        followings,
        message: "Successfully returned following users list",
      });
    } else if (type === "follower") {
      const followers = await UserLink.find({ follows: userId })
        .select("user")
        .populate("user");

      res.status(200).json({
        success: true,
        followers,
        message: "Successfully returned followers list",
      });
    } else {
      res.status(400).json({ message: "Connection/Link type not found" });
      return;
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({
      success: false,
      message: "Failed to return followers/following users list",
    });
  }
};

const removeUserConnection = async (req, res) => {
  try {
    const linkId = req.params.linkId;
    const following = await UserLink.findByIdAndDelete(linkId);

    const sourceUser = await User.findById(following.user);
    const targetUser = await User.findById(following.follows);
    sourceUser.followingCount = sourceUser.followingCount - 1;
    targetUser.followerCount = targetUser.followerCount - 1;
    await sourceUser.save();
    await targetUser.save();

    res
      .status(201)
      .json({
        success: true,
        deleted: following._id,
        message: "Successfully unfollowed user",
      });
  } catch (error) {
    console.log(error);
    res
      .status(404)
      .json({ success: false, message: "Failed to unfollow user" });
  }
};

module.exports = {
  createUserConnection,
  getUsersByTypeOfConnection,
  removeUserConnection,
};
