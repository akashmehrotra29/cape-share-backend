const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')

const { initializeDBConnection } = require('./config/db.connect');

const app = express();
app.use(bodyParser.json())
app.use(cors())

initializeDBConnection();

app.get("/", (req, res) => {
  res.send("Welcome to capeshare");
});

const postsRouter = require('./routes/posts.route')

app.use("/posts", postsRouter);

app.listen(3000, () => {
  console.log('server started');
});