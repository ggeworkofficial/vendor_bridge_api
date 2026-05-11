import z from "zod";


export const createSellerScehma = z.object({
    user_id: z.uuid(),
    name: z.string().max(255).optional(),
    location: z.string().max(255).optional(),
    contact: z.string().max(50).optional(),
    verified: z.boolean().default(false),
});

export const getOneSellerSchema = z.object({
    id: z.string().uuid(),
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
export type UpdateSellerBody = z.infer<typeof updateSellerSchema>;