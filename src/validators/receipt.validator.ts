import z from 'zod';

const StatusEnum = z.enum(['pending_review', 'approved', 'rejected']);
const PaymentMethodEnum = z.enum([ 'full', 'advance', 'cod']);
const SortEnum = z.enum(['amount', 'created_at']);
const OrderEnum = z.enum(['asc', 'desc']);

export const createReceiptSchema = z.object({
    order_id: z.uuid(),
    account: z.string().optional(),
    note: z.string().optional()
});

export const getReceiptSchema = z.object({
    id: z.string()
});

export const getReceiptsSchema = z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
    payment_method: z.preprocess((val) => {
        if (!val || val === "") return undefined;
        return val;
    }, PaymentMethodEnum).optional(),
    status: z.preprocess((val) => {
        if (!val || val === "") return undefined;
        return val;
    }, StatusEnum).optional(),
    search: z.string().optional(),
    sort: SortEnum.default('created_at'),
    order: OrderEnum.default('desc')
});

export const updateReceiptSchema = z.object({
    status: StatusEnum.optional(),
    note: z.string().optional()
})
.refine((data) => Object.keys(data).length > 0, { message: "At least one field must be provided for update" });

export type CreateReceiptBody = z.infer<typeof createReceiptSchema>;
export type GetReceiptParam = z.infer<typeof getReceiptSchema>;
export type GetReceiptsQuery = z.infer<typeof getReceiptsSchema>;
export type UpdateReceiptsBody = z.infer<typeof updateReceiptSchema>