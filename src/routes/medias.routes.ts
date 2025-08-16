import express from "express";
import { uploadImage, uploadVideo } from "~/controllers/media.controller.js";

const mediaRouter = express.Router();

mediaRouter.post("/upload-image", uploadImage);
mediaRouter.post("/upload-video", uploadVideo);
export default mediaRouter;
