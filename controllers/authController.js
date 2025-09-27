const User = require("../models/User.model.js");
const { signToken } = require("../utils/jwt.js");

const register = async (req, res, next) => {
  try {
    const {
      name,
      surname,
      gender,
      country,
      username,
      email,
      password,
      preferences,
    } = req.body;

    // Validate required fields
    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ message: "Username, email and password are required" });
    }

    // Check if email is already registered
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({ message: "Email already registered" });
    }

    // Check if username is already taken
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(409).json({ message: "Username already taken" });
    }

    //create new user
    const user = new User({
      name,
      //surname,
      //gender,
      //country,
      //username,
      email,
      password,
      //preferences,
    });
    await user.save();

    //generate JWT token
    const token = signToken(user);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        name: user.name,
        surname: user.surname,
        country: user.country,
        gender: user.gender,
        preferences: user.preferences,
      },
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    //validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    //find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    //compare passwords using the User model method
    const valid = await user.comparePassword(password);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken(user);
    res.json({
      token,
      user: {
        id: user._id,
        username: user.name,
        email: user.email,
        name: user.name,
        surname: user.surname,
        country: user.country,
        gender: user.gender,
        preferences: user.preferences,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login };
