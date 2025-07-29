import Joi from "joi";

export const register = Joi.object({
  username: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(32).required(),
  confirm_password: Joi.valid(Joi.ref("password")).required(),
  date_of_birth: Joi.date().max("now").iso().required()
});

export const login = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(36).required()
});

export const refresh_token = Joi.object({
  refresh_token: Joi.string().min(20).required()
});
