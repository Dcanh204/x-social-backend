import express from "express";
import { getProfile, updateProfile } from "~/controllers/user.controller.js";
import { authenticate } from "~/middlewares/auth/authentication.js";
import { validate } from "~/middlewares/validate.js";
import * as userValidation from "~/validations/user.validation.js";
const userRouter = express.Router();

userRouter.get("/me", authenticate, getProfile);
userRouter.patch("/me", validate(userValidation.updateUser), authenticate, updateProfile);

export default userRouter;
