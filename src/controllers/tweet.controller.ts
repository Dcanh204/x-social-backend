import { Request, Response } from "express";
import { catchAsync } from "~/utils/catchAsync.js";
import * as tweetService from "~/services/tweet.service.js";
import { JwtPayload } from "jsonwebtoken";

export const createTweet = catchAsync(async (req: Request, res: Response) => {
  const { user_id } = req.user as JwtPayload;
  const result = await tweetService.createTweet(user_id, req.body);
  res.json({
    message: "Create Tweet Successfully",
    result
  });
});

export const getTweetById = catchAsync(async (req: Request, res: Response) => {
  const result = await tweetService.getTweetById(req.params.tweet_id);
  res.json({
    message: " Get Tweet Detail Successfully",
    result
  });
});

export const deleteTweetById = catchAsync(async (req: Request, res: Response) => {
  const { user_id } = req.user as JwtPayload;
  const result = await tweetService.deleteTweetById(user_id, req.params.tweet_id);
  res.json({
    message: " Delete Tweet Successfully",
    result
  });
});
