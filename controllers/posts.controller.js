const Post = require("../models/post.model");
const UserLink = require("../models/userLink.model");
const Notification = require("../models/notification.model");

const createNewPostNotification = async (post, req) => {
  const { userId } = req.user;
  try {
    const notification = {
      notificationType: "NEW POST",
      post: post._id,
      time: new Date(),
      sourceUser: userId,
    };
    const followers = await UserLink.find({ follows: userId });
    const notifications = followers.map((follower) => ({
      ...notification,
      targetUser: follower.user,
    }));
    Notification.insertMany(notifications);
  } catch (error) {
    console.log(error);
  }
};

const createPost = async (req, res) => {
  const { userId } = req.user;
  try {
    let post = {
      user: userId,
      content: req.body.content,
      time: req.body.time,
    };
    if (req.body.media) {
      post.media = req.body.media;
    }
    post = await Post.create(post);
    post = await post.populate("user").execPopulate();

    createNewPostNotification(post, req);

    res.status(201).json({ success: true, post });
  } catch (error) {
    console.log(error);
    res.status(404).json({ success: false });
  }
};

const userPosts = async (req, res) => {
  try {
    const userId = req.query.userId;
    const posts = await Post.find({ user: userId })
      .sort({ time: "desc" })
      .populate({
        path: "likes",
        select: "name username photo bio",
        model: "User",
      })
      .populate({
        path: "comments.user",
        select: "name username photo bio",
        model: "User",
      })
      .populate("user");

    res.status(200).json({
      success: true,
      posts,
      message: "Successfully found all user posts by user Id",
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      success: false,
      message: "Failed to find user posts by user Id",
    });
  }
};

const createLikeNotification = async (post, userId) => {
  try {
    const notification = {
      notificationType: "LIKE",
      post: post._id,
      time: new Date(),
      targetUser: post.user,
      sourceUser: userId,
    };
    Notification.create(notification);
  } catch (error) {
    console.log(error);
  }
};

const likePost = async (req, res) => {
  try {
    const { userId } = req.user;
    const { postId } = req.params;
    let post = await Post.findById(postId);
    post.likes.push(userId);
    post = await post.save();

    post = await post
      .populate({
        path: "likes",
        select: "name username photo bio",
        model: "User",
      })
      .populate({
        path: "comments.user",
        select: "name username photo bio",
        model: "User",
      })
      .populate("user")
      .execPopulate();

    createLikeNotification(post, userId);

    res.status(201).json({
      success: true,
      post,
      message: "Successfully added like to post",
    });
  } catch (error) {
    console.log(error);
    res
      .status(404)
      .json({ success: false, message: "Failed to add like to post" });
  }
};

const unlikePost = async (req, res) => {
  try {
    const { userId } = req.user;
    const { postId } = req.params;
    let post = await Post.findById(postId);
    post.likes.pull(userId);
    await post.save();

    post = await post
      .populate({
        path: "likes",
        select: "name username photo bio",
        model: "User",
      })
      .populate({
        path: "comments.user",
        select: "name username photo bio",
        model: "User",
      })
      .populate("user")
      .execPopulate();

    res.status(200).json({
      success: true,
      post,
      message: "Successfully removed like from post",
    });
  } catch (error) {
    console.log(error);
    res
      .status(404)
      .json({ success: false, message: "Failed to remove like from post" });
  }
};

const createCommentNotification = async (post, userId) => {
  try {
    const notification = {
      notificationType: "COMMENT",
      post: post._id,
      time: new Date(),
      targetUser: post.user,
      sourceUser: userId,
    };
    Notification.create(notification);
  } catch (error) {
    console.log(error);
  }
};

const commentPost = async (req, res) => {
  try {
    const { userId } = req.user;
    const { postId } = req.params;
    console.log("from comment post");
    const comment = {
      user: userId,
      content: req.body.content,
      time: req.body.time,
    };
    let post = await Post.findById(postId);
    post.comments.push(comment);
    await post.save();

    post = await post
      .populate({
        path: "likes",
        select: "name username photo bio",
        model: "User",
      })
      .populate({
        path: "comments.user",
        select: "name username photo bio",
        model: "User",
      })
      .populate("user")
      .execPopulate();

    if (post.user._id !== userId) {
      createCommentNotification(post, userId);
    }

    res.status(201).json({
      success: true,
      post,
      message: "Successfully created comment on post",
    });
  } catch (error) {
    console.log(error);
    res
      .status(404)
      .json({ success: false, message: "Failed to create comment on post" });
  }
};

const uncommentPost = async (req, res) => {
  try {
    const { userId } = req.user;
    const { postId } = req.params;
    const { commentId } = req.params;
    let post = await Post.findById(postId);
    post.comments.pull({ _id: commentId });
    await post.save();

    post = await post
      .populate({
        path: "likes",
        select: "name username photo bio",
        model: "User",
      })
      .populate({
        path: "comments.user",
        select: "name username photo bio",
        model: "User",
      })
      .populate("user")
      .execPopulate();

    res.status(200).json({
      success: true,
      post,
      message: "Successfully removed comment from post",
    });
  } catch (error) {
    console.log(error);
    res
      .status(404)
      .json({ success: false, message: "Failed to remove comment from code" });
  }
};

module.exports = {
  createPost,
  userPosts,
  likePost,
  unlikePost,
  commentPost,
  uncommentPost,
};
