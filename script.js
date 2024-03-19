import express, { response } from "express";
import multer from "multer";
import cors from "cors";
import knex from "knex";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import AWS from "aws-sdk";

// const client = new S3Client({});

const bucketName = "s3bucket1yourworld2";
const bucketRegion = "eu-north-1";

AWS.config.update({ region: bucketRegion });

const s3 = new AWS.S3({
  credentails: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secrestAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

// const upload = multer({ dest: "uploads/" });
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const cleanData = (data) => {
  return Object.entries(data).reduce((acc, [key, value]) => {
    if (value !== "") {
      acc[key] = value;
    }
    return acc;
  }, {});
};

app.post("/api/photosUpload", upload.array("files"), (req, res) => {
  console.log("Data and images uploaded");

  const data = req.body;
  const files = req.files;
  console.log("file", files);
  // console.log("data", data);
  const filteredData = cleanData(data);
  const id = uuidv4();
  // let location = ;
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
  if (uploadSucces.every((cur) => cur === true)) {
    console.log("hurraaaaa");
    console.log("link", filesUrl);
  }
});
// app.get("/img", async (req, res) => {
//   const img = await db("images").first();
//   console.log(img);
//   const b64 = img.files2[0].toString("base64");

//   const mimeType = "image/png"; // e.g., image/png

//   // res.send(`<img src="data:${mimeType};base64,${b64}" />`);
//   res.json({ mimeType, b64 });
//   // console.log(img.files2);
//   // const content = await fileTypeFromBuffer(img.files2);
//   // console.log(typeof img);
//   // const binary = img.files2[0];
//   // let base64 = binary.toString("base64");

//   // let blob = new Blob([new ArrayBuffer(img.files2[0])], { type: "image/png" });
//   // const url = global.URL.createObjectURL(blob);
//   // image.src = url;
//   // window.URL.revokeObjectURL(url);
//   // drawScreen(); // re-draw screen

//   // console.log("1", binary);
//   // console.log("w", base64);
//   // const html = `<html><body><img src=${url}/></body></body></html>`;
//   // res.send(html);
//   // res.send(`<img src="data:${mimeType};base64,${base64}" />`);
// });
app.post("/api/tripDetails", (req, res) => {
  console.log("Uploaded data without images");
  const data = req.body;

  const filteredData = cleanData(data);
  //generating uniqe id for new list item
  const id = uuidv4();
  console.log("!", filteredData);

  //TODO send data to database
  // db.select("*")
  //   .from("trips")
  //   .then((data) => console.log(data));

  db("trips")
    .returning("*")
    .insert({
      tripid: id,
      name: filteredData.name,
      date: filteredData.date,
      duration: filteredData.duration,
      distance: filteredData.distance,
      elevation_gain: filteredData.elevationGain,
      fuel_cost: filteredData.fuelCost,
      average_fuel_consumption: filteredData.avgFuel,
      ticket_cost: filteredData.ticketCost,
      trip_type: filteredData.tripType,
    })
    .then((response) =>
      res.status(200).json({ success: true, tripDetails: filteredData, id })
    )
    .catch((err) =>
      res
        .status(400)
        .json({ success: false, message: "Unable to add data to database" })
    );

  // res.status(200).json({ success: true, tripDetails: filteredData, id });
});

app.post("/api/getPhotos", (req, res) => {
  const { id } = req.body;
  console.log(id);
  res.status(200).json({ success: true });
});

app.listen(3000, () => {
  console.log("App is running");
});
