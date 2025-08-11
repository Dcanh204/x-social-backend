import express from "express";
import { uploadImage } from "~/controllers/media.controller.js";

const mediaRouter = express.Router();

mediaRouter.post("/upload-image", uploadImage);
export default mediaRouter;
