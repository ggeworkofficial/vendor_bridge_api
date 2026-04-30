import { NextFunction, Request, Response } from "express";
import AuthService from "../service/auth.service";
import axios from "axios";
import { setSessionCookie } from "../helpers/auth";

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await AuthService.register(req.body);
    const loginResult = await AuthService.login({ 
        email: user.email, 
        password: req.body.password 
    });
    const { session_id, ...safeReuslt } = loginResult;
    setSessionCookie(res, session_id!);

    return res.status(201).json({
      message: "User registered successfully",
      data: safeReuslt,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await AuthService.login(req.body);
    const { session_id, ...safeResult} = user
    setSessionCookie(res, session_id!);

    return res.status(200).json({
      message: "Login successful",
      data: safeResult,
    });
  } catch (error) {
    next(error);
  }
};
