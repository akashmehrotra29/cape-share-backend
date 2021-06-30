const Post = require("../models/post.model");

const createNewPostNotification = async (post, req) => {
  // const {userId} = req.decodedToken.data
  const userId = 123;
  try {
    const notification = {
      notificationType: "NEW POST",
      post: post._id,
      time: new Date(),
      sourceUser: userId,
    };
    const followers = await userLink.find({ follows: userId });
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
  // const {userId} = req.decodedToken.data
  const userId = 123;
  try {
    const post = {
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

module.exports = { createPost };
