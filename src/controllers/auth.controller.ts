import { Request, Response } from "express";
import * as authService from "~/services/auth.service.js";
import { RegisterReqBody } from "~/types/auth.type.js";
import { catchAsync } from "~/utils/catchAsync.js";
export const login = (req: Request, res: Response) => {
  res.send("hello world");
};

export const register = catchAsync(async (req: Request<object, any, RegisterReqBody>, res: Response): Promise<void> => {
  const user = await authService.register(req.body);
  res.status(201).json({
    message: "Register success",
    data: user
  });
});
