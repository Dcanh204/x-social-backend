import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { StringValue } from "ms";
import { TokenType } from "~/constants/enums.js";

export const signToken = ({
  payload,
  privateKey = process.env.JWT_SECRET_KEY as string,
  options = {
    algorithm: "HS256"
  }
}: {
  payload: string | object;
  privateKey?: string;
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
    options: {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN as StringValue
    }
  });
};

export const verifyToken = ({
  token,
  secretOrPublicKey = process.env.JWT_SECRET_KEY as string
}: {
  token: string;
  secretOrPublicKey?: string;
}) => {
  return new Promise<jwt.JwtPayload>((resolve, reject) => {
    jwt.verify(token, secretOrPublicKey, (error, decoded) => {
      if (error) {
        return reject(error);
      }
      resolve(decoded as jwt.JwtPayload);
    });
  });
};
