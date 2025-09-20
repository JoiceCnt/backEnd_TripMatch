const express = require("express");
const User = require("../models/User.model");
const isAuth = require("../middlewares/isAuth");
const isOwner = require("../middlewares/isOwner");

const router = express.Router();

// GET all users (solo admin podría usarlo, ejemplo simple)
router.get("/", isAuth, async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    next(err);
  }
});

// GET own profile
router.get("/me", isAuth, async (req, res, next) => {
  try {
    res.json(req.user); // req.user viene de isAuth
  } catch (err) {
    next(err);
  }
});

// GET specific user by id
router.get("/:id", isAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// UPDATE own profile
router.put("/:id", isAuth, isOwner(User, "_id", "id"), async (req, res, next) => {
  try {
    const updates = req.body;
    if (updates.password) delete updates.password; // no actualizar password aquí
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select("-password");
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// DELETE own profile
router.delete("/:id", isAuth, isOwner(User, "_id", "id"), async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
