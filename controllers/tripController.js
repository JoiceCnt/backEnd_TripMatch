const Trip = require('../models/Trip.model.js');

const createTrip = async (req, res, next) => {
    try {
        const data = { ...req.body, createdBy: req.user._id };
        const trip = new Trip(data);
        await trip.save();
        res.status(201).json(trip);
    } catch (err) {
        next(err);
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
  matchTrips,
  topTrips
};