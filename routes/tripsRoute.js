const express = require('express');
const isAuth = require('../middlewares/isAuth');
const { createTrip, getTrips, getTripById, matchTrips, topTrips, updateTrip, deleteTrip } = require('../controllers/tripController');
const Trip = require('../models/Trip.model');
const isOwner = require('../middlewares/isOwner');

const router = express.Router();

router.post('/', createTrip);
router.get('/', getTrips);
router.get('/top', topTrips);
router.get("/:id", getTripById);
router.get('/:id/match', matchTrips);
router.put('/:id', updateTrip);
router.delete('/:id', deleteTrip);


module.exports = router;

