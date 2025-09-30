// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();
const express = require("express"); //connects to DB
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

//import routes
const indexRoutes = require("./routes/index.routes");
const authRoutes = require("./routes/authRoute");
const userRoutes = require("./routes/usersRoute");
const tripRoutes = require("./routes/tripsRoute");
const postRoutes = require("./routes/postsRoute");
const locationRoutes = require("./routes/locationsRoute");
const uploadRoutes = require("./routes/upload.routes"); //cloudinary
const app = express();

//import middlewares
const { notFoundHandler, errorHandler } = require("./error-handling/index");

//general middlewares
app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan("dev"));

// rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);

// 👇 Start handling routes here
app.use("/api", indexRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api", uploadRoutes);
// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
