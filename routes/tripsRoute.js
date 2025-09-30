const express = require("express");
const isAuth = require("../middlewares/isAuth");
const isOwner = require("../middlewares/isOwner");
const {
  createTrip,
  getTrips,
  getTripById,
  matchTrips,
} = require("../controllers/tripController");
const Trip = require("../models/Trip.model");

const router = express.Router();

router.post("/", isAuth, createTrip);
router.get("/", isAuth, isOwner(Trip, "author", "id"), getTrips);
router.get("/:id", isAuth, isOwner(Trip, "author", "id"), getTripById);
router.get("/:id/match", isAuth, isOwner(Trip, "author", "id"), matchTrips);



// update/delete endpoints example
router.delete(
  "/:id",
  isAuth,
  isOwner(Trip, "createdBy", "id"),
  async (req, res, next) => {
    try {
      const trip = await Trip.findByIdAndDelete(req.params.id);
      if (!trip) return res.status(404).json({ error: "Trip not found" });
      res.json({ message: "Deleted" });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
