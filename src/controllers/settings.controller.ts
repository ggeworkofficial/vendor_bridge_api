import { Request, Response, NextFunction } from "express";
import { CreateSettingsBody, GetSettingsParams, GetSettingsQuery, UpdateSettingsBody } from "../validators/settings.validator";
import SettingsService from "../service/settings.service";
import { createError } from "../helpers/error";
import { removeUndefined } from "../utils/removeUndefined";

const settingsService = new SettingsService();

export const createSettings = async (req: Request<{}, any, CreateSettingsBody>, res: Response, next: NextFunction) => {
  try {
    const body = req.body;
    const user_role = req.user?.role;
    if (!user_role) throw createError("Forbidden", 403);
    const setting = await settingsService.createSettings(user_role, body);
    return res.status(201).json({ success: true, message: "Setting created", data: setting });
  } catch (error) {
    next(error);
  }
};

export const getSetting = async (req: Request<GetSettingsParams>, res: Response, next: NextFunction) => {
  try {
    const params = req.params;
    const user_role = req.user?.role;
    if (!user_role) throw createError("Forbidden", 403);

    const setting = await settingsService.getSetting(params, user_role);
    return res.status(200).json({ success: true, data: setting });
  } catch (error) {
    next(error);
  }
};

export const getSettings = async (req: Request<{}, any, {}, any>, res: Response, next: NextFunction) => {
  try {
    const user_role = req.user?.role;
    if (!user_role) throw createError("Forbidden", 403);
    const query = (req as any).validated?.query as GetSettingsQuery;
    const settings = await settingsService.getSettings(query, user_role);
    return res.status(200).json(settings);
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (req: Request<GetSettingsParams, any, UpdateSettingsBody>, res: Response, next: NextFunction) => {
  try {
    const params = req.params;
    const body = req.body;
    const user_role = req.user?.role;
    if (!user_role) throw createError("Forbidden", 403);

    const cleanBody = removeUndefined(body);
    const setting = await settingsService.updateSettings(user_role, { ...params, ...cleanBody });
    return res.status(200).json({ success: true, message: "Setting updated", data: setting });
  } catch (error) {
    next(error);
  }
};

export const deleteSettings = async (req: Request<GetSettingsParams>, res: Response, next: NextFunction) => {
  try {
    const params = req.params;
    const user_role = req.user?.role;
    if (!user_role) throw createError("Forbidden", 403);

    const success = await settingsService.deleteSettings(user_role, params);
    return res.status(204).send({ success, message: "Setting deleted" });
  } catch (error) {
    next(error);
  }
};
