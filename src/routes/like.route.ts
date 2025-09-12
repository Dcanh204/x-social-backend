import express from "express";
import { like, unlike } from "~/controllers/like.controller.js";
import { authenticate } from "~/middlewares/auth/authentication.js";

const likeRooter = express.Router();
likeRooter.post("/", authenticate, like);
likeRooter.delete("/:tweet_id", authenticate, unlike);
export default likeRooter;
