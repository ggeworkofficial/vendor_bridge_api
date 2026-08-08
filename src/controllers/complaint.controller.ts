import { Request, Response, NextFunction } from 'express';
import { ComplaintService } from '../service/complaint.service';
import { CreateComplaintBody, GetComplaintParam, GetComplaintsQuery, UpdateComplaintBody } from '../validators/complaint.validator';
import { createError } from '../helpers/error';

const complaintService = new ComplaintService();

export const createComplaint = async (req: Request<{}, any, CreateComplaintBody>, res: Response, next: NextFunction) => {
    const data = req.body;
    const user_id = req.user?.id;
    try {
    if(!user_id) throw createError("Forbidden", 403);
    const complaint = await complaintService.create(user_id, data);
    res.status(201).json({
      success: true,
      message: 'Complaint created',
      data: complaint,
    });
  } catch (error) {
    next(error);
  }
};

export const getComplaint = async (req: Request<GetComplaintParam>, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const user_id = req.user?.id;
    const user_role = req.user?.role;
    try {
        if(!user_id) throw createError("Forbidden", 403);
        if(!user_role) throw createError("Forbidden", 403);

        const result = await complaintService.getOne(id, user_id, user_role);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const getAllComplaints = async (req: Request<{}, any, {}, any>, res: Response, next: NextFunction) => {
    const user_id = req.user?.id;
    const user_role = req.user?.role;
    const query = (req as any).validated?.query as GetComplaintsQuery;
    try {
        if(!user_id) throw createError("Forbidden", 403);
        if(!user_role) throw createError("Forbidden", 403);

        const result = await complaintService.getAll(user_id, user_role, query);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const updateComplaint = async (req: Request<GetComplaintParam, any, UpdateComplaintBody>, res: Response, next: NextFunction) => {
    const user_id = req.user?.id;
    const user_role = req.user?.role;
    const complaint_id = req.params.id;
    const data = req.body;
    try {
    if(!user_id) throw createError("Forbidden", 403);
    if(!user_role) throw createError("Forbidden", 403);

    const result = await complaintService.update(complaint_id, user_id, user_role, data);
    res.status(200).json({
      success: true,
      message: 'Complaint updated',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// export const deleteComplaint = async (req: Request<GetComplaintParam>, res: Response, next: NextFunction) => {
//     const complaint_id = req.params.id;
//     const user_id = req.user?.id;
//     const user_role = req.user?.role;
//     try {
//         if(!user_id) throw createError("Forbidden", 403);
//         if(!user_role) throw createError("Forbidden", 403);

//         const result = await complaintService.remove(complaint_id, user_id, user_role);
//         res.status(200).json({
//         success: result,
//         message: 'Complaint deleted',
//         });
//     } catch (error) {
//         next(error);
//   }
// };
