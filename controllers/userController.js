// controllers/userController.js
const User = require("../models/User");
const { recompileSchema } = require("../models/User.model");

// Obtener todos los usuarios
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error obteniendo usuarios" });
  }
};

// Crear usuario
const createUser = async (req, res) => {
  try {
    const { username, email, password, name, surname, bio, gender, country, preferences, favoriteCities } = req.body;

    // (string JSON → array de strings)
    let preferencesArray = [];
    if (preferences) {
      const preferencesObj = typeof preferences === "string" ? JSON.parse(preferences) : preferences;
      preferencesArray = Object.keys(preferencesObj).filter((key) => preferencesObj[key]);
    }

// (string con comas → array de strings)
    let favoriteCitiesArray = [];
    if (favoriteCities) {
      favoriteCitiesArray = favoriteCities
        .split(",")
        .map((c) => c.trim())
        .filter((c) => c.length > 0);
    }

    const user = new User({
      username,
      email,
      password,
      name,
      surname,
      bio,
      gender,
      country,
      preferences: preferencesArray,
      favoriteCities: favoriteCitiesArray,
    });

    await user.save();
    res.status(201).json(user);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creando usuario" });
  }
};


const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const { name, bio, preferences, favoriteCities } = req.body;

    let preferencesArray = [];
    if (preferences) {
      const preferencesObj = typeof preferences === "string" ? JSON.parse(preferences) : preferences;
      preferencesArray = Object.keys(preferencesObj).filter((key) => preferencesObj[key]);
    }

    let favoriteCitiesArray = [];
    if (favoriteCities) {
      favoriteCitiesArray = favoriteCities
        .split(",")
        .map((c) => c.trim())
        .filter((c) => c.length > 0);
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, bio, preferences: preferencesArray, favoriteCities: favoriteCitiesArray },
      { new: true }
    );

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Error actualizando perfil" });
  }
};

const getSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("settings");
    res.json(user.settings);
  }catch (err) {
    res.status(500).json({ message: "Error fetching settings" });
  }
};

const updateSettings = async (req, res) => {
  try {
     const updates = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { settings: updates },
      { new: true }
    ).select("settings");

    res.json(user.settings);
  } catch (err) {
    res.status(500).json({ message: "Error updating settings" });
  }
};

module.exports = { getUsers, createUser, updateProfile, getSettings, updateSettings };
