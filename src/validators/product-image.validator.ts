import z from 'zod';

export const createProductImageSchema = z.object({
    product_id: z.uuid(),
    is_primary: z.coerce.boolean().default(false),
});


export const getProductImageSchema = z.object({
    id: z.uuid(),
});

export const getProductImagesSchema = z.object({
    product_id: z.uuid(),
});

export const updateProductImageSchema = z.object({
    is_primary: z.boolean().optional(),
});

export type CreateProductImageBody = z.infer<typeof createProductImageSchema>;
export type GetProductImageParam = z.infer<typeof getProductImageSchema>;
export type GetProductImagesPatam = z.infer<typeof getProductImagesSchema>;
export type UpdateProductImageBody = z.infer<typeof updateProductImageSchema>;