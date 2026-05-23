import { User } from "../models"
import Order, { PaymentMethod, PaymentStatus } from "../models/order.model"
import Receipt, { ReceiptStatus } from "../models/receipt.model"
import { PaginationResponse } from "../types/pageination"
import { Op, Transaction, WhereOptions } from "sequelize"
import { mapReceiptImage } from "../utils/imageMapper"


export type ReceiptBase = {
    id: string,
    order_id: string,
    amount: number,
    payment_method: PaymentMethod,
    account?: string,
    file_url: string,
    status: ReceiptStatus,
    note?: string,
    created_at: Date,
    updated_at: Date
}
export type CreateReceiptResult = Omit<ReceiptBase, 'order_id'> & {
    order_id?: string,
}
type GetReceiptPayload = {
    page: number,
    limit: number,
    payment_method?: PaymentMethod,
    status?: ReceiptStatus,
    search?: string,
    sort: 'amount' | 'created_at',
    order: 'asc' | 'desc',
}

export type ReceiptResult = Omit<ReceiptBase, 'order_id'> & {
    file_name: string,
    order: {
        id: string,
        user: {
            id: string,
            full_name: string,
        }
    }
};

type UpdateReceiptOptions = Partial<{
    status: ReceiptStatus,
    note: string,
}>;

const mapReceipt = (receipt: Receipt): ReceiptResult => {
    return {
        id: receipt.id,
        amount: receipt.amount,
        payment_method: receipt.payment_method,
        account: receipt.account,
        file_name: mapReceiptImage(receipt.file_url).image_name,
        file_url: mapReceiptImage(receipt.file_url).image_url,
        status: receipt.status,
        note: receipt.note || "",
        created_at: receipt.created_at,
        updated_at: receipt.updated_at,
        order:  {
            id: receipt.order!.id,
            user: {
                id: receipt.order!.user!.id,
                full_name: receipt.order!.user!.full_name
            }
        }
    }
}

export const createReceipt = async (data: ReceiptBase, transaction: Transaction): Promise<CreateReceiptResult> => {
    const receipt = await Receipt.create(data, { transaction });
    return receipt;
}

export const getOrderByUserId = async (order_id: string, user_id: string): Promise<Order | null> => {
    const order = await Order.findOne({
        where: { id: order_id, user_id },
    });
    return order;
}

export const getPendingReceiptByOrder = async (id: string, transaction: Transaction): Promise<string[] | null> => {
    const receipt = await Receipt.findAll({
        where: { order_id: id, status: 'pending_review'}
    });

    return receipt.map(r => r.id);    
}

export const getReceipt = async (id: string, transaction?: Transaction): Promise<ReceiptResult | null> => {
    const where: WhereOptions<any> = { id };
    const t = transaction || null;
    const receipt = await Receipt.findOne({
        where,
        transaction: t,
        include: [{
            model: Order,
            attributes: ['id'],
            include: [
                {model: User, attributes: ['id', 'full_name']}
            ]
        }]
    });
    if (!receipt) return null;
    return mapReceipt(receipt);
}

export const getReceipts = async (payload: GetReceiptPayload, user_id: string | null): Promise<PaginationResponse<ReceiptResult>> => {
    const { page, limit, payment_method, status, search, sort, order} = payload;
    const where: WhereOptions<any> = {};
    const orderWhere: WhereOptions<any> = {};
    const offset = (page - 1) * limit;

    if (user_id) orderWhere.user_id = user_id;
    if (payment_method) where.payment_method = payment_method;
    if (status) where.status = status;
    
    if (search) {
        Object.assign(where, {
            [Op.or]: [
            { account: { [Op.iLike]: `%${search}%` } },
            { note: { [Op.iLike]: `%${search}%` } },
            ],
        });
    }

    const { rows, count } = await Receipt.findAndCountAll({
        where,
        limit,
        offset,
        order: [[sort, order]],
        include: [{
            model: Order,
            where: orderWhere,
            attributes: ['id'],
            include: [
                {model: User, attributes: ['id', 'full_name']}
            ]
        }]
    });

    return {
        data: rows.map(mapReceipt),
        meta: {
            page,
            limit,
            total: count
        }
    };
}

export const updateOrderPayment = async (id: string, payment_status: PaymentStatus, transaction: Transaction): Promise<void> => {
    await Order.update({payment_status}, { where: {id}, transaction})
}

export const updateReceipt = async (id: string, payload: UpdateReceiptOptions, transaction: Transaction): Promise<ReceiptResult | null> => {
    await Receipt.update(payload, { where: {id}, transaction});
    return await getReceipt(id, transaction);
}