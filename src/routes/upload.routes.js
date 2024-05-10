import express from "express";

import { uploadFiles } from "../config/multer.config.js";

import {
  postWithImages,
  postWithoutImages,
} from "../controllers/uploadData.controller.js";

export const uploadRoute = express.Router();

uploadRoute.post("/", uploadFiles.any(), (req, res) => {
  const files = req.files;
  if (files.length !== 0) {
    postWithImages(req, res);
  } else {
    postWithoutImages(req, res);
  }
});
