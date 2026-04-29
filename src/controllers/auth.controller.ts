import { NextFunction, Request, Response } from "express";
import AuthService from "../service/auth.service";
import axios from "axios";

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await AuthService.register(req.body);
    const loginResult = await AuthService.login({ 
        email: user.email, 
        password: req.body.password 
    });

    return res.status(201).json({
      message: "User registered successfully",
      data: loginResult,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await AuthService.login(req.body);
    return res.status(200).json({
      message: "Login successful",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
