const User = require("../models/user.model");
const UserLink = require("../models/userLink.model");
const mongoose = require("mongoose");

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

const getUserByIdWithFollowing = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    // console.log({ user });
    delete user.password;

    const userLink = await UserLink.findOne({
      user: req.user.userId,
      follows: userId,
    });
    if (userLink) {
      res.status(200).json({
        success: true,
        user,
        following: userLink,
        message: "Successfully got user and following list",
      });
      return;
    }

    res.status(200).json({
      success: true,
      user,
      following: userLink,
      message: "Successfully got user and following list",
    });
  } catch (error) {
    console.log(error);

    res.status(404).json({
      success: false,
      message: "Failed to get user and following list",
    });
  }
};

const getFollowSuggestions = async (req, res) => {
  try {
    let followedUsers = await UserLink.find({
      user: req.user.userId,
    }).select("follows");
    followedUsers = followedUsers.map((user) => user.follows);

    const notFollowedUsersCount = await User.find({
      _id: { $nin: followedUsers },
    }).countDocuments();
    const max = notFollowedUsersCount - 3 > 0 ? notFollowedUsersCount - 3 : 0;
    const startIndex = Math.floor(Math.random() * max);
    const users = await User.find({
      _id: { $nin: [...followedUsers, req.user.userId] },
    })
      .limit(3)
      .skip(startIndex)
      .select("name photo username");
    res.status(200).json({
      success: true,
      users,
      message: "Successfully provided follow suggestions",
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      success: false,
      message: "Failed to provide follow suggestions",
    });
  }
};

module.exports = { getUser, getUserByIdWithFollowing, getFollowSuggestions };
