const Post = require("../models/post.model");
const UserLink = require("../models/userLink.model");

const getFeed = async (req, res) => {
  try {
    const { userId } = req.user;

    let users = await UserLink.find({ user: userId }).select("follows");
    users = users.map((user) => user.follows);

    const LIMIT = 3;
    let posts;
    if (req.query.cursor) {
      const bufferObj = Buffer.from(req.query.cursor, "base64");
      const cursor = bufferObj.toString("utf8");

      posts = await Post.find({
        $or: [{ user: { $in: users } }, { user: userId }],
        createdAt: { $lt: cursor },
      })
        .sort({ createdAt: "desc" })
        .limit(LIMIT)
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
    } else {
      posts = await Post.find({
        $or: [{ user: { $in: users } }, { user: userId }],
      })
        .sort({ createdAt: "desc" })
        .limit(LIMIT)
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
    }

    let next_cursor = posts[posts.length - 1]
      ? posts[posts.length - 1].time
      : false;
    let hasMore = false;

    if (next_cursor) {
      const tempPost = await Post.find({
        createdAt: {
          $lt: next_cursor,
        },
      });

      if (tempPost.length) {
        hasMore = true;
      }
    }

    if (next_cursor) {
      const bufferObj = Buffer.from(next_cursor.toString(), "utf8");
      next_cursor = bufferObj.toString("base64");
    }

    res.status(200).json({
      success: true,
      posts,
      next_cursor,
      hasMore,
      message: "Successfully provided paginated feed",
    });
  } catch (error) {
    console.log(error);
    res
      .status(404)
      .json({ success: false, message: "Failed to get paginated feed" });
  }
};

module.exports = { getFeed };
