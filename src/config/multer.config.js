import multer from "multer";

//multer storage config
const storage = multer.memoryStorage();
export const uploadFiles = multer({ storage: storage });
