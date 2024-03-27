export const getImages = async (req, res, db) => {
  try {
    const id = req.params.id;
    const imageArr = await db
      .select("url")
      .from("images")
      .where({ trip_id: id });
    console.log(imageArr);
    res.status(200).json({ success: true, imageArr });
  } catch (err) {
    res.status(400).json({ success: false, message: "Couldn't get images" });
  }
};

export const getTrips = async (req, res, db, cleanData, cleanDate) => {
  try {
    //getting all trips from DB
    const trips = await db.select("*").from("trips");
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

export const getCoords = async (req, res, db) => {
  try {
    const id = req.params.id;
    const coords = await db
      .select("lat", "lng")
      .from("trips")
      .where({ trip_id: id });

    res.status(200).json({ success: true, coords });
  } catch (err) {
    res
      .status(400)
      .json({ success: false, message: "Unable to get coords from database" });
  }
};
