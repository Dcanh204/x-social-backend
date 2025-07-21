import express from "express";
import authRouter from "./auth.routes.js";
import userRouter from "./user.routes.js";
const rootRouter = express.Router();
// router auth
rootRouter.use("/auth", authRouter);
// router user
rootRouter.use("/users", userRouter);

export default rootRouter;
