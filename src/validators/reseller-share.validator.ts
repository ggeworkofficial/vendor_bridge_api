import z from "zod";

const SortEnum = z.enum([
  "created_at",
  "total_clicks",
  "total_conversions",
]);

const OrderEnum = z.enum([
  "asc",
  "desc",
]);

export const createResellerShareSchema = z.object({
  product_id: z.uuid(),

  caption: z.string().max(1000),
});

export const getResellerSharesSchema = z.object({
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

  search: z.string().max(255).optional(),

  sort: SortEnum.default("created_at"),

  order: OrderEnum.default("desc"),
});

export const getOneResellerShareSchema = z.object({
  id: z.uuid(),
});

export const deleteResellerShareSchema = z.object({
  id: z.uuid(),
});

export type CreateResellerShareBody = z.infer<
  typeof createResellerShareSchema
>;

export type GetResellerSharesQuery = z.infer<
  typeof getResellerSharesSchema
>;

export type GetOneResellerShareParams = z.infer<
  typeof getOneResellerShareSchema
>;

export type DeleteResellerShareParams = z.infer<
  typeof deleteResellerShareSchema
>;