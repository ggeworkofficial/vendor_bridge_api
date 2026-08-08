import z from 'zod';

const StatusEnum = z.enum(['open', 'investigating', 'resolved']);
const PriorityEnum = z.enum(['low', 'medium', 'high']);
const OrderEnum = z.enum(['asc', 'desc']);

export const createComplaintSchema = z.object({
    order_id: z.uuid(),
    subject: z.string(),
    description: z.string(),
});

export const getComplaintSchema = z.object({
    id: z.string()
});

export const getComplaintsSchema = z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
    order_id: z.uuid(),
    status: z.preprocess((val) => {
        if (!val || val === "") return undefined;
        return val;
    }, StatusEnum).optional(),
    priority: z.preprocess((val) => {
        if (!val || val === "") return undefined;
        return val;
    }, PriorityEnum).optional(),
    search: z.string().optional(),
    order: OrderEnum.default('desc')
});

export const updateComplaintSchema = z.object({
    subject: z.string().optional(),
    description: z.string().optional(),
    status: StatusEnum.optional(),
    priority: PriorityEnum.optional(),
})
.refine((data) => Object.keys(data).length > 0, { message: "At least one field must be provided for update" });

export type CreateComplaintBody = z.infer<typeof createComplaintSchema>;
export type GetComplaintParam = z.infer<typeof getComplaintSchema>;
export type GetComplaintsQuery = z.infer<typeof getComplaintsSchema>;
export type UpdateComplaintBody = z.infer<typeof updateComplaintSchema>;