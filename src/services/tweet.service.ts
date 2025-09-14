import { StatusCodes } from "http-status-codes";
import { ObjectId, WithId } from "mongodb";
import database from "~/config/db.js";
import { TweetRequestBody } from "~/interfaces/tweet.interface.js";
import Hashtag from "~/models/schema/Hashtag.schema.js";
import Tweet from "~/models/schema/Tweet.schema.js";
import ApiError from "~/utils/ApiError.js";

export const checkandCreateHashtags = async (hashtags: string[]) => {
  const hashtagDoc = await Promise.all(
    hashtags.map((hashtag) => {
      return database.hashtags.findOneAndUpdate(
        { name: hashtag },
        {
          $setOnInsert: new Hashtag({ name: hashtag })
        },
        {
          upsert: true,
          returnDocument: "after"
        }
      );
    })
  );

  return hashtagDoc.map((hashtag) => (hashtag as WithId<Hashtag>)._id);
};

export const createTweet = async (user_id: string, body: TweetRequestBody) => {
  const hashtags = await checkandCreateHashtags(body.hashtags);
  const result = await database.tweets.insertOne(
    new Tweet({
      audience: body.audience,
      content: body.content,
      hashtags,
      mentions: body.mentions,
      medias: body.medias,
      parent_id: body.parent_id,
      type: body.type,
      user_id: new ObjectId(user_id)
    })
  );
  const tweet = await database.tweets.findOne({ _id: result.insertedId });
  return tweet;
};

export const getTweetById = async (tweet_id: string) => {
  const tweetDoc = await database.tweets.findOne({
    _id: new ObjectId(tweet_id)
  });

  if (!tweetDoc) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Tweet not found!");
  }

  return tweetDoc;
};

export const deleteTweetById = async (user_id: string, tweet_id: string) => {
  const tweetDoc = await database.tweets.findOneAndDelete({
    _id: new ObjectId(tweet_id),
    user_id: new ObjectId(user_id)
  });

  if (!tweetDoc) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Tweet not found!");
  }

  return tweetDoc;
};
