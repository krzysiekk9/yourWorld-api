import {
  queryUploadWithoutImages,
  queryUploadWithImages,
} from "../src/model/upload.model.js";

import { cleanData } from "../src/helpers/cleanData.helper.js";
import { cleanDate } from "../src/helpers/cleanDate.helper.js";
import { createFileUrl } from "../src/helpers/createUrl.helper.js";

import { awsUpload } from "../src/model/AWSupload.model.js";
import { bucketName, bucketRegion } from "../src/config/aws.config.js";

export const postWithImages = (req, res, uuidv4) => {
  console.log("Data and images uploaded");

  const data = req.body;
  const files = req.files;
  const filteredData = cleanData(data);
  const tripId = uuidv4();
  let filesUrl = [];
  let uploadSucces = [];

  // const createFileUrl = (id) => {
  //   return `https://${bucketName}.s3.${bucketRegion}.amazonaws.com/${id}`;
  // };

  files.forEach((file) => {
    const fileId = uuidv4();

    // const uploadParams = {
    //   Bucket: bucketName,
    //   Key: fileId,
    //   Body: file.buffer,
    //   ContentType: file.mimetype,
    //   ACL: "public-read",
    // };
    awsUpload(fileId, file, uploadSucces);

    // s3.upload(createUploadParams(fileId, file), function (err, data) {
    //   if (err) {
    //     console.log("Error", err);
    //     uploadSucces.push(false);
    //   }
    //   if (data) {
    //     console.log("Upload Success", data.Location);
    //     uploadSucces.push(true);
    //   }
    // });

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
    // db.transaction((trx) => {
    //   trx
    //     .insert({
    //       trip_id: tripId,
    //       url: filesUrl,
    //     })
    //     .into("images")
    //     .returning("trip_id")
    //     .then((tripId) => {
    //       return trx("trips")
    //         .returning("*")
    //         .insert({
    //           trip_id: tripId[0].trip_id,
    //           name: filteredData.name,
    //           date: filteredData.date,
    //           duration: filteredData.duration,
    //           distance: filteredData.distance,
    //           elevation_gain: filteredData.elevationGain,
    //           fuel_cost: filteredData.fuelCost,
    //           average_fuel_consumption: filteredData.avgFuel,
    //           ticket_cost: filteredData.ticketCost,
    //           trip_type: filteredData.tripType,
    //           lat: filteredData.lat,
    //           lng: filteredData.lng,
    //         })
    //         .then((response) => {
    //           const cleanResponse = cleanData(response[0]);
    //           cleanResponse.date = cleanDate(cleanResponse.date);

    //           res.status(200).json({
    //             success: true,
    //             tripDetails: cleanResponse,
    //             tripId: tripId[0].trip_id,
    //           });
    //         });
    //     })
    //     .then(trx.commit)
    //     .catch(trx.rollback);
    // }).catch((err) =>
    //   res
    //     .status(400)
    //     .json({ success: false, message: "Unable to add new trip to database" })
    // );
  } else {
    res
      .status(400)
      .json({ success: false, message: "Unable to add images to AWS" });
  }
};

export const postWithoutImages = (req, res, uuidv4) => {
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

  // db("trips")
  //   .returning("*")
  //   .insert({
  //     trip_id: tripId,
  //     name: filteredData.name,
  //     date: filteredData.date,
  //     duration: filteredData.duration,
  //     distance: filteredData.distance,
  //     elevation_gain: filteredData.elevationGain,
  //     fuel_cost: filteredData.fuelCost,
  //     average_fuel_consumption: filteredData.avgFuel,
  //     ticket_cost: filteredData.ticketCost,
  //     trip_type: filteredData.tripType,
  //     lat: filteredData.lat,
  //     lng: filteredData.lng,
  //   })
  //   .then((response) => {
  //     //changing string to boolean
  //     const cleanResponse = cleanData(response[0]);
  //     //changing date format to display only YYYY-MM-DD
  //     cleanResponse.date = cleanDate(cleanResponse.date);

  //     res
  //       .status(200)
  //       .json({ success: true, tripDetails: cleanResponse, tripId });
  //   })
  //   .catch((err) =>
  //     res
  //       .status(400)
  //       .json({ success: false, message: "Unable to add data to database" })
  //   );
};
