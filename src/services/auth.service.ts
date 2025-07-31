import database from "~/config/db.js";
import User from "~/models/schema/User.schema.js";
import RefreshToken from "~/models/schema/RefreshToken.schema.js";
import { RegisterReqBody } from "~/types/auth.type.js";
import { hashPassword, comparePassword } from "~/utils/hash.js";
import {
  signAccessToken,
  signEmailVerifyToken,
  signForgotPasswordToken,
  signRefreshToken,
  verifyToken
} from "~/utils/signToken.js";
import { StatusCodes } from "http-status-codes";
import ApiError from "~/utils/ApiError.js";
import { ObjectId } from "mongodb";
import { UserVerifyStatus } from "~/constants/enums.js";

export const register = async (userData: RegisterReqBody) => {
  const { username, email, password } = userData;
  const user_id = new ObjectId();
  const email_verify_token = await signEmailVerifyToken(user_id);
  const existingUser = await database.users.findOne({ email: userData.email });

  if (existingUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Email already exists!");
  }

  const hashedPassword = await hashPassword(password);
  const result = await database.users.insertOne(
    new User({
      _id: user_id,
      username,
      email,
      password: hashedPassword,
      date_of_birth: new Date(userData.date_of_birth),
      email_verify_token
    })
  );

  return {
    id: result.insertedId.toString(),
    username,
    email,
    date_of_birth: new Date(userData.date_of_birth),
    email_verify_token
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

export const logout = async (refresh_token: string): Promise<void> => {
  const refreshTokenDoc = await database.refreshTokens.findOne({ token: refresh_token });
  if (!refreshTokenDoc) {
    throw new ApiError(StatusCodes.NOT_FOUND, "refresh_token not found!");
  }
  await database.refreshTokens.deleteOne({ _id: refreshTokenDoc._id });
};

export const refreshAccressToken = async (refresh_token: string) => {
  const decoded_refresh_token = await verifyToken({
    token: refresh_token,
    secretOrPublicKey: process.env.JWT_SECRET_REFRESH_TOKEN as string
  });

  const tokenInDB = await database.refreshTokens.findOne({ token: refresh_token });
  if (!tokenInDB) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Refresh token not found!");
  }

  const newAccessToken = await signAccessToken(decoded_refresh_token.user_id);
  return newAccessToken;
};

export const verifyEmail = async (email_token: string) => {
  const decoded_verify_email = await verifyToken({
    token: email_token,
    secretOrPublicKey: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN as string
  });

  if (!decoded_verify_email) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid and expired token");
  }

  const user_id = decoded_verify_email.user_id as string;

  const user = await database.users.findOne({
    _id: new ObjectId(user_id)
  });

  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  }

  if (user.email_verify_token === "") {
    throw new ApiError(StatusCodes.CONFLICT, "Email already verified");
  }

  await database.users.updateOne({ _id: new ObjectId(user_id) }, [
    {
      $set: {
        email_verify_token: "",
        user_verify_status: UserVerifyStatus.Verified,
        updated_at: "$$NOW"
      }
    }
  ]);
};

export const resend_verify_email = async (user_id: string) => {
  const user = await database.users.findOne({ _id: new ObjectId(user_id) });
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found!");
  }

  if (user.user_verify_status === UserVerifyStatus.Verified) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Account already verified");
  }

  const email_verify_token = await signEmailVerifyToken(user._id);

  await database.users.updateOne({ _id: new ObjectId(user_id) }, [
    {
      $set: {
        email_verify_token,
        updated_at: "$$NOW"
      }
    }
  ]);
};

export const forgotPassword = async (email: string) => {
  const user = await database.users.findOne({ email });
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Email does not exist");
  }
  const forgot_password_token = await signForgotPasswordToken(user._id);

  await database.users.updateOne({ _id: new ObjectId(user._id) }, [
    {
      $set: {
        forgot_password_token,
        updated_at: "$$NOW"
      }
    }
  ]);
};
