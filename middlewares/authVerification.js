const jwt = require("jsonwebtoken");

const authVerification = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access. Token not found",
      });
    }

    // token = token.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decodedToken.userId });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access. User not found/ Invalid token",
      });
    }

    req.user = { userId: decodedValue.userId };
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Authentication failed." + error.message,
    });
  }
};

module.exports = authVerification;
