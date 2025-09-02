import { ObjectId } from "mongodb";
import database from "~/config/db.js";
import { TweetRequestBody } from "~/interfaces/tweet.interface.js";
import Tweet from "~/models/schema/Tweet.schema.js";

export const createTweet = async (user_id: string, body: TweetRequestBody) => {
  const result = await database.tweets.insertOne(
    new Tweet({
      audience: body.audience,
      content: body.content,
      hashtags: [],
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
