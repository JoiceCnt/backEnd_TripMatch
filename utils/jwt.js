const jwt = require("jsonwebtoken");

const signToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email }, // payload
    process.env.JWT_SECRET, // secret key
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" } // options
  );
};

module.exports = { signToken };
