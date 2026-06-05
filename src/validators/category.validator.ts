import z from "zod";


export const createCategorySchema = z.object({
    name: z.string().trim().max(100),
});

export const getOneCategorySchema = z.object({
    id: z.uuid(),
});

export const getAllCategoriesSchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    sort: z.enum(['name', 'created_at']).default('created_at'),
    order: z.enum(['asc', 'desc']).default('asc'),
    search: z.string().trim().max(100).optional(),
});

export const updateCategorySchema = z.object({
    name: z.string().trim().max(100).optional(),
}).refine((data) => Object.keys(data).length > 0, { message: "At least one field must be provided for update" });

export type CreateCategoryBody = z.infer<typeof createCategorySchema>;
export type GetOneCategoryParams = z.infer<typeof getOneCategorySchema>;
export type GetAllCategoriesQuery = z.infer<typeof getAllCategoriesSchema>;
export type UpdateCategoryBody = z.infer<typeof updateCategorySchema>;