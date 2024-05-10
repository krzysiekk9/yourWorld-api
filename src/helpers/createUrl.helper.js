export const createFileUrl = (bucketName, bucketRegion, id) => {
  return `https://${bucketName}.s3.${bucketRegion}.amazonaws.com/${id}`;
};
