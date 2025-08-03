import { ObjectId } from "mongodb";
import database from "~/config/db.js";
import { UpdateMeReqBody } from "~/interfaces/user.interface.js";

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
