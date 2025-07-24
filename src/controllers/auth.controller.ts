import { Request, Response } from "express";
import * as authService from "~/services/auth.service.js";
import { RegisterReqBody } from "~/types/auth.type.js";
import { catchAsync } from "~/utils/catchAsync.js";
import { StatusCodes } from "http-status-codes";

export const register = catchAsync(async (req: Request<object, any, RegisterReqBody>, res: Response) => {
  const user = await authService.register(req.body);
  res.status(StatusCodes.CREATED).json({
    message: "Register success",
    data: user
  });
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const tokens = await authService.login(email, password);
  res.status(StatusCodes.OK).json({
    message: "Login success",
    tokens
  });
});
