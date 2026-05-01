import { NextFunction, Request, Response } from "express";
import { createError } from "../helpers/error";
import authService from "../service/auth.service";
import { setSessionCookie } from "../helpers/auth";
import { Role } from "./roleChecker";

const SESSION_THRESHOLD = 3 * 24 * 60 * 60; // 3 days in seconds

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const sessionId = req.cookies?.session_id;
        if (!sessionId) throw createError("Unauthorized", 401);

        const session = await authService.validateSession(sessionId);
        if (session.ttl < SESSION_THRESHOLD) {
            const newLastActive = new Date();
            await authService.updateSession(sessionId, session.user_id, newLastActive);
            session.last_active = newLastActive;
            setSessionCookie(res, sessionId);
        }

        req.user = { id: session.user_id, role: session.role as Role };
        req.session = {
            id: sessionId,
            last_active: session.last_active,
        }

        next();

    } catch (err) {
        next(err);
    }
}