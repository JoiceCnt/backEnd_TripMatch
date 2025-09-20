const express = require('express');
const isAuth = require('../middlewares/isAuth');
const { createTrip, searchTrips, matchTrips, topTrips } = require('../controllers/tripController');
const Trip = require('../models/Trip');
const isOwner = require('../middlewares/isOwner');

const router = express.Router();

router.post('/', isAuth, createTrip);
router.get('/', searchTrips);
router.get('/top', topTrips);
router.get('/:id/match', matchTrips);

// update/delete endpoints example
router.delete('/:id', isAuth, isOwner(Trip, 'createdBy', 'id'), async (req, res, next) => {
  try {
    const trip = await Trip.findByIdAndDelete(req.params.id);
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

