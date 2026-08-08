import z from "zod";

export const PaymentAccountTypeEnum = z.enum(["bank", "telebirr", "cbe_birr"]);
const OrderEnum = z.enum(["asc", "desc"]);

export const createPaymentAccountSchema = z.object({
  type: PaymentAccountTypeEnum,
  label: z.string().trim().max(255),
  account_name: z.string().trim().max(255),
  account_number: z.string().trim().max(100),
  details: z.string().optional(),
});

export const getPaymentAccountSchema = z.object({
  id: z.uuid(),
});

export const getPaymentAccountsSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  order: OrderEnum.default("desc"),
});

export const updatePaymentAccountSchema = z.object({
  type: PaymentAccountTypeEnum.optional(),
  label: z.string().trim().max(255).optional(),
  account_name: z.string().trim().max(255).optional(),
  account_number: z.string().trim().max(100).optional(),
  details: z.string().optional(),
}).refine((data) => Object.keys(data).length > 0, { message: "At least one field must be provided for update" });

export type CreatePaymentAccountBody = z.infer<typeof createPaymentAccountSchema>;
export type GetPaymentAccountParams = z.infer<typeof getPaymentAccountSchema>;
export type GetPaymentAccountsQuery = z.infer<typeof getPaymentAccountsSchema>;
export type UpdatePaymentAccountBody = z.infer<typeof updatePaymentAccountSchema>;
