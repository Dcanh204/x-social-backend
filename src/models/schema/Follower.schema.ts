import { ObjectId } from "mongodb";

interface FollowerType {
  _id?: ObjectId;
  follower_id: ObjectId;
  following_id: ObjectId;
  created_at?: Date;
}

export default class Follower {
  _id?: ObjectId;
  follower_id: ObjectId;
  following_id: ObjectId;
  created_at?: Date;

  constructor({ _id, follower_id, following_id, created_at }: FollowerType) {
    this._id = _id;
    this.follower_id = follower_id;
    this.following_id = following_id;
    this.created_at = created_at || new Date();
  }
}
