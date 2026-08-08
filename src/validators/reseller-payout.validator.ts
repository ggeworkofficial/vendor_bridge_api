import z from "zod";

const StatusEnum = z.enum([
  "pending",
  "processing",
  "paid",
  "rejected",
]);

const SortEnum = z.enum([
  "requested_at",
  "amount",
]);

const OrderEnum = z.enum([
  "asc",
  "desc",
]);

export const createResellerPayoutSchema = z.object({
  amount: z.number().positive(),

  payment_method: z.string().min(2).max(100),

  payment_details: z.string().min(5),
});

export const getResellerPayoutsSchema = z.object({
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

  status: z.preprocess((val) => {
    if (!val || val === "") return undefined;
    return val;
  }, StatusEnum).optional(),

  search: z.string().max(255).optional(),

  sort: SortEnum.default("requested_at"),

  order: OrderEnum.default("desc"),
});

export const getOneResellerPayoutSchema = z.object({
  id: z.uuid(),
});

export const deleteResellerPayoutSchema = z.object({
  id: z.uuid(),
});

export type CreateResellerPayoutBody = z.infer<
  typeof createResellerPayoutSchema
>;

export type GetResellerPayoutsQuery = z.infer<
  typeof getResellerPayoutsSchema
>;

export type GetOneResellerPayoutParams = z.infer<
  typeof getOneResellerPayoutSchema
>;

export type DeleteResellerPayoutParams = z.infer<
  typeof deleteResellerPayoutSchema
>;