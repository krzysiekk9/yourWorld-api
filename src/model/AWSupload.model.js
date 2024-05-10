import { s3 } from "../config/aws.config.js";
import { createUploadParams } from "../config/aws.config.js";

export const awsUpload = (fileId, file, uploadSucces) => {
  s3.upload(createUploadParams(fileId, file), function (err, data) {
    if (err) {
      console.log("Error", err);
      uploadSucces.push(false);
    }
    if (data) {
      console.log("Upload Success", data.Location);
      uploadSucces.push(true);
    }
  });
};
