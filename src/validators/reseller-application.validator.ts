import z from "zod";

const StatusEnum = z.enum([
  "pending",
  "approved",
  "rejected",
  "suspended",
]);

const SortEnum = z.enum([
  "created_at",
  "updated_at",
  "full_name",
]);

const OrderEnum = z.enum([
  "asc",
  "desc",
]);

const SocialMediaAccountSchema = z.object({
  platform: z.string().min(1).max(50),
  username: z.string().min(1).max(100),
  url: z.url(),
});

export const createResellerApplicationSchema = z.object({
  full_name: z.string().min(3).max(255),

  email: z.email().transform((val) => val.toLowerCase()),

  phone: z.string().min(5).max(20),

  social_media_accounts: z
    .array(SocialMediaAccountSchema)
    .min(1, "At least one social media account is required"),

  marketing_experience: z.string().min(10),

  preferred_categories: z
    .array(z.string().min(1))
    .min(1, "At least one preferred category is required"),
});

export const updateResellerApplicationSchema = z
  .object({
    status: StatusEnum.optional(),

    rejection_reason: z.string().optional(),

    admin_notes: z.string().optional(),

    commission_rate: z
      .number()
      .min(0)
      .max(100)
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export const getResellerApplicationsSchema = z.object({
  page: z.coerce
    .number()
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Page must be a positive integer",
    })
    .default(1),

  limit: z.coerce
    .number()
    .refine((val) => !isNaN(val) && val > 0 && val <= 100, {
      message: "Limit must be a positive integer between 1 and 100",
    })
    .default(10),

  status: z.preprocess(
    (val) => {
      if (!val || val === "") return undefined;
      return val;
    },
    StatusEnum
  ).optional(),

  search: z.string().max(255).optional(),

  sort: SortEnum.default("created_at"),

  order: OrderEnum.default("desc"),
});

export const getOneResellerApplicationSchema = z.object({
  id: z.uuid(),
});

export type CreateResellerApplicationBody = z.infer<
  typeof createResellerApplicationSchema
>;

export type UpdateResellerApplicationBody = z.infer<
  typeof updateResellerApplicationSchema
>;

export type GetResellerApplicationsQuery = z.infer<
  typeof getResellerApplicationsSchema
>;

export type GetOneResellerApplicationParams = z.infer<
  typeof getOneResellerApplicationSchema
>;