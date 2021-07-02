const express = require("express");
const router = express.Router();

const {
  createUserConnection,
  getUsersByTypeOfConnection,
  removeUserConnection,
} = require("../controllers/userLinks.controller");

router.route("/").post(createUserConnection).get(getUsersByTypeOfConnection);

router.route("/:linkId").delete(removeUserConnection);

module.exports = router;
