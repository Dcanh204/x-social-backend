import { Request, Response } from "express";
import * as authService from "~/services/auth.service.js";
import { RegisterReqBody } from "~/types/auth.type.js";
import { catchAsync } from "~/utils/catchAsync.js";
import { StatusCodes } from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";

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

export const logout = catchAsync(async (req: Request, res: Response) => {
  const { refresh_token } = req.body;
  await authService.logout(refresh_token);
  res.status(StatusCodes.OK).json({
    message: "Logout sucess"
  });
});

export const refreshAccessToken = catchAsync(async (req: Request, res: Response) => {
  const { refresh_token } = req.body;
  const newAccessToken = await authService.refreshAccressToken(refresh_token);
  res.status(StatusCodes.OK).json({
    message: "refresh access token sucess",
    access_token: newAccessToken
  });
});

export const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  const { email_verify_token } = req.body;
  await authService.verifyEmail(email_verify_token);
  res.status(StatusCodes.OK).json({
    message: "email verified successfully"
  });
});

export const resend_verify_email = catchAsync(async (req: Request, res: Response) => {
  const { user_id } = req.user as JwtPayload;
  await authService.resend_verify_email(user_id);
  res.status(StatusCodes.OK).json({
    message: "Resend verify email successfully"
  });
});
