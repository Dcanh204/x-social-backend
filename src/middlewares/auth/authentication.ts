import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import ApiError from "~/utils/ApiError.js";
import { verifyToken } from "~/utils/signToken.js";

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization;
    if (!token || !token.startsWith("Bearer")) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Authorization token missing");
    }
    const access_token = token.split(" ")[1];

    const decoded_access_token = await verifyToken({
      token: access_token,
      secretOrPublicKey: process.env.JWT_SECRET_ACCESS_TOKEN as string
    });
    req.user = decoded_access_token;
    next();
  } catch (error: any) {
    next(new ApiError(StatusCodes.UNAUTHORIZED, error.message));
  }
};
