import database from "../config/db.js";
import User from "../models/schema/User.schema.js";

export const register = async (username: string, email: string, password: string, date_of_birth: Date) => {
  const existingUser = await database.users.findOne({ email });

  if (existingUser) {
    throw new Error("Email already registerd");
  }

  const newUser = await database.users.insertOne(
    new User({
      username,
      email,
      password,
      date_of_birth
    })
  );

  return {
    username,
    id: newUser.insertedId,
    email,
    date_of_birth
  };
};
