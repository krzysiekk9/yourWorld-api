import express from "express";
import cors from "cors";
import knex from "knex";
import multer from "multer";
import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import { getImages, getTrips, getCoords } from "./controllers/getData.js";
import { postWithImages, postWithoutImages } from "./controllers/upload.js";

//multer storage congig
const storage = multer.memoryStorage();
const uploadFiles = multer({ storage: storage });

//AWS config
const bucketName = "s3bucket1yourworld2";
const bucketRegion = "eu-north-1";

AWS.config.update({ region: bucketRegion });

const s3 = new AWS.S3({
  credentails: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secrestAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

//DB config
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

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//clean recived form data to put it in DB
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

//changing date format to display only YYYY-MM-DD
const cleanDate = (date) => {
  return date.toISOString().split("T")[0];
};

app.post("/api/upload/withImages", uploadFiles.array("files"), (req, res) =>
  postWithImages(
    req,
    res,
    bucketName,
    bucketRegion,
    s3,
    db,
    cleanData,
    cleanDate,
    uuidv4
  )
);

app.post("/api/upload/withoutImages", (req, res) =>
  postWithoutImages(req, res, cleanData, uuidv4, db, cleanDate)
);

app.get("/api/getData/photos/:id", (req, res, db) => getImages(req, res, db));

app.get("/api/getData/trips", (req, res) =>
  getTrips(req, res, db, cleanData, cleanDate)
);

app.get("/api/getData/coords/:id", (req, res, db) => getCoords(req, res, db));

app.listen(process.env.PORT || 3000, () => {
  console.log("App is running");
});
