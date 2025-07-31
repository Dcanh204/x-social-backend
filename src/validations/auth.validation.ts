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

export const verify_email = Joi.object({
  email_verify_token: Joi.string().required()
});

export const forgot_password = Joi.object({
  email: Joi.string().email().required()
});

export const reset_password = Joi.object({
  forgot_password_token: Joi.string().required(),
  new_password: Joi.string().min(8).max(36).required(),
  comfirm_new_password: Joi.valid(Joi.ref("new_password")).required()
});
