import { NextFunction, Request, Response } from "express"
import { createError } from "../helpers/error"


export const checkOwnershipOrAdmin = (paramKey: string = "id", isAdminAllowed: boolean = true) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) throw createError("Unauthorized", 401);
        const resourceId = req.params[paramKey];

        if (req.user.role === "admin" && isAdminAllowed) return next();
        if (req.user.id !== resourceId) throw createError("Forbidden", 403);

        next();
    }
}