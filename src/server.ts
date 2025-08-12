import express, { Request, Response, NextFunction } from "express";
import database from "~/config/db.js";
import rootRouter from "~/routes/index.js";
import dotenv from "dotenv";
import { errorHandler } from "./middlewares/error.js";
import { initFolderUploads } from "~/utils/fileUpload.js";
import path from "path";
import { fileURLToPath } from "url";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8888;
// create folder uploads
initFolderUploads();

// static file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/images", express.static(path.join(__dirname, "../uploads")));

//convert body to JSON
app.use(express.json());

// connect to mongoDB
database.connect();
// router
app.use("/api", rootRouter);

//middlware Error handler
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
