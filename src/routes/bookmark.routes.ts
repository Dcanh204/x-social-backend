import express from "express";
import { createBookmark, deleteBookmark } from "~/controllers/bookmark.controller.js";
import { authenticate } from "~/middlewares/auth/authentication.js";

const bookmarkRooter = express.Router();

bookmarkRooter.post("/", authenticate, createBookmark);
bookmarkRooter.delete("/:tweet_id", authenticate, deleteBookmark);

export default bookmarkRooter;
