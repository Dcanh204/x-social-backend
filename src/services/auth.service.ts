import database from "~/config/db.js";
import User from "~/models/schema/User.schema.js";
import RefreshToken from "~/models/schema/RefreshToken.schema.js";
import { RegisterReqBody } from "~/interfaces/auth.interface.js";
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
import axios from "axios";

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

export const resetPassword = async (forgot_password_token: string, new_password: string) => {
  const user = await database.users.findOne({ forgot_password_token });

  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Invalid and expired token");
  }

  const decoded_token = await verifyToken({
    token: forgot_password_token,
    secretOrPublicKey: process.env.JWT_SECRET_FORGOT_PASSWORD_TOKEN as string
  });

  if (decoded_token.user_id !== user._id.toString()) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid Token ");
  }

  await database.users.updateOne(
    { _id: new ObjectId(user._id) },
    {
      $set: {
        password: await hashPassword(new_password),
        forgot_password_token: ""
      },
      $currentDate: {
        created_at: true
      }
    }
  );
};

export const getOauthGoogleToken = async (code: string) => {
  const body = {
    code,
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    grant_type: "authorization_code"
  };
  const { data } = await axios.post("https://oauth2.googleapis.com/token", body, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
  return data;
};

export const getGoogleUserInfo = async (id_token: string, access_token: string) => {
  const { data } = await axios.get("https://www.googleapis.com/oauth2/v1/userinfo", {
    params: {
      access_token,
      alt: "json"
    },
    headers: {
      Authorization: `Bearer ${id_token}`
    }
  });
  return data as {
    id: string;
    name: string;
    email: string;
    verified_email: string;
    picture: string;
    given_name: string;
    family_name: string;
  };
};

export const oAuthGoogle = async (code: string) => {
  const { id_token, access_token } = await getOauthGoogleToken(code);
  const googleUser = await getGoogleUserInfo(id_token, access_token);
  if (!googleUser.verified_email) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Google email not verified");
  }

  let user = await database.users.findOne({ email: googleUser.email });
  if (!user) {
    await database.users.insertOne(
      new User({
        username: googleUser.name,
        email: googleUser.email,
        avatar: googleUser.picture,
        date_of_birth: new Date(),
        password: ""
      })
    );
    user = await database.users.findOne({ email: googleUser.email });
  }
  if (!user) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Cannot create user from Google login");
  }
  const accessToken = await signAccessToken(user._id);
  const refreshToken = await signRefreshToken(user._id);

  await database.refreshTokens.updateOne(
    { user_id: user._id },
    {
      $set: {
        token: refreshToken
      }
    },
    { upsert: true }
  );

  return {
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      email: user.email,
      avatar: user.avatar
    }
  };
};
