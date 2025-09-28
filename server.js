// server.js
require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");

const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 5005;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI não definido no .env");
  process.exit(1);
}

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection error:", err.message);
    process.exit(1);
  });
