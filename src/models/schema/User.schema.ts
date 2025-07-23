import { ObjectId } from "mongodb";
import { UserVerifyStatus } from "~/constants/enums.js";

export interface UserType {
  _id?: ObjectId;
  username: string;
  email: string;
  date_of_birth: Date;
  password: string;
  created_at?: Date;
  updated_at?: Date;
  email_verify_token?: string;
  forgot_password_token?: string;
  user_verify_status?: UserVerifyStatus;
  bio?: string;
  location?: string;
  website?: string;
  name?: string;
  avatar?: string;
  cover_photo?: string;
}

export default class User {
  _id?: ObjectId;
  username: string;
  email: string;
  date_of_birth: Date;
  password: string;
  created_at: Date;
  updated_at: Date;
  email_verify_token: string;
  forgot_password_token: string;
  user_verify_status: UserVerifyStatus;

  bio: string;
  location: string;
  website: string;
  name: string;
  avatar: string;
  cover_photo: string;

  constructor(user: UserType) {
    this._id = user._id;
    this.username = user.username;
    this.email = user.email;
    this.date_of_birth = user.date_of_birth;
    this.password = user.password;
    this.email_verify_token = user.email_verify_token || "";
    this.forgot_password_token = user.forgot_password_token || "";
    this.user_verify_status = user.user_verify_status || UserVerifyStatus.Unverified;
    this.name = user.name || "";
    this.bio = user.bio || "";
    this.location = user.location || "";
    this.website = user.website || "";
    this.avatar = user.avatar || "";
    this.cover_photo = user.cover_photo || "";
    this.created_at = user.created_at || new Date();
    this.updated_at = user.updated_at || new Date();
  }
}
