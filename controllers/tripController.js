const Trip = require("../models/Trip.model.js");

// ================= CREATE TRIP =================
const createTrip = async (req, res, next) => {
  try {
    const {
      title,
      startDate,
      endDate,
      country,
      countryCode,
      city,
      preferences,
      heroImageUrl,
      heroImagePublicId,
    } = req.body;

    if (!title || !startDate || !endDate || !country || !countryCode || !city) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start) || isNaN(end)) {
      return res.status(400).json({ error: "Invalid date format" });
    }
    if (end < start) {
      return res.status(400).json({ error: "endDate must be after startDate" });
    }

    const allowedPreferences = ["nature", "concerts_and_events", "gastronomy", "touristic_places"];
    if (preferences) {
      const invalidPrefs = preferences.filter(p => !allowedPreferences.includes(p));
      if (invalidPrefs.length > 0) {
        return res.status(400).json({ error: "Invalid preferences: " + invalidPrefs.join(", ") });
      }
    }

    const tripData = {
      title,
      startDate: start,
      endDate: end,
      country,
      countryCode,
      city,
      preferences,
      heroImageUrl,
      heroImagePublicId,
      createdBy: req.user._id,
    };

    const trip = new Trip(tripData);
    await trip.save();
    res.status(201).json(trip);
  } catch (err) {
    console.error("❌ Error en createTrip:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
};

// ================= GET TRIPS =================
const getTrips = async (req, res, next) => {
  try {
    const { city, countryCode, startDate, endDate, preference, page = 1, limit = 20 } = req.query;
    const filters = {};
    if (city) filters.city = new RegExp(`^${city}$`, "i");
    if (countryCode) filters.countryCode = countryCode;
    if (preference) filters.preferences = preference;

    if (startDate && endDate) {
      filters.startDate = { $lte: new Date(endDate) };
      filters.endDate = { $gte: new Date(startDate) };
    }

    const trips = await Trip.find(filters)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate("createdBy", "username name");

    res.json(trips);
  } catch (err) {
    next(err);
  }
};

// ================= GET TRIP BY ID =================
const getTripById = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    res.json(trip);
  } catch (err) {
    next(err);
  }
};

// ================= DELETE TRIP =================
const deleteTrip = async (req, res, next) => {
  try {
    const { id } = req.params;
    const trip = await Trip.findByIdAndDelete(id);
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    res.json({ message: "Trip deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting trip:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ================= UPDATE TRIP =================
const updateTrip = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedTrip = await Trip.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updatedTrip) return res.status(404).json({ message: "Trip not found" });
    res.json(updatedTrip);
  } catch (err) {
    console.error("❌ Error updating trip:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ================= MATCH TRIPS =================
const matchTrips = async (req, res, next) => {
  try {
    const { id } = req.params;
    const base = await Trip.findById(id);
    if (!base) return res.status(404).json({ message: "Trip not found" });

    const matches = await Trip.find({
      _id: { $ne: base._id },
      city: base.city,
      countryCode: base.countryCode,
      startDate: { $lte: base.endDate },
      endDate: { $gte: base.startDate },
      preferences: { $in: base.preferences },
    })
      .limit(20)
      .populate("createdBy", "username name");

    res.json(matches);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createTrip,
  getTrips,
  getTripById,
  deleteTrip,
  updateTrip,
  matchTrips,
};
