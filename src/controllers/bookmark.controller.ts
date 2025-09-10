import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { catchAsync } from "~/utils/catchAsync.js";
import * as bookmarkService from "~/services/bookmark.service.js";
import { StatusCodes } from "http-status-codes";

export const createBookmark = catchAsync(async (req: Request, res: Response) => {
  const { user_id } = req.user as JwtPayload;
  const result = await bookmarkService.createBookmark(user_id, req.body.tweet_id);
  res.status(StatusCodes.OK).json({
    message: "Create bookmark successfully",
    result
  });
});
