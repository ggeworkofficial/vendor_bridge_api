import z from "zod";

const BusinessTypeEnum = z.enum([
  "individual",
  "company",
  "cooperative",
]);

const StatusEnum = z.enum([
  "pending",
  "approved",
  "rejected",
]);

const SortEnum = z.enum([
  "created_at",
  "updated_at",
  "business_name",
]);

const OrderEnum = z.enum([
  "asc",
  "desc",
]);

export const createSellerApplicationSchema = z.object({
  business_name: z.string().min(3).max(255),
  business_type: BusinessTypeEnum,

  tax_id: z.string().max(100).optional(),

  business_license: z.string().max(100).optional(),

  phone: z.string().min(5).max(20),

  address: z.string().min(5),

  city: z.string().min(2).max(100),

  region: z.string().min(2).max(100),

  description: z.string().min(10),

  product_categories: z
    .array(z.string().min(1))
    .min(1, "At least one product category is required"),

  social_media: z
    .object({
      facebook: z.url().optional(),
      instagram: z.url().optional(),
      tiktok: z.url().optional(),
      twitter: z.url().optional(),
    })
    .optional(),
});

export const updateSellerApplicationSchema = z.object({
  status: StatusEnum.optional(),

  rejection_reason: z.string().optional(),

  admin_notes: z.string().optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: "At least one field must be provided",
});

export const getSellerApplicationsSchema = z.object({
  page: z.coerce.number()
    .refine(val => !isNaN(val) && val > 0, {
      message: "Page must be a positive integer",
    })
    .default(1),

  limit: z.coerce.number()
    .refine(val => !isNaN(val) && val > 0 && val <= 100, {
      message: "Limit must be a positive integer between 1 and 100",
    })
    .default(10),

  status: z.preprocess((val) => {
    if (!val || val === "") return undefined;
    return val;
  }, StatusEnum).optional(),

  search: z.string().max(255).optional(),

  sort: SortEnum.default("created_at"),

  order: OrderEnum.default("desc"),
});

export const getOneSellerApplicationSchema = z.object({
  id: z.uuid(),
});

export type CreateSellerApplicationBody = z.infer<
  typeof createSellerApplicationSchema
>;

export type UpdateSellerApplicationBody = z.infer<
  typeof updateSellerApplicationSchema
>;

export type GetSellerApplicationsQuery = z.infer<
  typeof getSellerApplicationsSchema
>;

export type GetOneSellerApplicationParams = z.infer<
  typeof getOneSellerApplicationSchema
>;