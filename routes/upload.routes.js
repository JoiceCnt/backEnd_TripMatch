// routes/uploadRoute.js
const router = require("express").Router();
const uploader = require("../middlewares/cloudinary.config");

router.post("/upload", uploader.single("imageUrl"), (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    res.status(201).json({ imageUrl: req.file.path });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
