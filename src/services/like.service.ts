import { StatusCodes } from "http-status-codes";
import { ObjectId, ReturnDocument } from "mongodb";
import database from "~/config/db.js";
import Like from "~/models/schema/Like.schema.js";
import ApiError from "~/utils/ApiError.js";

export const like = async (user_id: string, tweet_id: string) => {
  const result = await database.likes.findOneAndUpdate(
    {
      user_id: new ObjectId(user_id),
      tweet_id: new ObjectId(tweet_id)
    },
    {
      $setOnInsert: new Like({
        user_id: new ObjectId(user_id),
        tweet_id: new ObjectId(tweet_id)
      })
    },
    {
      upsert: true,
      returnDocument: "after"
    }
  );
  return result;
};

export const unlike = async (user_id: string, tweet_id: string) => {
  const result = await database.likes.findOneAndDelete({
    user_id: new ObjectId(user_id),
    tweet_id: new ObjectId(tweet_id)
  });

  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Like not found");
  }
  return result;
};
