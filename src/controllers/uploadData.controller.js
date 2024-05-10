import { v4 as uuidv4 } from "uuid";

import {
  queryUploadWithoutImages,
  queryUploadWithImages,
} from "../model/upload.model.js";

import { cleanData } from "../helpers/cleanData.helper.js";
import { cleanDate } from "../helpers/cleanDate.helper.js";
import { createFileUrl } from "../helpers/createUrl.helper.js";

import { awsUpload } from "../model/AWSupload.model.js";
import { bucketName, bucketRegion } from "../config/aws.config.js";

export const postWithImages = (req, res) => {
  console.log("Data and images uploaded");

  const data = req.body;
  const files = req.files;
  const filteredData = cleanData(data);
  const tripId = uuidv4();
  let filesUrl = [];
  let uploadSucces = [];

  files.forEach((file) => {
    const fileId = uuidv4();

    awsUpload(fileId, file, uploadSucces);

    filesUrl.push(createFileUrl(bucketName, bucketRegion, fileId));
  });
  console.log("arr", filesUrl);

  //if all photos where uploaded successfully to AWS
  if (uploadSucces.every((cur) => cur === true)) {
    queryUploadWithImages(tripId, filesUrl, filteredData).then((dbResponse) => {
      if (dbResponse.success === true) {
        const cleanResponse = cleanData(dbResponse.response);
        //  changing date format to display only YYYY-MM-DD
        cleanResponse.date = cleanDate(cleanResponse.date);

        res
          .status(200)
          .json({ success: true, tripDetails: cleanResponse, tripId });
      }
      if (dbResponse.success === false) {
        res.status(400).json({
          success: false,
          message: "Unable to add new trip to database",
        });
      }
    });
  } else {
    res
      .status(400)
      .json({ success: false, message: "Unable to add images to AWS" });
  }
};

export const postWithoutImages = (req, res) => {
  console.log("Uploaded data without images");
  const data = req.body;

  const filteredData = cleanData(data);
  console.log("filteredData", filteredData);
  //generating uniqe id for new list item
  const tripId = uuidv4();

  queryUploadWithoutImages(tripId, filteredData).then((dbResponse) => {
    if (dbResponse.success === true) {
      const cleanResponse = cleanData(dbResponse.response);
      //  changing date format to display only YYYY-MM-DD
      cleanResponse.date = cleanDate(cleanResponse.date);

      res
        .status(200)
        .json({ success: true, tripDetails: cleanResponse, tripId });
    }
    if (dbResponse.success === false) {
      res.status(400).json({
        success: false,
        message: "Unable to add new trip to database",
      });
    }
  });
};
