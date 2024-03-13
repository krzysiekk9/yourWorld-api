import express from "express";
import multer from "multer";
import cors from "cors";

const upload = multer({ dest: "uploads/" });

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post("/api/photosUpload", upload.array("files"), (req, res) => {
  console.log("Images uploaded");
  console.log(req.files);
  res.status(200).json({ success: true });
});

app.post("/api/tripDetails", (req, res) => {
  const { name } = req.body;
  const data = req.body;
  console.log("boyd", name);
  const filteredData = Object.entries(data).reduce((acc, [key, value]) => {
    if (value !== "") {
      acc[key] = value;
    }
    return acc;
  }, {});

  //TODO send data to database

  res.status(200).json({ success: true, data: filteredData });
});

app.listen(3000, () => {
  console.log("App is running");
});
