import { Request, Response } from "express";
import { catchAsync } from "~/utils/catchAsync.js";
import * as likeService from "~/services/like.service.js";
import { JwtPayload } from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
export const like = catchAsync(async (req: Request, res: Response) => {
  const { user_id } = req.user as JwtPayload;
  const result = await likeService.like(user_id, req.body.tweet_id);
  res.status(StatusCodes.OK).json({
    message: "Like successfully",
    result
  });
});
