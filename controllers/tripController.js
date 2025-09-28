const Trip = require('../models/Trip.model.js');

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
      activities,
      documents,
      maxParticipants,
      heroImageUrl,
      heroImagePublicId,
      participants,
    } = req.body;

    // Validar campos obligatorios
    if (!title || !startDate || !endDate || !country || !countryCode || !city) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Validar fechas
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start) || isNaN(end)) {
      return res.status(400).json({ error: "Invalid date format" });
    }
    if (end < start) {
      return res.status(400).json({ error: "endDate must be after startDate" });
    }

    // Validar preferences
    const allowedPreferences = ["nature", "concerts_and_events", "gastronomy", "touristic_places"];
    if (preferences) {
      const invalidPrefs = preferences.filter(p => !allowedPreferences.includes(p));
      if (invalidPrefs.length > 0) {
        return res.status(400).json({ error: "Invalid preferences: " + invalidPrefs.join(", ") });
      }
    }

    // Validar actividades (opcional)
    if (activities) {
      for (let i = 0; i < activities.length; i++) {
        const act = activities[i];
        if (!act.title || !act.when) {
          return res.status(400).json({ error: `Activity ${i + 1} is missing title or when` });
        }
        if (isNaN(new Date(act.when))) {
          return res.status(400).json({ error: `Activity ${i + 1} has invalid date` });
        }
      }
    }

    // Crear trip con createdBy fijo (hasta que implementemos auth)
    const tripData = {
      title,
      startDate: start,
      endDate: end,
      country,
      countryCode,
      city,
      preferences,
      activities,
      documents,
      heroImageUrl,
      heroImagePublicId,
      participants,
      maxParticipants: maxParticipants || 10,
      createdBy: "650c3df58c5c123456789abc", // temporal
    };

    const trip = new Trip(tripData);
    await trip.save();

    res.status(201).json(trip);
  } catch (err) {
    console.error("❌ Error en createTrip:", err); // mostrar stack completo
    res.status(500).json({ error: err.message || "Internal server error" });
  }
};



const getTrips = async (req, res, next) => {
    try {
        const { city, countryCode, startDate, endDate, preference, page = 1, limit = 20 } = req.query;
        const filters = {};
        if (city) filters.city = new RegExp(`^${city}$`, 'i');
        if (countryCode) filters.countryCode = countryCode;
        if (preference) filters.preferences = preference;

        // Date overlap: trip.startDate <= endDate && trip.endDate >= startDate
        if (startDate && endDate) {
        filters.startDate = { $lte: new Date(endDate) };
        filters.endDate = { $gte: new Date(startDate) };
        }

        const trips = await Trip.find(filters)
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .populate('createdBy', 'username name');

        res.json(trips);
    } catch (err) {
        next(err);
    }
};

const getTripById = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    res.json(trip);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/trips/:id
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

// PUT /api/trips/:id
const updateTrip = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedTrip = await Trip.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedTrip) return res.status(404).json({ message: "Trip not found" });
    res.json(updatedTrip);
  } catch (err) {
    console.error("❌ Error updating trip:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};


//simple matching: find trips in the same city with overlapping dates and shared
const matchTrips = async (req, res, next) => {
     try {
        const { id } = req.params;
        const base = await Trip.findById(id);
        if (!base) return res.status(404).json({ message: 'Trip not found' });

        const matches = await Trip.find({
        _id: { $ne: base._id },
        city: base.city,
        countryCode: base.countryCode,
        startDate: { $lte: base.endDate },
        endDate: { $gte: base.startDate },
        preferences: { $in: base.preferences }
        })
        .limit(20)
        .populate('createdBy', 'username name');

        res.json(matches);
    } catch (err) {
        next(err);
    }
};

// Top trips (by number of participants)
const topTrips = async (req, res, next) => {
    try {
        const top = await Trip.find()
        .sort({ 'participants.length': -1, createdAt: -1 })
        .limit(10)
        .populate('createdBy', 'username');
        res.json(top);
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
  topTrips
};