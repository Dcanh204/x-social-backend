import Joi from "joi";

export const register = Joi.object({
  username: Joi.string().min(3).max(50).required().messages({
    "string.empty": "tên người dùng không được bỏ trống",
    "string.min": "Tên người dùng phải có ít nhất {#limit} ký tự",
    "string.max": "Tên người dùng không được vượt quá {#limit} ký tự",
    "any.required": "Tên người dùng là bắt buộc"
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Email không hợp lệ",
    "string.empty": "Email không được bỏ trống",
    "any.required": "Email là bắt buộc"
  }),
  password: Joi.string().min(8).max(32).required().messages({
    "string.empty": "Mật khẩu không được để trống",
    "any.required": "Mật khẩu là bắt buộc",
    "string.min": "Mật khẩu phải có ít nhất {#limit} ký tự",
    "string.max": "Mật khẩu không được vượt quá {#limit} ký tự"
  }),
  confirm_password: Joi.valid(Joi.ref("password")).required().messages({
    "any.only": "Xác nhận mật khẩu không khớp với mật khẩu",
    "string.empty": "Xác nhận mật khẩu không được bỏ trống",
    "any.required": "Xác nhận mật khẩu là bắt buộc"
  }),
  date_of_birth: Joi.date().max("now").iso().required().messages({
    "date.base": "ngày sinh không hợp lệ",
    "date.max": "Ngày sinh không được là ngày trong tương lai",
    "date.ios": "Ngày sinh không đúng định dạng YYYY-MM-DD",
    "any.required": "Ngày sinh là bắt buộc"
  })
});
