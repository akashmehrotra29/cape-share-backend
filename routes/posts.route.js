const express = require("express");
const router = express.Router();

const {
  createPost,
  userPosts,
  likePost,
  unlikePost,
  commentPost,
  uncommentPost,
} = require("../controllers/posts.controller");

router.route("/").get(userPosts).post(createPost);

router.route("/:postId/likes").post(likePost).delete(unlikePost);

router.route("/:postId/comment").post(commentPost);

router.route("/:postId/comment/:commentId").delete(uncommentPost);

module.exports = router;
