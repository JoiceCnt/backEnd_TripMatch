const express = require("express");
const { Country } = require("../models/Country.model.js");
const { City } = require("../models/City.model.js");

const router = express.Router();

router.get('/countries', async (req, res, next) => {
  try { const countries = await Country.find(); res.json(countries); } catch (err) { next(err); }
});

router.get('/cities/:countryCode', async (req, res, next) => {
  try { const cities = await City.find({ countryCode: req.params.countryCode }); res.json(cities); } catch (err) { next(err); }
});


module.exports = router;