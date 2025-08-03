import * as userService from "~/services/user.service.js";
import { Request, Response } from "express";
import { catchAsync } from "~/utils/catchAsync.js";
import { JwtPayload } from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";

export const getProfile = catchAsync(async (req: Request, res: Response) => {
  const { user_id } = req.user as JwtPayload;
  const user = await userService.getProfile(user_id);
  res.status(StatusCodes.OK).json({
    message: "get profile success",
    data: user
  });
});

export const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const { user_id } = req.user as JwtPayload;
  const updatedUser = await userService.updatedProfile(user_id, req.body);
  res.status(StatusCodes.OK).json({
    message: "Updated profile successfully",
    data: updatedUser
  });
});

export const follow = catchAsync(async (req: Request, res: Response) => {
  const { user_id } = req.user as JwtPayload;
  const following_id = req.params.id;
  await userService.follow(user_id, following_id);
  res.status(StatusCodes.OK).json({
    message: "Follow success"
  });
});
