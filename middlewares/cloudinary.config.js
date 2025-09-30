const cloudinary = require("cloudinary").v2; // 👈 apenas 1 c
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "tripmatch", // nome da pasta no Cloudinary
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const uploader = multer({ storage });
module.exports = uploader;
