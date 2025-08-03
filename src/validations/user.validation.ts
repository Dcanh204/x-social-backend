import Joi from "joi";

export const updateUser = Joi.object({
  name: Joi.string(),
  date_of_birth: Joi.date().max("now").iso(),
  bio: Joi.string(),
  location: Joi.string(),
  website: Joi.string(),
  avatar: Joi.string(),
  cover_photo: Joi.string()
});
