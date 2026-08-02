import z from "zod";


export const createSellerScehma = z.object({
    user_id: z.uuid(),
    name: z.string().max(255).optional(),
    location: z.string().max(255).optional(),
    contact: z.string().max(50).optional(),
    verified: z.boolean().default(false),
});

export const getOneSellerSchema = z.object({
    id: z.uuid(),
});

export const getAllSellersSchema = z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
    search: z.string().max(255).optional(),
    sort: z.enum(['name', 'created_at']).default('created_at'),
    order: z.enum(['asc', 'desc']).default('desc'),
});

export const updateSellerSchema = z.object({
    user_id: z.uuid().optional(),
    name: z.string().max(255).optional(),
    location: z.string().max(255).optional(),
    contact: z.string().max(50).optional(),
    verified: z.boolean().optional(),
})
.refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
});

export type CreateSellerBody = z.infer<typeof createSellerScehma>;
export type GetOneSellerParams = z.infer<typeof getOneSellerSchema>;
export type GetAllSellersQuery = z.infer<typeof getAllSellersSchema>;
export type UpdateSellerBody = z.infer<typeof updateSellerSchema>;