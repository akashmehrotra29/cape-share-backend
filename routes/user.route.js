const express = require("express");
const router = express.Router();

const {
  getUser,
  getUserByIdWithFollowing,
  getFollowSuggestions,
} = require("../controllers/user.controller");

router.route("/").get(getUser);

router.route("/follow-suggestions").get(getFollowSuggestions);

router.route("/:userId").get(getUserByIdWithFollowing);

module.exports = router;
