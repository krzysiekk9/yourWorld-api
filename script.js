import express, { response } from "express";
import multer from "multer";
import cors from "cors";
import knex from "knex";
import { v4 as uuidv4 } from "uuid";
import AWS from "aws-sdk";

const bucketName = "s3bucket1yourworld2";
const bucketRegion = "eu-north-1";

AWS.config.update({ region: bucketRegion });

const s3 = new AWS.S3({
  credentails: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secrestAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    port: 5432,
    user: "postgres",
    password: "test",
    database: "yourworld",
  },
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const cleanData = (data) => {
  return Object.entries(data).reduce((acc, [key, value]) => {
    if (value === "" || value === null) {
      return acc;
    } else {
      acc[key] = value;
    }
    return acc;
  }, {});
};

app.post("/api/photosUpload", upload.array("files"), (req, res) => {
  console.log("Data and images uploaded");

  const data = req.body;
  const files = req.files;
  const filteredData = cleanData(data);
  const tripId = uuidv4();
  let filesUrl = [];
  let uploadSucces = [];

  const createFileUrl = (id) => {
    return `https://${bucketName}.s3.${bucketRegion}.amazonaws.com/${id}`;
  };

  files.forEach((file) => {
    const fileId = uuidv4();

    const uploadParams = {
      Bucket: bucketName,
      Key: fileId,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: "public-read",
    };

    s3.upload(uploadParams, function (err, data) {
      if (err) {
        console.log("Error", err);
        uploadSucces.push(false);
      }
      if (data) {
        console.log("Upload Success", data.Location);
        uploadSucces.push(true);
      }
    });

    filesUrl.push(createFileUrl(fileId));
  });
  console.log("arr", filesUrl);
  if (uploadSucces.every((cur) => cur === true)) {
    db.transaction((trx) => {
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
              with_images: filteredData.uploadWithImages,
            })
            .then((response) => {
              const cleanResponse = cleanData(response[0]);
              res.status(200).json({
                success: true,
                tripDetails: cleanResponse,
                tripId: tripId[0].trip_id,
              });
            });
        })
        .then(trx.commit)
        .catch(trx.rollback);
    }).catch((err) =>
      res
        .status(400)
        .json({ success: false, message: "Unable to add new trip to database" })
    );
  } else {
    res
      .status(400)
      .json({ success: false, message: "Unable to add images to AWS" });
  }
});

app.post("/api/tripDetails", (req, res) => {
  console.log("Uploaded data without images");
  const data = req.body;

  const filteredData = cleanData(data);
  //generating uniqe id for new list item
  const tripId = uuidv4();

  db("trips")
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
      with_images: filteredData.uploadWithImages,
    })
    .then((response) => {
      //changing string to boolean
      const cleanResponse = cleanData(response[0]);

      // filteredData.uploadWithImages = filteredData.uploadWithImages === "true";
      res
        .status(200)
        .json({ success: true, tripDetails: cleanResponse, tripId });
    })
    .catch((err) =>
      res
        .status(400)
        .json({ success: false, message: "Unable to add data to database" })
    );
});

app.get("/api/getPhotos/:id", async (req, res) => {
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
});

app.get("/api/getTrips", async (req, res) => {
  try {
    //getting all trips from DB
    const trips = await db.select("*").from("trips");
    //cleaning data
    const cleanedData = trips.map((trip) => cleanData(trip));
    res.status(200).json({ success: true, trips: cleanedData });
  } catch (err) {
    res
      .status(400)
      .json({ success: false, message: "Unable to get trips from database" });
  }
});

app.listen(3000, () => {
  console.log("App is running");
});
