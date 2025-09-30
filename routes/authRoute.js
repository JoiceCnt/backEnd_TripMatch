// src/routes/auth.routes.js
const express = require("express");
const { register, login } = require("../controllers/authController.js");
const uploader = require("../middlewares/cloudinary.config"); // 👈 importa do config

const router = express.Router();

// usa o uploader do Cloudinary em vez do multer simples
router.post("/register", uploader.single("photo"), register);
router.post("/login", login);

module.exports = router;
