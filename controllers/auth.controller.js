const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  const { name, username, email, password } = req.body;
  try {
    let user = await User.findOne({ email: email });
    if (user) {
      res.status(409).json({
        success: false,
        message: "Email is already associated with another account",
      });
      return;
    }

    user = await User.findOne({ username });
    if (user) {
      res.status(409).json({
        success: false,
        message: "Username is already taken",
      });
      return;
    }

    user = {
      name,
      username,
      email,
      registeredAt: new Date(),
    };
    const pass = password;
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(pass, salt);
    const newUser = await User.create(user);
    // console.log(newUser);

    res.status(201).json({ success: true, message: "signup successful" });
  } catch (error) {
    console.log(error);
    res.status(404).json({ success: false, message: "signup failed" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ success: false, message: "user not exist" });
    }

    const isCorrectCredentials = await bcrypt.compare(password, user.password);
    if (!isCorrectCredentials) {
      res
        .status(401)
        .json({ success: false, message: "incorrect user credentials" });
    }
    user.lastLogin = new Date();
    user = await user.save();

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        username: user.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    user.password = undefined;

    res
      .status(200)
      .json({ success: true, user, token, message: "login successful" });
  } catch (error) {
    console.log(error);
    res.status(404).json({ success: false, message: "login failed" });
  }
};

module.exports = { signup, login };
