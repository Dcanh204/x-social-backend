import { StatusCodes } from "http-status-codes";
import { ObjectId } from "mongodb";
import database from "~/config/db.js";
import { UpdateMeReqBody } from "~/interfaces/user.interface.js";
import Follower from "~/models/schema/Follower.schema.js";
import ApiError from "~/utils/ApiError.js";

export const getProfile = async (user_id: string) => {
  const user = await database.users.findOne(
    { _id: new ObjectId(user_id) },
    {
      projection: {
        password: 0,
        email_verify_token: 0,
        forgot_password_token: 0
      }
    }
  );
  return user;
};

export const updatedProfile = async (user_id: string, userData: UpdateMeReqBody) => {
  const userDoc = await database.users.findOneAndUpdate(
    {
      _id: new ObjectId(user_id)
    },
    {
      $set: {
        ...userData
      },
      $currentDate: {
        updated_at: true
      }
    },
    {
      returnDocument: "after",
      projection: {
        email_verify_token: 0,
        password: 0,
        forgot_password_token: 0
      }
    }
  );
  return userDoc;
};

export const follow = async (follower_id: string, following_id: string) => {
  if (follower_id === following_id) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "You cannot follow yourself");
  }
  const [user1, user2] = await Promise.all([
    database.users.findOne({ _id: new ObjectId(follower_id) }),
    database.users.findOne({ _id: new ObjectId(following_id) })
  ]);

  if (!user1 || !user2) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  }

  const follower = await database.followers.findOne({
    follower_id: new ObjectId(follower_id),
    following_id: new ObjectId(following_id)
  });

  if (follower) {
    throw new ApiError(StatusCodes.CONFLICT, "Already followed");
  }

  await database.followers.insertOne(
    new Follower({
      follower_id: new ObjectId(follower_id),
      following_id: new ObjectId(following_id)
    })
  );
};

export const unfollow = async (follower_id: string, following_id: string) => {
  const follow = await database.followers.findOne({
    follower_id: new ObjectId(follower_id),
    following_id: new ObjectId(following_id)
  });

  if (!follow) {
    throw new ApiError(StatusCodes.NOT_FOUND, "You don't follow this user");
  }

  await database.followers.deleteOne({ _id: follow._id });
};
