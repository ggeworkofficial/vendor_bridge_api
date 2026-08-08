import z from 'zod';

const QualityLableEnum = z.enum(['high', 'medium', 'low']);
const SortEnum = z.enum(['name', 'quantity', 'price', 'verified', 'created_at']);
const OrderEnum = z.enum(['asc', 'desc'])

export const createProductSchema = z.object({
    name: z.string().min(1).max(255),
    description: z.string().optional(),
    price: z.coerce.number().min(0),
    quality_label: QualityLableEnum,
    quantity: z.coerce.number().default(0),
    verified: z.preprocess((val) => {
        if (val === "true") return true;
        if (val === "false") return false;
    }, z.boolean().default(false)),
    category_id: z.uuid(),
    seller_id: z.uuid(),
    location: z.string().max(255).optional()
});

export const getProductSchema = z.object({
    id: z.uuid()
});

export const getInventorySchema = z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
    quality_label: z.preprocess((val) => {
        if (!val || val === "") return undefined;
        return val;
    }, QualityLableEnum.optional()).optional(),    
    verified: z.preprocess((val) => {
        if (val === "true") return true;
        if (val === "false") return false;
    }, z.boolean().optional()).optional(),
    search: z.string().trim().max(100).optional(),
    sort: SortEnum.default('created_at'),
    order: OrderEnum.default('desc')
});

export const updateProductSchema = z.object({
    name: z.string().max(255).optional(),
    description: z.string().optional(),
    price: z.coerce.number().min(0).optional(),
    quality_label: QualityLableEnum.optional(),
    quantity: z.coerce.number().optional(),
    verified: z.boolean().optional(),
    category_id: z.uuid().optional(),
    seller_id: z.uuid().optional(),
    location: z.string().max(255).optional()
})
.refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
});

export type CreateInventoryBody = z.infer<typeof createProductSchema>;
export type GetProductParam = z.infer<typeof getProductSchema>;
export type GetInventoryQuery = z.infer<typeof getInventorySchema>;
export type UpdateInventoryBody = z.infer<typeof updateProductSchema>;