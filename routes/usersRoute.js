const express = require("express");
const User = require("../models/User.model");
const isAuth = require("../middlewares/isAuth");
const isOwner = require("../middlewares/isOwner");
const userController = require("../controllers/userController");
const uploader = require("../middlewares/cloudinary.config");
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
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      id: user._id,
      email: user.email,
      name: user.name,
      surname: user.surname,
      gender: user.gender,
      preferences: user.preferences,
      favoriteCities: user.favoriteCities,
      photo: user.photo || user.profilePic || null, // update profile pic
    });
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
router.put(
  "/me",
  isAuth,
  uploader.single("photo"), // aceita upload da foto
  async (req, res, next) => {
    try {
      const updates = req.body || {}; // evita undefined

      if (updates.password) delete updates.password; // não atualiza senha aqui

      // Converter preferences (objeto → array)
      if (updates.preferences) {
        try {
          const prefsObj =
            typeof updates.preferences === "string"
              ? JSON.parse(updates.preferences)
              : updates.preferences;

          if (prefsObj && typeof prefsObj === "object") {
            updates.preferences = Object.keys(prefsObj).filter(
              (key) => prefsObj[key]
            );
          }
        } catch (err) {
          console.error("❌ Error parsing preferences:", err);
          updates.preferences = [];
        }
      }

      // Converter favoriteCities (string → array)
      if (
        updates.favoriteCities &&
        typeof updates.favoriteCities === "string"
      ) {
        updates.favoriteCities = updates.favoriteCities
          .split(",")
          .map((c) => c.trim())
          .filter((c) => c.length > 0);
      }

      // Se foi enviada foto nova, salva URL do Cloudinary
      if (req.file) {
        updates.photo = req.file.path;
      }

      const user = await User.findByIdAndUpdate(req.user.id, updates, {
        new: true,
      }).select("-password");

      res.json(user);
    } catch (err) {
      next(err);
    }
  }
);

// DELETE own profile
router.delete(
  "/:id",
  isAuth,
  isOwner(User, "_id", "id"),
  async (req, res, next) => {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.json({ message: "User deleted" });
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/users/me/settings
router.get("/me/settings", isAuth, userController.getSettings);

// PUT /api/users/me/settings
router.put("/me/settings", isAuth, userController.updateSettings);

module.exports = router;
