const mongoose = require('mongoose')

const initializeDBConnection = async () => {
  try {
    await mongoose.connect(process.env['URI'], {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    })
    console.log("connected to db successfully")
  }
  catch (error) {
    conosle.log(error)
    console.log("failed to connect")
  }
}

module.exports = {initializeDBConnection}