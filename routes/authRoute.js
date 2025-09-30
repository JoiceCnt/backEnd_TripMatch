const express = require('express');
const { register, login } = require('../controllers/authController.js');
const multer = require("multer");
const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post('/register', upload.single('photo'), register);
router.post('/login', login);

module.exports = router;