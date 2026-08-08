import { Transaction } from "sequelize";
import { getOrder } from "../repositories/order.repository";
import { createReceipt, CreateReceiptResult, getOrderByUserId, getPendingReceiptByOrder, getReceipt, getReceipts, ReceiptResult, updateOrderPayment, updateReceipt } from "../repositories/receipt.repository";
import { CreateReceiptBody, GetReceiptsQuery, UpdateReceiptsBody } from "../validators/receipt.validator";
import { removeUndefined } from "../utils/removeUndefined";
import { Role } from "../middleware/roleChecker";
import { createError } from "../helpers/error";
import { ReceiptStatus } from "../models/receipt.model";
import { PaymentStatus } from "../models/order.model";
import { PaginationResponse } from "../types/pageination";


export class ReceiptService {

    async create(user_id: string, data: CreateReceiptBody, file_url: string, transaction: Transaction): Promise<CreateReceiptResult> {
        const existingPendingReceipts = await getPendingReceiptByOrder(data.order_id, transaction);

        if (existingPendingReceipts && existingPendingReceipts.length > 0) throw createError("Receipt already pending for review", 400);
        
        const order = await getOrderByUserId(data.order_id, user_id);
        if (!order) throw createError("Order not found", 404);

        if (order.payment_status === 'paid') throw createError("Order already paid", 400);

        const id = crypto.randomUUID();
        const payment_method = order.payment_method;
        const amount = order.total_amount;
        console.log(amount);
        const created_at = new Date();
        const updated_at = new Date();
        const status: ReceiptStatus = 'pending_review';
        const receipt_data = {id, ...data, status, file_url, payment_method, amount, created_at, updated_at};
        
        const cleanReciptData = removeUndefined(receipt_data)
        const receipt = await createReceipt(cleanReciptData, transaction);
        await updateOrderPayment(receipt.order_id!, 'pending_review', transaction);
        return receipt;
    }

    async getReceipt(id: string, user_id: string, user_role: Role): Promise<CreateReceiptResult> {
        const isUserAdmin = user_role === 'admin';
        const receipt = await getReceipt(id);

        if (!receipt) throw createError("Receipt not found", 404);
        if (!isUserAdmin && receipt.order.user.id !== user_id) throw createError("Forbidden", 403);
        
        return receipt;
    }

    async getReceipts(payload: GetReceiptsQuery, user_id: string, role: Role): Promise<PaginationResponse<ReceiptResult>> {
        const isUserAdmin = role === "admin";
        const cleanPayload = removeUndefined(payload);
        const receipts = await getReceipts(cleanPayload, isUserAdmin ? null : user_id);
        return receipts;
    }

    async update(id: string, data: UpdateReceiptsBody,  user_id: string, role: Role, transaction: Transaction): Promise<ReceiptResult> {
        const receipt = await getReceipt(id);

        if (!receipt) throw createError("Receipt not found", 404);
        if (receipt.status === 'approved') throw createError("Receipt already approved", 400);
        if (receipt.status === 'rejected') throw createError("Receip already rejected", 400);

        if (role !== 'admin' && 'status' in data) throw createError("Forbidden", 403);
        if (role !== 'admin' && receipt?.order.user.id !== user_id) throw createError("Forbidden", 403);

        const cleanData = removeUndefined(data);
        const modifiedReceipt = await updateReceipt(id, cleanData, transaction);
        if (data.status === 'approved') {
            await updateOrderPayment(modifiedReceipt!.order.id, 'paid', transaction);
        }

        if (data.status === 'rejected') {
            await updateOrderPayment(modifiedReceipt!.order.id, 'rejected', transaction);
        }

        return modifiedReceipt!;
    }

}