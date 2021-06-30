const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const initializeDBConnection = require("./config/db.connect");
const authVerification = require("./middlewares/authVerification");
const verifyPostId = require("./middlewares/verifyPostId");

const app = express();
app.use(bodyParser.json());
app.use(cors());

initializeDBConnection();

app.get("/", (req, res) => {
  res.send("Welcome to capeshare");
});

const authRouter = require("./routes/auth.routes");
const postsRouter = require("./routes/posts.route");

app.use("/", authRouter);
app.use("/posts", authVerification, postsRouter);

app.listen(3000, () => {
  console.log("server started");
});
