import z from "zod";

export const LogisticsStatusEnum = z.enum([
  'processing',
  'in_transit',
  'out_for_delivery',
  'delivered',
]);

const OrderEnum = z.enum(['asc', 'desc']);

export const createLogisticsSchema = z.object({
  order_id: z.uuid(),
  carrier: z.string().trim().max(100),
  tracking_number: z.string().trim().max(100),
  origin: z.string().trim().max(255),
  destination: z.string().trim().max(255),
  estimated_eta: z.preprocess((val) => {
    if (!val) return undefined;
    return new Date(val as string);
  }, z.date()).optional(),
});

export const getLogisticsSchema = z.object({
  id: z.string(),
});

export const getLogisticsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  order_id: z.preprocess((val) => {
    if (!val || val === "") return undefined;
    return val;
  }, z.uuid()).optional(),
  status: z.preprocess((val) => {
    if (!val || val === "") return undefined;
    return val;
  }, LogisticsStatusEnum).optional(),
  search: z.string().optional(),
  order: OrderEnum.default('desc'),
});

export const updateLogisticsSchema = z.object({
  carrier: z.string().trim().max(100).optional(),
  tracking_number: z.string().trim().max(100).optional(),
  status: LogisticsStatusEnum.optional(),
  origin: z.string().trim().max(255).optional(),
  destination: z.string().trim().max(255).optional(),
  estimated_eta: z.preprocess((val) => {
    if (!val) return undefined;
    return new Date(val as string);
  }, z.date()).optional(),
}).refine((data) => Object.keys(data).length > 0, { message: 'At least one field must be provided for update' });

export type CreateLogisticsBody = z.infer<typeof createLogisticsSchema>;
export type GetLogisticsParam = z.infer<typeof getLogisticsSchema>;
export type GetLogisticsQuery = z.infer<typeof getLogisticsQuerySchema>;
export type UpdateLogisticsBody = z.infer<typeof updateLogisticsSchema>;
