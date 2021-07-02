const express = require("express");
const router = express.Router();

const { createPost, userPosts } = require("../controllers/posts.controller");

router.route("/").get(userPosts).post(createPost);

module.exports = router;
