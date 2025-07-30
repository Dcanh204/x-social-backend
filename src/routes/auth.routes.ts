import express from "express";
import { login, register, logout, refreshAccessToken, verifyEmail } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.js";
import * as authValidation from "../validations/auth.validation.js";
import { authenticate } from "~/middlewares/auth/authentication.js";
const authRouter = express.Router();

authRouter.post("/login", validate(authValidation.login), login);
authRouter.post("/register", validate(authValidation.register), register);
authRouter.post("/logout", validate(authValidation.refresh_token), authenticate, logout);
authRouter.post("/refresh-token", validate(authValidation.refresh_token), refreshAccessToken);
authRouter.post("/verify-email", validate(authValidation.verify_email), verifyEmail);
export default authRouter;
