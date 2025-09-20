const axios = require('axios');
const mongoose = require('mongoose');
const Country = require('../models/Country');
const City = require('../models/City');
const dotenv = require('dotenv');
dotenv.config();

const MONGO = process.env.MONGO_URI;
const API_BASE = process.env.EXTERNAL_API_BASE;

const importData = async () => {
  try {
    await mongoose.connect(MONGO);
    await Country.deleteMany({});
    await City.deleteMany({});

    const countriesRes = await axios.get(`${API_BASE}/countries`);
    const countries = countriesRes.data; // ajustar según la API
    await Country.insertMany(countries.map(c => ({ code: c.code, name: c.name })));

    for (const c of countries) {
      const citiesRes = await axios.get(`${API_BASE}/cities/${c.code}`);
      const cities = citiesRes.data;
      await City.insertMany(cities.map(city => ({ name: city.name, countryCode: c.code })));
    }

    console.log('Import finished');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

importData();
