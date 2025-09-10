import { ObjectId, ReturnDocument } from "mongodb";
import database from "~/config/db.js";
import Bookmark from "~/models/schema/Bookmark.schema.js";

export const createBookmark = async (user_id: string, tweet_id: string) => {
  const result = await database.bookmarks.findOneAndUpdate(
    {
      user_id: new ObjectId(user_id),
      tweet_id: new ObjectId(tweet_id)
    },
    {
      $setOnInsert: new Bookmark({
        user_id: new ObjectId(user_id),
        tweet_id: new ObjectId(tweet_id)
      })
    },
    {
      upsert: true,
      returnDocument: "after"
    }
  );
  return {
    result
  };
};
