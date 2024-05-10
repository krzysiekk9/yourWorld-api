import express from "express";

import {
  getImages,
  getTrips,
  getCoords,
} from "../controllers/getData.controller.js";

export const getDataRoute = express.Router();

getDataRoute.get("/photos/:id", getImages);

getDataRoute.get("/trips", getTrips);

getDataRoute.get("/coords/:id", getCoords);
