import z from "zod";

export const createSettingsSchema = z.object({
  key: z.string().trim().max(255),
  value: z.custom((val) => {
    return typeof val === "object" && val !== null && !Array.isArray(val);
  }, { message: "Value must be a JSON object" }),
  description: z.string().optional(),
  is_public: z.boolean().optional(),
});

export const getSettingsSchema = z.object({
  key: z.string().trim().max(255),
});

const OrderEnum = z.enum(["asc", "desc"]);

export const getSettingsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  order: OrderEnum.default("desc"),
});

export const updateSettingsSchema = z.object({
  key: z.string().trim().max(255).optional(),
  value: z.custom((val) => {
    if (val === undefined) return true;
    return typeof val === "object" && val !== null && !Array.isArray(val);
  }, { message: "Value must be a JSON object" }).optional(),
  description: z.string().optional(),
  is_public: z.boolean().optional(),
}).refine((data) => Object.keys(data).length > 0, { message: "At least one field must be provided for update" });

export type CreateSettingsBody = z.infer<typeof createSettingsSchema>;
export type GetSettingsParams = z.infer<typeof getSettingsSchema>;
export type GetSettingsQuery = z.infer<typeof getSettingsQuerySchema>;
export type UpdateSettingsBody = z.infer<typeof updateSettingsSchema>;
