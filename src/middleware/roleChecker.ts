import { NextFunction, Request, Response } from "express"
import { createError } from "../helpers/error"

export type Role = "admin" | "buyer" | "contributor";
export const checkRole = (...roles: Role[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user)  throw createError("Unauthorized", 401);

        if (!req.user.role || !roles.includes(req.user.role)) {
            throw createError("Forbidden", 403);
        }

        next();
    }
}