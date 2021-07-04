const express = require("express");
const router = express.Router();

const {getNotifications} = require("../controllers/notification.controller")

router.route("/").get(getNotifications);

module.exports = router;
