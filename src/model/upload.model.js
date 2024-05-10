import { db } from "../config/db.config.js";

export const queryUploadWithoutImages = (tripId, filteredData) => {
  const response = db("trips")
    .returning("*")
    .insert({
      trip_id: tripId,
      name: filteredData.name,
      date: filteredData.date,
      duration: filteredData.duration,
      distance: filteredData.distance,
      elevation_gain: filteredData.elevationGain,
      fuel_cost: filteredData.fuelCost,
      average_fuel_consumption: filteredData.avgFuel,
      ticket_cost: filteredData.ticketCost,
      trip_type: filteredData.tripType,
      lat: filteredData.lat,
      lng: filteredData.lng,
      with_images: false,
    })
    .then(([response]) => {
      return { success: true, response };
    })
    .catch((err) => {
      return { success: false, err };
    });
  return response;
};

export const queryUploadWithImages = (tripId, filesUrl, filteredData) => {
  const response = db
    .transaction((trx) => {
      trx
        .insert({
          trip_id: tripId,
          url: filesUrl,
        })
        .into("images")
        .returning("trip_id")
        .then((tripId) => {
          return trx("trips")
            .returning("*")
            .insert({
              trip_id: tripId[0].trip_id,
              name: filteredData.name,
              date: filteredData.date,
              duration: filteredData.duration,
              distance: filteredData.distance,
              elevation_gain: filteredData.elevationGain,
              fuel_cost: filteredData.fuelCost,
              average_fuel_consumption: filteredData.avgFuel,
              ticket_cost: filteredData.ticketCost,
              trip_type: filteredData.tripType,
              lat: filteredData.lat,
              lng: filteredData.lng,
              with_images: true,
            })
            .then(([response]) => {
              return { success: true, response };
            });
        })
        .then(trx.commit)
        .catch(trx.rollback);
    })
    .catch((err) => {
      return { success: false, err };
    });
  return response;
};
