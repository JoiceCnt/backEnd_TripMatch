import express from "express";
import { getCountries } from "../controllers/locationController";

const router = express.Router();

router.get("/countries", getCountries);

export default router;