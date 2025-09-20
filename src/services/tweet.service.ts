import { StatusCodes } from "http-status-codes";
import { ObjectId, WithId } from "mongodb";
import database from "~/config/db.js";
import { TweetType } from "~/constants/enums.js";
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
  const results = await database.tweets
    .aggregate<Tweet>([
      {
        $match: {
          _id: new ObjectId(tweet_id)
        }
      },
      {
        $lookup: {
          from: "hashtags",
          localField: "hashtags",
          foreignField: "_id",
          as: "hashtags"
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "mentions",
          foreignField: "_id",
          as: "mentions"
        }
      },
      {
        $addFields: {
          mentions: {
            $map: {
              input: "$mentions",
              as: "mention",
              in: {
                _id: "$$mention._id",
                name: "$$mention.name",
                email: "$$mention.email"
              }
            }
          }
        }
      },
      {
        $lookup: {
          from: "bookmarks",
          localField: "_id",
          foreignField: "tweet_id",
          as: "bookmarks"
        }
      },
      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "tweet_id",
          as: "likes"
        }
      },
      {
        $lookup: {
          from: "tweets",
          localField: "_id",
          foreignField: "parent_id",
          as: "tweet_children"
        }
      },
      {
        $addFields: {
          bookmark_count: {
            $size: "$bookmarks"
          },
          like_count: {
            $size: "$likes"
          },
          retweet_count: {
            $size: {
              $filter: {
                input: "$tweet_children",
                as: "item",
                cond: {
                  $eq: ["$$item.type", TweetType.Retweet]
                }
              }
            }
          },
          comment_count: {
            $size: {
              $filter: {
                input: "$tweet_children",
                as: "item",
                cond: {
                  $eq: ["$$item.type", TweetType.Comment]
                }
              }
            }
          },
          quote_count: {
            $size: {
              $filter: {
                input: "$tweet_children",
                as: "item",
                cond: {
                  $eq: ["$$item.type", TweetType.QuoteTweet]
                }
              }
            }
          }
        }
      }
    ])
    .toArray();

  return results;
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

export const getTweetChildren = async ({
  tweet_id,
  tweet_type,
  limit,
  page
}: {
  tweet_id: string;
  tweet_type: TweetType;
  limit: number;
  page: number;
}) => {
  const results = await database.tweets
    .aggregate<Tweet>([
      {
        $match: {
          parent_id: new ObjectId(tweet_id),
          type: tweet_type
        }
      },
      {
        $lookup: {
          from: "hashtags",
          localField: "hashtags",
          foreignField: "_id",
          as: "hashtags"
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "mentions",
          foreignField: "_id",
          as: "mentions"
        }
      },
      {
        $addFields: {
          mentions: {
            $map: {
              input: "$mentions",
              as: "mention",
              in: {
                _id: "$$mention._id",
                name: "$$mention.name",
                email: "$$mention.email"
              }
            }
          }
        }
      },
      {
        $lookup: {
          from: "bookmarks",
          localField: "_id",
          foreignField: "tweet_id",
          as: "bookmarks"
        }
      },
      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "tweet_id",
          as: "likes"
        }
      },
      {
        $lookup: {
          from: "tweets",
          localField: "_id",
          foreignField: "parent_id",
          as: "tweet_children"
        }
      },
      {
        $addFields: {
          bookmarks: {
            $size: "$bookmarks"
          },
          likes: {
            $size: "$likes"
          },
          retweet_count: {
            $size: {
              $filter: {
                input: "$tweet_children",
                as: "item",
                cond: {
                  $eq: ["$$item.type", TweetType.Retweet]
                }
              }
            }
          },
          comment_count: {
            $size: {
              $filter: {
                input: "$tweet_children",
                as: "item",
                cond: {
                  $eq: ["$$item.type", TweetType.Comment]
                }
              }
            }
          },
          quote_count: {
            $size: {
              $filter: {
                input: "$tweet_children",
                as: "item",
                cond: {
                  $eq: ["$$item.type", TweetType.QuoteTweet]
                }
              }
            }
          }
        }
      },
      {
        $skip: limit * (page - 1)
      },
      {
        $limit: limit
      }
    ])
    .toArray();

  const total = await database.tweets.countDocuments({
    parent_id: new ObjectId(tweet_id),
    type: tweet_type
  });
  return {
    results,
    total
  };
};
