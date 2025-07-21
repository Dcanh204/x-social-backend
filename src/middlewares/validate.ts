import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";

export const validate = (schema: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((err) => ({
        message: err.message,
        path: err.path
      }));
      return res.status(400).json({ errors });
    }
    req.body = value;
    next();
  };
};
