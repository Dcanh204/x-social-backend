import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { catchAsync } from "~/utils/catchAsync.js";
import { handlerUploadImage } from "~/utils/fileUpload.js";

export const uploadImage = catchAsync(async (req: Request, res: Response) => {
  const data = await handlerUploadImage(req);
  res.json({
    result: data
  });
});
