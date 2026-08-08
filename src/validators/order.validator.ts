import z from 'zod';

const StatusEnum = z.enum(['pending', 'confirmed', 'out_for_delivery', 'delivered', 'cancelled', 'rejected']);
const PaymentStatusEnum = z.enum(['paid', 'unpaid', 'pending_review', 'rejected']);
const PaymentMethodEnum = z.enum([ 'full', 'advance', 'cod']);
const AdminSortEnum = z.enum(['total_amount', 'created_at']);
const OrderEnum = z.enum(['asc', 'desc']);

export const createOrderSchema = z.object({
    products: z.array(z.object({
        product_id: z.uuid(),
        quantity: z.number().int().min(1),
    })),
    payment_method: PaymentMethodEnum,
    address: z.string()
});

export const getOrderSchema = z.object({
    id: z.uuid()
});

export const getOrdersForAdminSchema = z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
    status: z.preprocess((val) => {
        if (!val || val === "") return undefined;
        return val;
    }, StatusEnum).optional(),
    payment_status: z.preprocess((val) => {
        if (!val || val === "") return undefined;
        return val;
    }, PaymentStatusEnum).optional(),
    payment_method: z.preprocess((val) => {
        if (!val || val === "") return undefined;
        return val;
    }, PaymentMethodEnum).optional(),
    sort: AdminSortEnum.default('created_at'),
    order: OrderEnum.default('desc'),
});

export const updateOrderSchema = z.object({
    status: StatusEnum
});

export type CreateOrderBody = z.infer<typeof createOrderSchema>;
export type GetOrderParam = z.infer<typeof getOrderSchema>;
export type GetOrdersForAdminQuery = z.infer<typeof getOrdersForAdminSchema>;
export type UpdateOrderBody = z.infer<typeof updateOrderSchema>;