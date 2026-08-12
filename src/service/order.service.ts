import { Transaction } from "sequelize";
import { createOrderItem, CreateOrderItemResult, getProductsForOrder, updateProductQuantity } from "../repositories/order-item.repository";
import { createOrder, CreateOrderResult, getOrder, getOrders, OrderResult, updateOrder } from "../repositories/order.repository";
import { CreateOrderBody, GetOrdersForAdminQuery, UpdateOrderBody } from "../validators/order.validator";
import { createError } from "../helpers/error";
import { OrderStatus, PaymentStatus } from "../models/order.model";
import { removeUndefined } from "../utils/removeUndefined";
import { Role } from "../middleware/roleChecker";
import { PaginationResponse } from "../types/pageination";
import { Listing, ListingPriceTier, User, Referral } from "../models";

type CreateOrderItemOptions = {
    products: { product_id: string, listing_id?: string | null | undefined, quantity: number }[],
    quantityMap: Map<string, number>,
    priceMap: Map<string, number>,
    unitPriceMap: Map<string, number>,
    order_id: string,
}

export class OrderService {
    private async createOrderItems(data: CreateOrderItemOptions, transaction: Transaction): Promise<CreateOrderItemResult[]> {
        let orderItems: CreateOrderItemResult[] = [];

        for (const product of data.products) {
            let mainQuantity = data.quantityMap.get(product.product_id);
            const price = data.priceMap.get(product.product_id);
            const unit_price = data.unitPriceMap.get(product.product_id) || price;

            if ((mainQuantity === null || mainQuantity === undefined)  || (price === null || price === undefined) || (unit_price === null || unit_price === undefined)) throw createError("Product not found", 404);
            if (mainQuantity < product.quantity) throw createError("Insufficient stock", 400);
        
            mainQuantity -= product.quantity;

            await updateProductQuantity(
                product.product_id,
                mainQuantity,
                transaction
            );
            const id = crypto.randomUUID();
            const orderItem = await createOrderItem({id, order_id: data.order_id, product_id: product.product_id, quantity: product.quantity, listing_id: product.listing_id ?? null, price, unit_price, created_at: new Date(), updated_at: new Date()}, transaction);
            orderItems.push(orderItem);
        }
        return orderItems;
    }


    async create(user_id: string, data: Omit<CreateOrderBody, 'user_id'>, transaction: Transaction): Promise<{order: CreateOrderResult, order_items: CreateOrderItemResult[]}> {
        const { payment_method, address, referral_code} = data;
        const payment_status: PaymentStatus = 'unpaid';
        const order_id = crypto.randomUUID();
        const status: OrderStatus = 'pending';
        
        const inventory = await getProductsForOrder(data.products.map(product => product.product_id), transaction);
        const quantityMap = new Map(inventory.map(product => [product.id, product.quantity]));
        const priceMap = new Map(inventory.map(product => [product.id, Number(product.price)]));
        const unitPriceMap = new Map<string, number>();

        // Pre-resolve listings
        const listingIds = data.products.map(p => p.listing_id).filter(id => !!id) as string[];
        let listings: Listing[] = [];
        if (listingIds.length > 0) {
            listings = await Listing.findAll({
                where: { id: listingIds },
                include: [{ model: ListingPriceTier }],
                transaction,
                lock: transaction.LOCK.UPDATE
            });
        }
        const listingMap = new Map(listings.map(l => [l.id, l]));

        let total_amount = 0;
        const referralsToCreate: any[] = [];

        for (const product of data.products) {
            const basePrice = priceMap.get(product.product_id);
            if (basePrice === null || basePrice === undefined) throw createError("Product price is missing", 500);

            let unitPrice = basePrice;
            let listing: Listing | undefined;

            if (product.listing_id) {
                listing = listingMap.get(product.listing_id);
                if (listing) {
                    if (listing.bulk_only && product.quantity < listing.moq) {
                        throw createError(`Quantity for ${listing.title} must be at least ${listing.moq}`, 422);
                    }
                    
                    // Resolve tier price
                    let resolvedPrice = Number(listing.price);
                    if (listing.tiers && listing.tiers.length > 0) {
                        const validTiers = listing.tiers.filter(t => t.min_qty <= product.quantity).sort((a, b) => b.min_qty - a.min_qty);
                        const validTier = validTiers[0];
                        if (validTier) {
                            resolvedPrice = Number(validTier.unit_price);
                        }
                    }
                    unitPrice = resolvedPrice;
                }
            }
            
            unitPriceMap.set(product.product_id, unitPrice);
            const lineTotal = product.quantity * unitPrice;
            total_amount += lineTotal;

            if (listing && listing.commission_enabled && referral_code) {
                // Record intent to create referral, will check reseller later
                referralsToCreate.push({
                    listing_id: listing.id,
                    order_total: lineTotal,
                    commission_percent: listing.commission_percent,
                    commission_amount: lineTotal * (listing.commission_percent / 100),
                });
            }
        }

        const order_data = {id: order_id, user_id, status, payment_status, payment_method, total_amount, address, referral_code: referral_code ?? null, created_at: new Date(), updated_at: new Date()};
        const order = await createOrder(order_data, transaction);
        
        const sortedProducts = [...data.products].sort((a, b) =>
                a.product_id.localeCompare(b.product_id)
        );

        const order_items = await this.createOrderItems({products: sortedProducts, quantityMap, priceMap, unitPriceMap, order_id}, transaction);

        if (referralsToCreate.length > 0 && referral_code) {
            const reseller = await User.findOne({ where: { ref_code: referral_code }, transaction });
            if (reseller && reseller.id !== user_id) {
                for (const ref of referralsToCreate) {
                    await Referral.create({
                        id: crypto.randomUUID(),
                        reseller_id: reseller.id,
                        listing_id: ref.listing_id,
                        order_id: order.id,
                        order_total: ref.order_total,
                        commission_percent: ref.commission_percent,
                        commission_amount: ref.commission_amount,
                        status: 'pending'
                    }, { transaction });
                }
            }
        }

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

    async getMyOrders(payload: GetOrdersForAdminQuery, user_id: string, transaction: Transaction): Promise<PaginationResponse<OrderResult>> {
        const cleanPayload = removeUndefined(payload);
        const orders = await getOrders(cleanPayload, transaction, user_id);
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