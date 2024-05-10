import { db } from "../config/db.config.js";

export const queryGetImages = async (id) => {
  return await db.select("url").from("images").where({ trip_id: id });
};

export const queryGetTrips = async () => {
  return await db.select("*").from("trips");
};

export const queryGetCoords = async (id) => {
  return await db.select("lat", "lng").from("trips").where({ trip_id: id });
};
