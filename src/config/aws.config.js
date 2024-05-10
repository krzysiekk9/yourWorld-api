import AWS from "aws-sdk";

//AWS config
export const bucketName = "s3bucket1yourworld2";
export const bucketRegion = "eu-north-1";

AWS.config.update({ region: bucketRegion });

export const s3 = new AWS.S3({
  credentails: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secrestAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export const createUploadParams = (fileId, file) => {
  return {
    Bucket: bucketName,
    Key: fileId,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: "public-read",
  };
};
