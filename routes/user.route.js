const express = require("express");
const router = express.Router();

const {
  getUser,
  getUserByIdWithFollowing,
  getFollowSuggestions,
  updateUserProfile,
} = require("../controllers/user.controller");

router.route("/").get(getUser).post(updateUserProfile);

router.route("/follow-suggestions").get(getFollowSuggestions);

router.route("/:userId").get(getUserByIdWithFollowing);

module.exports = router;
