import express from "express";
import authRouter from "./auth.routes.js";
import userRouter from "./user.routes.js";
import mediaRouter from "./medias.routes.js";
const rootRouter = express.Router();
// router auth
rootRouter.use("/auth", authRouter);
// router user
rootRouter.use("/users", userRouter);
// router media
rootRouter.use("/medias", mediaRouter);

export default rootRouter;
