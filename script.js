import express from "express";
import cors from "cors";

import { uploadFiles } from "./src/config/multer.config.js";

import {
  getImages,
  getTrips,
  getCoords,
} from "./src/controllers/getData.controller.js";

import {
  postWithImages,
  postWithoutImages,
} from "./src/controllers/uploadData.controller.js";

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/api/getData/photos/:id", (req, res) => getImages(req, res));

app.get("/api/getData/trips", (req, res) => getTrips(req, res));

app.get("/api/getData/coords/:id", (req, res) => getCoords(req, res));

app.post("/api/upload", uploadFiles.any(), (req, res) => {
  const files = req.files;
  if (files.length !== 0) {
    postWithImages(req, res);
  } else {
    postWithoutImages(req, res);
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("App is running");
});
