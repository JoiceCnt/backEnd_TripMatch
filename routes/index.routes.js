const router = require("express").Router();

const locationRoutes = require("./locations");
router.use("/locations", locationRoutes);

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

module.exports = router;
