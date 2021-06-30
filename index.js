const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')

const { initializeDBConnection } = require('./config/db.connect');

const app = express();
app.use(bodyParser.json())
app.use(cors())

initializeDBConnection();

const postsRouter = require('./routes/posts.route')

app.use("/posts", postsRouter);

app.get('/', (req, res) => {
  res.send('Welcome to capeshare')
});

app.listen(3000, () => {
  console.log('server started');
});