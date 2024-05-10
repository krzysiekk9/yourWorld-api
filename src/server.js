import express from "express";
import cors from "cors";

import { getDataRoute } from "./routes/getData.routes.js";
import { uploadRoute } from "./routes/upload.routes.js";

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/getData", getDataRoute);

app.use("/api/upload", uploadRoute);

app.listen(process.env.PORT || 3000, () => {
  console.log("App is running");
});
