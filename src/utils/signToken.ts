import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { StringValue } from "ms";
import { TokenType } from "~/constants/enums.js";

export const signToken = ({
  payload,
  privateKey,
  options = {
    algorithm: "HS256"
  }
}: {
  payload: string | object;
  privateKey: string;
  options?: jwt.SignOptions;
}): Promise<string> => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, privateKey, options, (error, token) => {
      if (error || !token) {
        return reject(error);
      }
      resolve(token);
    });
  });
};

export const signAccessToken = (user_id: ObjectId) => {
  return signToken({
    payload: {
      user_id,
      token_type: TokenType.AccessToken
    },
    privateKey: process.env.JWT_SECRET_ACCESS_TOKEN as string,
    options: {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN as StringValue
    }
  });
};

export const signRefreshToken = (user_id: ObjectId) => {
  return signToken({
    payload: {
      user_id,
      token_type: TokenType.RefreshToken
    },
    privateKey: process.env.JWT_SECRET_REFRESH_TOKEN as string,
    options: {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN as StringValue
    }
  });
};

export const signEmailVerifyToken = (user_id: ObjectId) => {
  return signToken({
    payload: {
      user_id,
      TokenType: TokenType.EmailVerifyToken
    },
    privateKey: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN as string,
    options: {
      expiresIn: process.env.EMAIL_VERIFY_TOKEN_EXPIRES_IN as StringValue
    }
  });
};

export const signForgotPasswordToken = (user_id: ObjectId) => {
  return signToken({
    payload: {
      user_id,
      TokenType: TokenType.ForgotPasswordToken
    },
    privateKey: process.env.JWT_SECRET_FORGOT_PASSWORD_TOKEN as string,
    options: {
      expiresIn: process.env.FORGOT_PASSWORD_TOKEN_EXPIRES_IN as StringValue
    }
  });
};

export const verifyToken = ({ token, secretOrPublicKey }: { token: string; secretOrPublicKey: string }) => {
  return new Promise<jwt.JwtPayload>((resolve, reject) => {
    jwt.verify(token, secretOrPublicKey, (error, decoded) => {
      if (error) {
        return reject(error);
      }
      resolve(decoded as jwt.JwtPayload);
    });
  });
};
