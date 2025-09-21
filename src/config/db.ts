import { Collection, Db, MongoClient } from "mongodb";
import dotenv from "dotenv";
import User from "../models/schema/User.schema.js";
import RefreshToken from "~/models/schema/RefreshToken.schema.js";
import Follower from "~/models/schema/Follower.schema.js";
import Tweet from "~/models/schema/Tweet.schema.js";
import Hashtag from "~/models/schema/Hashtag.schema.js";
import Bookmark from "~/models/schema/Bookmark.schema.js";
import Like from "~/models/schema/Like.schema.js";
dotenv.config();

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@x-social.7fxqhfj.mongodb.net/?retryWrites=true&w=majority&appName=X-SOCIAL`;

class Database {
  private client: MongoClient;
  private db: Db;
  constructor() {
    this.client = new MongoClient(uri);
    this.db = this.client.db(process.env.DB_NAME);
  }

  async connect() {
    try {
      // Send a ping to confirm a successful connection
      await this.db.command({ ping: 1 });
      await this.indexTweet();
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (error) {
      console.log(error);
    }
  }
  async indexTweet() {
    const exists = await this.tweets.indexExists(["content_text"]);
    if (!exists) {
      await this.tweets.createIndex({ content: "text" });
    }
  }

  get users(): Collection<User> {
    return this.db.collection("users");
  }

  get refreshTokens(): Collection<RefreshToken> {
    return this.db.collection("refreshTokens");
  }
  get followers(): Collection<Follower> {
    return this.db.collection("followers");
  }

  get tweets(): Collection<Tweet> {
    return this.db.collection("tweets");
  }

  get hashtags(): Collection<Hashtag> {
    return this.db.collection("hashtags");
  }

  get bookmarks(): Collection<Bookmark> {
    return this.db.collection("bookmarks");
  }

  get likes(): Collection<Like> {
    return this.db.collection("likes");
  }
}

const database = new Database();

export default database;
