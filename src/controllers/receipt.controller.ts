import { Response, Request, NextFunction } from "express";
import { CreateReceiptBody, GetReceiptParam, GetReceiptsQuery, UpdateReceiptsBody } from "../validators/receipt.validator";
import Postgres from "../connection/postgres";
import { deleteFiles } from "../utils/cleanUpFile";
import { ReceiptService } from "../service/receipt.service";
import { createError } from "../helpers/error";


const receiptService = new ReceiptService();
export const createReceiptController = async (req: Request<{}, any, CreateReceiptBody>, res: Response, next: NextFunction) => {
    const transaction = await Postgres.getInstance().transaction();
    const body = req.body;
    const user_id = req.user?.id;
    const files = req.files as Express.Multer.File[] || [];
    const fileName = files.map(file => file.filename)[0];

    try {
        if (!user_id) throw createError("Forbidden", 403);
        if (!fileName) throw createError("Receipt file is required", 400);

        const receipt = await receiptService.create(user_id, body, fileName, transaction);
        res.status(201).json({
            success: true,
            message: "Receipt created",
            data: receipt
        });

        await transaction.commit();

    } catch(error) {
        await transaction.rollback();
        if (fileName) await deleteFiles([fileName]);
        next(error);
    }
}

export const getReceiptController = async (req: Request<GetReceiptParam>, res: Response, next: NextFunction) => {
    const user_id = req.user?.id;
    const user_role = req.user?.role;
    const receipt_id = req.params.id;
    try {
        if (!user_id) throw createError("Forbidden", 403);
        if (!user_role) throw createError("Forbidden", 403);
        const receipt = await receiptService.getReceipt(receipt_id, user_id, user_role);
        res.status(200).json(receipt);
    }
    catch(error) {
        next(error);
    }
}

export const getReceipts = async (req: Request<{}, any, {}, any>, res: Response, next: NextFunction) => {
    const payload = (req as any).validated?.query as GetReceiptsQuery;
    const user_id = req.user?.id;
    const user_role = req.user?.role;

    try {
        if (!user_id) throw createError("Forbidden", 403);
        if (!user_role) throw createError("Forbidden", 403);
        const receipts = await receiptService.getReceipts(payload, user_id, user_role);
        res.status(200).json(receipts);

    } catch(error) {
        next(error);
    }
}

export const updateReceipt = async (req: Request<GetReceiptParam, any, UpdateReceiptsBody>, res: Response, next: NextFunction) => {
    const transaction = await Postgres.getInstance().transaction();
    const payload = req.body;
    const user_id = req.user?.id;
    const user_role = req.user?.role;
    const receipt_id = req.params.id;

    try {
        if (!user_id) throw createError("Forbidden", 403);
        if (!user_role) throw createError("Forbidden", 403);
        
        const receipt = await receiptService.update(receipt_id, payload, user_id, user_role, transaction);
        res.status(200).json({
            success: true,
            message: "Receipt modified",
            data: receipt
        });

        await transaction.commit();
    } catch(error){
        await transaction.rollback();
        next(error);
    }
    
}