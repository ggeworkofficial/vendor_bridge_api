import z from "zod";


export const createCategorySchema = z.object({
    name: z.string().trim().max(100),
});

export const getOneCategorySchema = z.object({
    id: z.uuid(),
});

export const updateCategorySchema = z.object({
    name: z.string().trim().max(100).optional(),
}).refine((data) => Object.keys(data).length > 0, { message: "At least one field must be provided for update" });

export type CreateCategoryBody = z.infer<typeof createCategorySchema>;
export type GetOneCategoryParams = z.infer<typeof getOneCategorySchema>;
export type UpdateCategoryBody = z.infer<typeof updateCategorySchema>;