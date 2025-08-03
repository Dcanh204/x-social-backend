import { ObjectId } from "mongodb";
import database from "~/config/db.js";

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
