import database from "~/config/db.js";
import User from "~/models/schema/User.schema.js";
import RefreshToken from "~/models/schema/RefreshToken.schema.js";
import { RegisterReqBody } from "~/types/auth.type.js";
import { hashPassword, comparePassword } from "~/utils/hash.js";
import { signAccessToken, signRefreshToken, signToken } from "~/utils/signToken.js";
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

  return {
    id: result.insertedId.toString(),
    username,
    email,
    date_of_birth: new Date(userData.date_of_birth)
  };
};

export const login = async (email: string, password: string) => {
  const user = await database.users.findOne({ email });
  if (!user || !(await comparePassword(password, user.password))) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Incorrent email and password");
  }

  const access_token = await signAccessToken(user._id);
  const refresh_token = await signRefreshToken(user._id);

  database.refreshTokens.insertOne(
    new RefreshToken({
      token: refresh_token,
      user_id: user._id
    })
  );

  return {
    access_token,
    refresh_token
  };
};
