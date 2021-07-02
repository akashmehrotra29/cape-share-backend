const express = require("express");
const router = express.Router();

const {
  getUser,
  getUserByIdWithFollowing,
} = require("../controllers/user.controller");

router.route("/").get(getUser);

router.route("/:userId").get(getUserByIdWithFollowing);

module.exports = router;
