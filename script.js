import express from "express";
import multer from "multer";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";

const upload = multer({ dest: "uploads/" });

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// const storage = multer.diskStorage(
//   {
//       destination: './uploads/',
//       filename: function ( req, file, cb ) {
//           //req.body is empty...
//           //How could I get the new_file_name property sent from client here?
//           cb( null, file.originalname+ '-' + Date.now()+".pdf");
//       }
//   }
// );

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
  const filteredData = cleanData(data);
  const id = uuidv4();

  res.status(200).json({ success: true, tripDetails: filteredData, id });
});

app.post("/api/tripDetails", (req, res) => {
  console.log("Uploaded data without images");
  const data = req.body;

  const filteredData = cleanData(data);
  //generating uniqe id for new list item
  const id = uuidv4();

  //TODO send data to database

  res.status(200).json({ success: true, tripDetails: filteredData, id });
});

app.post("/api/getPhotos", (req, res) => {
  const { id } = req.body;
  console.log(id);
  res.status(200).json({ success: true });
});

app.listen(3000, () => {
  console.log("App is running");
});
