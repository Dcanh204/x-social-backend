import express from "express";
import { getProfile } from "~/controllers/user.controller.js";
import { authenticate } from "~/middlewares/auth/authentication.js";
const userRouter = express.Router();

userRouter.get("/profiles", authenticate, getProfile);

export default userRouter;
