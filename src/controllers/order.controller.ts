import { Request, Response, NextFunction } from "express";
import { CreateOrderBody, GetOrderParam, GetOrdersForAdminQuery, UpdateOrderBody } from "../validators/order.validator";
import { OrderService } from "../service/order.service";
import Postgres from "../connection/postgres";
import { createError } from "../helpers/error";


const orderService = new OrderService();
export const createOrder = async (req: Request<{}, any, CreateOrderBody>, res: Response, next: NextFunction) => {
    const transaction = await Postgres.getInstance().transaction();
    const body = req.body;
    const user_id = req.user?.id;
    try {
        if (!user_id) throw createError("Forbidden", 403);
        const order = await orderService.create(user_id, body, transaction)
        
        await transaction.commit();

        res.status(201).json({
            success: true,
            message: "Order created",
            data: order
        });
    } catch(error: any) {
        await transaction.rollback();
        next(error);
    }
} 

export const getOrder = async (req: Request<GetOrderParam>, res: Response, next: NextFunction) => {
    const transaction = await Postgres.getInstance().transaction();
    const role = req.user?.role;
    const userId = req.user?.id;
    const orderId = req.params.id;
    try {
        if (!userId) throw createError('Forbidden', 403);
        if (!role) throw createError('Forbidden', 403);
        
        const order = await orderService.getOrder(orderId, userId, role, transaction);
        res.status(200).json(order);
        await transaction.commit();

    } catch(error) {
        await transaction.rollback();
        next(error);
    }
}

export const getOrders = async (req: Request<{}, any, {}, any>, res: Response, next: NextFunction) => {
    const transaction = await Postgres.getInstance().transaction();
    const role = req.user?.role;
    const userId = req.user?.id;
    const payload = (req as any).validated?.query as GetOrdersForAdminQuery;

    try {
        if (!userId) throw createError('Forbidden', 403);
        if (!role) throw createError('Forbidden', 403);

        const orders = await orderService.getOrders(payload, userId, role, transaction);
        res.status(200).json(orders);
        await transaction.commit();

    } catch(error) {
        await transaction.rollback();
        next(error);
    }
}

export const updateOrder = async (req: Request<GetOrderParam, any, UpdateOrderBody, any>, res: Response, next: NextFunction) => {
    const transaction = await Postgres.getInstance().transaction();
    const body = req.body;
    const order_id = req.params.id;
    const user_id = req.user?.id;
    const role = req.user?.role;
    try {
        if (!user_id) throw createError("Forbidden", 403);
        if (!role) throw createError("Forbidden", 403);
        if (body.status === 'rejected' && req.user?.role !== 'admin') throw createError("Forbidden", 403);
        const order = await orderService.update(order_id, user_id, role, body, transaction);
        
        await transaction.commit();
        
        res.status(200).json({
            success: true,
            message: "Order updated",
            data: order
        });

    } catch(error) {
        await transaction.rollback();
        next(error);
    }
}