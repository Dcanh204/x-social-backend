import express from "express";
import { createBookmark } from "~/controllers/bookmark.controller.js";
import { authenticate } from "~/middlewares/auth/authentication.js";

const bookmarkRooter = express.Router();

bookmarkRooter.post("/", authenticate, createBookmark);
export default bookmarkRooter;
