import { Request, Response } from "express";
import * as authService from "../services/auth.service.js";

export const login = (req: Request, res: Response) => {
  res.send("hello world");
};

export const register = async (req: Request, res: Response) => {
  const { username, email, password, date_of_birth } = req.body;
  try {
    const user = await authService.register(username, email, password, date_of_birth);
    res.status(201).json({
      message: "Register success",
      data: user
    });
  } catch (error) {
    res.status(500).json({
      message: error
    });
  }
};
