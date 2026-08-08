import z from 'zod';

const SortEnum = z.enum(['rating', 'created_at']);
const OrderEnum = z.enum(['asc', 'desc']);

export const createReviewSchema = z.object({
    product_id: z.uuid(),
    rating: z.number().min(1).max(5),
    comment: z.string().optional(),
});

export const getReviewSchemaWithUser = z.object({
    id: z.uuid(),
    user_id: z.uuid(),
})

export const getReviewSchema = z.object({
    id: z.uuid(),
});

export const getReviewsSchema = z.object({
    product_id: z.uuid(),
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
    include_empty_comments: z.coerce.boolean().default(false),
    search: z.string().trim().min(1).max(100).optional(),
    sort: SortEnum.default('created_at'),
    order: OrderEnum.default('desc'),
});

export const updateReviewSchema = z.object({
    rating: z.number().min(1).max(5).optional(),
    comment: z.string().optional(),
})
.refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
});

export type CreateReviewBody = z.infer<typeof createReviewSchema>;
export type GetReviewsParam = z.infer<typeof getReviewsSchema>;
export type GetReviewParam = z.infer<typeof getReviewSchema>;
export type GetReviewParamWithUser = z.infer<typeof getReviewSchemaWithUser>;
export type UpdateReviewBody = z.infer<typeof updateReviewSchema>;