import express from "express";
import { login, register } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.js";
import * as authValidation from "../validations/auth.validation.js";
const authRouter = express.Router();

authRouter.post("/login", validate(authValidation.login), login);
authRouter.post("/register", validate(authValidation.register), register);
export default authRouter;
