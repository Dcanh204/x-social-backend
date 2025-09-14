import express from "express";
import { createTweet, getTweetById, deleteTweetById } from "~/controllers/tweet.controller.js";
import { authenticate } from "~/middlewares/auth/authentication.js";
import { validate } from "~/middlewares/validate.js";
import * as tweetValidate from "~/validations/tweet.validation.js";

const tweetRouter = express.Router();

tweetRouter.post("/", authenticate, validate(tweetValidate.createTweet), createTweet);
tweetRouter.get("/:tweet_id", getTweetById);
tweetRouter.delete("/:tweet_id", authenticate, deleteTweetById);

export default tweetRouter;
