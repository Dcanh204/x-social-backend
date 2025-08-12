import { Request, Response } from "express";
import { catchAsync } from "~/utils/catchAsync.js";
import * as mediaService from "~/services/media.service.js";
import { StatusCodes } from "http-status-codes";

export const uploadImage = catchAsync(async (req: Request, res: Response) => {
  const url = await mediaService.uploadImage(req);
  res.status(StatusCodes.OK).json({
    message: "upload image successfully",
    result: url
  });
});
