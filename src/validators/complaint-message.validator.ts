import z from 'zod';

const OrderEnum = z.enum(['asc', 'desc']);

export const createComplaintMessageSchema = z.object({
  complaint_id: z.uuid(),
  message: z.string().min(1),
});

export const getComplaintMessageSchema = z.object({
  id: z.string(),
});

export const getComplaintMessagesSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  complaint_id: z.uuid(),
  search: z.string().optional(),
  order: OrderEnum.default('desc'),
});

export type CreateComplaintMessageBody = z.infer<typeof createComplaintMessageSchema>;
export type GetComplaintMessageParam = z.infer<typeof getComplaintMessageSchema>;
export type GetComplaintMessagesQuery = z.infer<typeof getComplaintMessagesSchema>;
