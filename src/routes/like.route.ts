import express from "express";
import { like } from "~/controllers/like.controller.js";
import { authenticate } from "~/middlewares/auth/authentication.js";

const likeRooter = express.Router();
likeRooter.post("/", authenticate, like);

export default likeRooter;
