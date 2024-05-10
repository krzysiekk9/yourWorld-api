import {
  queryGetImages,
  queryGetTrips,
  queryGetCoords,
} from "../model/getData.model.js";

import { cleanData } from "../helpers/cleanData.helper.js";
import { cleanDate } from "../helpers/cleanDate.helper.js";

export const getImages = async (req, res) => {
  try {
    const id = req.params.id;
    const imageArr = await queryGetImages(id);

    res.status(200).json({ success: true, imageArr });
  } catch (err) {
    res.status(400).json({ success: false, message: "Couldn't get images" });
  }
};

export const getTrips = async (req, res) => {
  try {
    //getting all trips from DB
    const trips = await queryGetTrips();

    //cleaning data
    const cleanedData = trips.map((trip) => {
      trip.date = cleanDate(trip.date);
      return cleanData(trip);
    });
    res.status(200).json({ success: true, trips: cleanedData });
  } catch (err) {
    res
      .status(400)
      .json({ success: false, message: "Unable to get trips from database" });
  }
};

export const getCoords = async (req, res) => {
  try {
    const id = req.params.id;
    const coords = await queryGetCoords(id);

    res.status(200).json({ success: true, coords });
  } catch (err) {
    res
      .status(400)
      .json({ success: false, message: "Unable to get coords from database" });
  }
};
