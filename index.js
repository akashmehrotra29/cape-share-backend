const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const initializeDBConnection = require("./config/db.connect");
const authVerification = require("./middlewares/authVerification");

const app = express();
app.use(bodyParser.json());
app.use(cors());

initializeDBConnection();

app.get("/", (req, res) => {
  res.send("Welcome to capeshare");
});

const authRouter = require("./routes/auth.route");
const postsRouter = require("./routes/posts.route");
const userRouter = require("./routes/user.route");
const userLinksRouter = require("./routes/userLinks.route");
const feedRouter = require("./routes/feed.route");
const notificationRouter = require("./routes/notification.route");

app.use("/", authRouter);
app.use("/posts", authVerification, postsRouter);
app.use("/users", authVerification, userRouter);
app.use("/user-links", authVerification, userLinksRouter);
app.use("/feed", authVerification, feedRouter);
app.use("/notifications", authVerification, notificationRouter);

app.listen(3001, () => {
  console.log("server started");
});
