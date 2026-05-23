import { Request, Response, NextFunction } from 'express';
import { ComplaintMessageService } from '../service/complaint-message.service';
import { CreateComplaintMessageBody, GetComplaintMessageParam, GetComplaintMessagesQuery } from '../validators/complaint-message.validator';
import { createError } from '../helpers/error';

const complaintMessageService = new ComplaintMessageService();

export const createComplaintMessage = async (req: Request<{}, any, CreateComplaintMessageBody>, res: Response, next: NextFunction) => {
  const data = req.body;
  const user_id = req.user?.id;
  const user_role = req.user?.role;
  try {
    if (!user_id) throw createError('Forbidden', 403);
    if (!user_role) throw createError('Forbidden', 403);

    const result = await complaintMessageService.create(user_id, user_role, data);
    res.status(201).json({ success: true, message: 'Message created', data: result });
  } catch (error) {
    next(error);
  }
};

export const getComplaintMessage = async (req: Request<GetComplaintMessageParam>, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const user_id = req.user?.id;
  const user_role = req.user?.role;
  try {
    if (!user_id) throw createError('Forbidden', 403);
    if (!user_role) throw createError('Forbidden', 403);

    const result = await complaintMessageService.getOne(id, user_id, user_role);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getComplaintMessages = async (req: Request<{}, any, {}, any>, res: Response, next: NextFunction) => {
  const user_id = req.user?.id;
  const user_role = req.user?.role;
  const query = (req as any).validated?.query as GetComplaintMessagesQuery;
  try {
    if (!user_id) throw createError('Forbidden', 403);
    if (!user_role) throw createError('Forbidden', 403);

    const result = await complaintMessageService.getAll(user_id, user_role, query);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
