import { or, Transaction, WhereOptions } from "sequelize";
import { Order, OrderItem, User } from "../models";
import { PaymentMethod, PaymentStatus, OrderStatus } from "../models/order.model";
import { PaginationResponse } from "../types/pageination";


export type OrderBase = {
    id: string,
    user_id: string,
    status: OrderStatus;
    payment_status: PaymentStatus,
    payment_method: PaymentMethod,
    total_amount: number,
    address: string,
    referral_code?: string | null,
    created_at: Date,
    updated_at: Date,
    estimated_delivery?: Date
};
export type CreateOrderResult = Omit<OrderBase, 'user_id'> & {
    user_id?: string;
}
type UpdateOrder = Partial<{
    status: OrderStatus,
    payment_status: PaymentStatus  
}>;
type GetOrderResult = {
    page: number,
    limit: number,
    status?: OrderStatus,
    payment_status?: PaymentStatus,
    payment_method?: PaymentMethod,
    sort: 'total_amount' | 'created_at',
    order: 'asc' | 'desc',
}
export type OrderResult = Omit<OrderBase, "user_id"> & {
    user: {
        id: string,
        full_name: string,
    }
    products: {
        id: string,
        quantity: number,
        price: number,
    }[]
}

const mapOrder = (order: Order): OrderResult => {
    return {
        id: order.id,
        user: {
            id: order.user?.id || "",
            full_name: order.user?.full_name || ""
        },
        status: order.status,
        payment_status: order.payment_status,
        payment_method: order.payment_method,
        total_amount: order.total_amount,
        address: order.address,
        products: order.items?.map(item => ({
            id: item.product_id || "",
            quantity: item.quantity,
            price: item.price,
        })) || [],
        ...(order.estimated_delivery && {estimated_delivery: order.estimated_delivery}),
        created_at: order.created_at,
        updated_at: order.updated_at,
    }
}

export const createOrder = async (data: OrderBase, transaction: Transaction): Promise<CreateOrderResult> => {
    const order = await Order.create(data, { transaction });
    return order;
}

export const getOrder = async (id: string, transaction: Transaction): Promise<OrderResult | null> => {

    const order = await Order.findOne({
        where: {
            id: id,
        },
        include: [
            {model: User, attributes: ['id', 'full_name']},
            {model: OrderItem, attributes: ['product_id', 'quantity', 'price']},
        ],
        transaction
    });
    if (!order) return null;
    return mapOrder(order);
}

export const getOrders = async (payload: GetOrderResult, transaction: Transaction, user_id: string | null): Promise<PaginationResponse<OrderResult>> => {
    const { page, limit, status, payment_status, payment_method, sort, order } = payload;
    let where: WhereOptions<any> = {};
    const offset = (page - 1) * limit;

    if (user_id) where.user_id = user_id;

    if (status) where.status = status;
    if (payment_status) where.payment_status = payment_status;
    if (payment_method) where.payment_method = payment_method;

    const orders = await Order.findAndCountAll({
        where,
        limit,
        offset,
        order: [[sort, order]],
        include: [
            {model: User, attributes: ['id', 'full_name']},
            {model: OrderItem, attributes: ['product_id', 'quantity', 'price']},
        ],
        transaction,
    });

    const data = orders.rows.map(mapOrder);
    return {
        data, 
        meta: {
            page,
            limit,
            total: orders.count
        }
    }
}

export const updateOrder = async (id: string, payload: UpdateOrder, transaction: Transaction): Promise<OrderResult | null> => {
    await Order.update(payload, { where: {id}});
    return await getOrder(id, transaction);
}