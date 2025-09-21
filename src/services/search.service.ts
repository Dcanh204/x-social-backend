import database from "~/config/db.js";
import { TweetType } from "~/constants/enums.js";
import Tweet from "~/models/schema/Tweet.schema.js";

export const search = async (content: string, limit: number, page: number) => {
  const results = await database.tweets
    .aggregate<Tweet>([
      {
        $match: {
          $text: {
            $search: content
          }
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
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $project: {
          user: {
            password: 0,
            email: 0,
            email_verify_token: 0,
            forgot_password_token: 0,
            user_verify_status: 0
          }
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
  return results;
};
