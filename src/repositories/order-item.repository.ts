import { Transaction } from "sequelize";
import { Inventory, OrderItem } from "../models";


export type OrderItemBase = {
    id: string,
    order_id: string,
    product_id: string,
    listing_id?: string | null,
    quantity: number,
    price: number,
    unit_price: number,
    created_at: Date,
    updated_at: Date,
};
export type CreateOrderItemResult = Omit<OrderItemBase, 'order_id' | 'product_id'> & {
    order_id?: string,
    product_id?: string,
}


export const getProductsForOrder = async (ids: string[], transaction: Transaction) => {
    const products = await Inventory.findAll({ 
        where: { id: ids },
        transaction,
        lock: transaction.LOCK.UPDATE
    });
    return products;
}


export const updateProductQuantity = async (id: string, quantity: number, transaction: Transaction): Promise<void> => {
    await Inventory.update({quantity}, { where: { id }, transaction});
}

export const createOrderItem = async (data: OrderItemBase, transaction: Transaction): Promise<CreateOrderItemResult> => {
    const orderItem = await OrderItem.create(data, { transaction });
    return orderItem;
}