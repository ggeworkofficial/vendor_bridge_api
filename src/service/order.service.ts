import { Order, Transaction } from "sequelize";
import { createOrderItem, CreateOrderItemResult, getProductsForOrder, updateProductQuantity } from "../repositories/order-item.repository";
import { createOrder, CreateOrderResult, getOrder, getOrders, OrderResult, updateOrder } from "../repositories/order.repository";
import { CreateOrderBody, GetOrdersForAdminQuery, UpdateOrderBody } from "../validators/order.validator";
import { createError } from "../helpers/error";
import { OrderStatus, PaymentStatus } from "../models/order.model";
import { removeUndefined } from "../utils/removeUndefined";
import { Role } from "../middleware/roleChecker";
import { PaginationResponse } from "../types/pageination";
import { getReceipt } from "../repositories/receipt.repository";

type CreateOrderItemOptions = {
    products: { product_id: string, quantity: number }[],
    quantityMap: Map<string, number>,
    priceMap: Map<string, number>,
    order_id: string,
}

export class OrderService {
    private async createOrderItems(data: CreateOrderItemOptions, transaction: Transaction): Promise<CreateOrderItemResult[]> {
        let orderItems: CreateOrderItemResult[] = [];

        for (const product of data.products) {
            let mainQuantity = data.quantityMap.get(product.product_id);
            const price = data.priceMap.get(product.product_id);

            if ((mainQuantity === null || mainQuantity === undefined)  || (price === null || price === undefined)) throw createError("Product not found", 404);
            if (mainQuantity < product.quantity) throw createError("Insufficient stock", 400);
        
            mainQuantity -= product.quantity;

            await updateProductQuantity(
                product.product_id,
                mainQuantity,
                transaction
            );
            const id = crypto.randomUUID();
            const orderItem = await createOrderItem({id, order_id: data.order_id, ...product, price, created_at: new Date(), updated_at: new Date()}, transaction);
            orderItems.push(orderItem);
        }
        return orderItems;
    }


    async create(user_id: string, data: Omit<CreateOrderBody, 'user_id'>, transaction: Transaction): Promise<{order: CreateOrderResult, order_items: CreateOrderItemResult[]}> {
        const { payment_method, address} = data;
        const payment_status: PaymentStatus = 'unpaid';
        const order_id = crypto.randomUUID();
        const status: OrderStatus = 'pending';
        const inventory = await getProductsForOrder(data.products.map(product => product.product_id), transaction);
        const quantityMap = new Map(inventory.map(product => [product.id, product.quantity]));
        const priceMap = new Map(inventory.map(product => [product.id, product.price]));
        const total_amount = data.products.reduce((acc, product) => {
            const price = priceMap.get(product.product_id);
            
            if (price === null || price === undefined) throw createError("Product price is missing", 500);
            
            return acc + (product.quantity * price);
        }, 0);
        const order_data = {id: order_id, user_id, status, payment_status, payment_method, total_amount, address, created_at: new Date(), updated_at: new Date()};
        const order = await createOrder(order_data, transaction);
        const sortedProducts = [...data.products].sort((a, b) =>
                a.product_id.localeCompare(b.product_id)
        );

        const order_items = await this.createOrderItems({products: sortedProducts, quantityMap, priceMap, order_id}, transaction);
        return {order, order_items};
    }

    async getOrder(id: string, user_id: string, role: Role, transaction: Transaction): Promise<OrderResult> {
        const order = await getOrder(id, transaction);
        if (!order) throw createError("Order not found", 404);
        if (role !== 'admin' && order?.user.id !== user_id) throw createError("Forbidden", 403);
        return order;
    }

    async getOrders(payload: GetOrdersForAdminQuery, user_id: string, role: Role, transaction: Transaction): Promise<PaginationResponse<OrderResult>> {
        const isUserAdmin = role === "admin";
        const cleanPayload = removeUndefined(payload);
        const orders = await getOrders(cleanPayload, transaction, (!isUserAdmin) ? user_id : null);
        return orders;
    }

    async update(id: string, user_id: string, role: Role, payload: UpdateOrderBody, transaction: Transaction): Promise<OrderResult> {
        const order = await getOrder(id, transaction);
        
        if (!order) throw createError("Order not found", 404);
        if (role !== 'admin' && order?.user.id !== user_id) throw createError("Forbidden", 403);

        const isClosed = order.status === 'rejected' || order.status === 'cancelled';
        if (isClosed && payload.status && payload.status !== order.status) throw createError("Order already closed", 400);

        const isTryingToCloseOrder =
            payload.status === 'cancelled' ||
            payload.status === 'rejected';

        if (
            order.payment_status === 'paid' &&
            isTryingToCloseOrder
        ) {
            throw createError(
                "Paid orders cannot be cancelled or rejected",
                400
            );
        }
        
        if (role !== 'admin' && payload.status !== 'cancelled') throw createError("Forbidden", 403);

        if (payload && (payload.status === 'rejected' || payload.status === 'cancelled')) {
            if (order.status === 'rejected' || order.status === 'cancelled') throw createError("Order already closed", 400);
            if (order.status !== 'pending' && order.status !== 'confirmed') throw createError("Order already processed", 400);

           const sortedProducts = [...order.products].sort((a, b) =>
                a.id.localeCompare(b.id)
            );
            const products = await getProductsForOrder(sortedProducts.map(product => product.id), transaction);
            products.sort((a, b) => a.id.localeCompare(b.id));

            const inventoryQuantityMap = new Map(products.map(item => [item.id, item.quantity]));
            const orderedQuantityMap = new Map(order.products.map(product => [product.id, product.quantity]));
            
            for (const product of products) {
                const inventoryQuantity = inventoryQuantityMap.get(product.id);
                const orderedQuantity = orderedQuantityMap.get(product.id);
                
                if (inventoryQuantity === undefined) throw createError("Quantity is not found", 500);
                if (orderedQuantity === undefined) throw createError("Ordered quantity is not found", 500);

                const restoredQuantity = inventoryQuantity + orderedQuantity;
                await updateProductQuantity(product.id, restoredQuantity, transaction);

            }
        }

        const cleanData = removeUndefined(payload);
        const newOrder = await updateOrder(order.id, cleanData, transaction);
        
        if (!newOrder) throw createError("Order not found", 404);
        return newOrder;
    }
}