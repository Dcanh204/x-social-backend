import Joi from "joi";

export const createTweet = Joi.object({
  type: Joi.number().integer().valid(0, 1, 2, 3).required(),
  audience: Joi.number().integer().valid(0, 1, 2, 3).required(),
  content: Joi.string().allow(""),
  parent_id: Joi.string().allow(""),
  hashtags: Joi.array().items(Joi.string()).required(),
  mentions: Joi.array().items(Joi.string()).required(),
  medias: Joi.array().items(Joi.string()).required()
});
