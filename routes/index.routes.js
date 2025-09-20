const router = require("express").Router();

const locationRoutes = require("./locationsRoute");
router.use("/locationsRoute", locationRoutes);

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

module.exports = router;
