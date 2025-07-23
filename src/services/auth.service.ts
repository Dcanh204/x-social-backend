import database from "~/config/db.js";
import User from "~/models/schema/User.schema.js";
import { RegisterReqBody } from "~/types/auth.type.js";
import { hashPassword } from "~/utils/hash.js";
import { signAccessToken, signRefreshToken } from "~/utils/signToken.js";
import { StatusCodes } from "http-status-codes";
import ApiError from "~/utils/ApiError.js";

export const register = async (userData: RegisterReqBody) => {
  const { username, email, password } = userData;
  const existingUser = await database.users.findOne({ email: userData.email });

  if (existingUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Email already exists!");
  }

  const hashedPassword = await hashPassword(password);
  const result = await database.users.insertOne(
    new User({
      username,
      email,
      password: hashedPassword,
      date_of_birth: new Date(userData.date_of_birth)
    })
  );

  const user_id = result.insertedId.toString();

  const access_token = await signAccessToken(user_id);
  const refresh_token = await signRefreshToken(user_id);

  return {
    access_token,
    refresh_token
  };

  // return {
  //   id: result.insertedId.toString(),
  //   username,
  //   email,
  //   date_of_birth: new Date(userData.date_of_birth)
  // };
};
