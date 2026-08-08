import { Request, Response, NextFunction } from "express";
import LogisticsService from "../service/logistics.service";
import { CreateLogisticsBody, GetLogisticsParam, GetLogisticsQuery, UpdateLogisticsBody } from "../validators/logistics.validator";
import { createError } from "../helpers/error";

const logisticsService = new LogisticsService();

export const createLogistics = async (req: Request<{}, any, CreateLogisticsBody>, res: Response, next: NextFunction) => {
  const body = req.body;
  const user_id = req.user?.id;
  const user_role = req.user?.role;

  try {
    if (!user_id) throw createError('Forbidden', 403);
    if (!user_role) throw createError('Forbidden', 403);

    const logistics = await logisticsService.create(user_role, body);
    return res.status(201).json({ success: true, message: 'Logistics created', data: logistics });
  } catch (error) {
    next(error);
  }
};

export const getLogistics = async (req: Request<GetLogisticsParam>, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const user_id = req.user?.id;
  const user_role = req.user?.role;

  try {
    if (!user_id) throw createError('Forbidden', 403);
    if (!user_role) throw createError('Forbidden', 403);

    const logistics = await logisticsService.getOne(id, user_id, user_role);
    return res.status(200).json(logistics);
  } catch (error) {
    next(error);
  }
};

export const getLogisticsList = async (req: Request<{}, any, {}, any>, res: Response, next: NextFunction) => {
  const user_id = req.user?.id;
  const user_role = req.user?.role;
  const query = (req as any).validated?.query as GetLogisticsQuery;

  try {
    if (!user_id) throw createError('Forbidden', 403);
    if (!user_role) throw createError('Forbidden', 403);

    const logistics = await logisticsService.getAll(user_id, user_role, query);
    return res.status(200).json(logistics);
  } catch (error) {
    next(error);
  }
};

export const updateLogistics = async (req: Request<GetLogisticsParam, any, UpdateLogisticsBody>, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const body = req.body;
  const user_id = req.user?.id;
  const user_role = req.user?.role;

  try {
    if (!user_id) throw createError('Forbidden', 403);
    if (!user_role) throw createError('Forbidden', 403);

    const logistics = await logisticsService.update(id, user_role, body);
    return res.status(200).json({ success: true, message: 'Logistics updated', data: logistics });
  } catch (error) {
    next(error);
  }
};
