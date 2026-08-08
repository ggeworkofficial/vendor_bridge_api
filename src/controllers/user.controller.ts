import { NextFunction, Request, Response } from "express";
import userService from "../service/user.service";
import { CreateUserPayload } from "../repositories/auth.repository";
import { FindUsersOptions } from "../repositories/user.repository";
import { CreateUserBody, GetOneUserParams, GetUserQuery, UpdateUserBody } from "../validators/user.validator";

export const createUser = async (req: Request<{}, any, CreateUserBody>, res: Response, next: NextFunction) => {
  try {
    const user = await userService.create(req.body);
    return res.status(201).json({success: true, message: "User created", data: user });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req: Request<GetOneUserParams>, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const user = await userService.findOne(id);
    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req: Request<{}, any, any, any>, res: Response, next: NextFunction) => {
  try {
    const query = (req as any).validated?.query as GetUserQuery;
    const result = await userService.findAll(query);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};


export const updateUser = async (req: Request<GetOneUserParams, any, UpdateUserBody>, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        const isAdmin = req.user?.role === "admin";
        const user = await userService.update(id, req.body, isAdmin);
        return res.status(200).json({ success: true, message: "User updated", data: user });

    } catch (error) {
        next(error);
    }
}

export const deleteUser = async (req: Request<GetOneUserParams>, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    await userService.delete(id);
    return res.status(200).json({ success: true, message: "User deleted" });
  } catch (error) {
    next(error);
  }
};
