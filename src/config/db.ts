import { Collection, Db, MongoClient } from "mongodb";
import dotenv from "dotenv";
import User from "../models/schema/User.schema.js";
import RefreshToken from "~/models/schema/RefreshToken.schema.js";
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
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (error) {
      console.log(error);
    }
  }

  get users(): Collection<User> {
    return this.db.collection("users");
  }

  get refreshTokens(): Collection<RefreshToken> {
    return this.db.collection("refreshTokens");
  }
}

const database = new Database();

export default database;
