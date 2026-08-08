import z from "zod";

const SortEnum = z.enum([
  "created_at",
]);

const OrderEnum = z.enum([
  "asc",
  "desc",
]);

export const getResellerClicksSchema = z.object({
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

  converted: z.preprocess((val) => {
    if (!val || val === "") return undefined;
    return val === "true" || val === true;
  }, z.boolean()).optional(),

  sort: SortEnum.default("created_at"),

  order: OrderEnum.default("desc"),
});

export const getOneResellerClickSchema = z.object({
  id: z.uuid(),
});

export type GetResellerClicksQuery = z.infer<
  typeof getResellerClicksSchema
>;

export type GetOneResellerClickParams = z.infer<
  typeof getOneResellerClickSchema
>;