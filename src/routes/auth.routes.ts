import express from "express";
import {
  login,
  register,
  logout,
  refreshAccessToken,
  verifyEmail,
  resend_verify_email,
  forgotPassword
} from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.js";
import * as authValidation from "../validations/auth.validation.js";
import { authenticate } from "~/middlewares/auth/authentication.js";
const authRouter = express.Router();

authRouter.post("/login", validate(authValidation.login), login);
authRouter.post("/register", validate(authValidation.register), register);
authRouter.post("/logout", validate(authValidation.refresh_token), authenticate, logout);
authRouter.post("/refresh-token", validate(authValidation.refresh_token), refreshAccessToken);
authRouter.post("/resend-verify-email", authenticate, resend_verify_email);
authRouter.post("/verify-email", validate(authValidation.verify_email), verifyEmail);
authRouter.post("/forgot-password", validate(authValidation.forgot_password), forgotPassword);
export default authRouter;
