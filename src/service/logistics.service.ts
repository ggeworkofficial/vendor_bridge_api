import { createError } from "../helpers/error";
import { removeUndefined } from "../utils/removeUndefined";
import { Order, User, Logistics, } from "../models";
import {
  createLogistics,
  getLogisticsById,
  getLogisticsList,
  updateLogistics,
  CreateLogisticsResult,
  LogisticsResult,
  getLogisticsByOrderId,
} from "../repositories/logistics.repository";
import { CreateLogisticsBody, GetLogisticsQuery, UpdateLogisticsBody } from "../validators/logistics.validator";
import { Role } from "../middleware/roleChecker";
import { PaginationResponse } from "../types/pageination";
import { LogisticsStatus } from "../models/logistics.model";

const validStatusTransitions: Record<LogisticsStatus, LogisticsStatus[]> = {
  processing: ['in_transit'],
  in_transit: ['out_for_delivery'],
  out_for_delivery: ['delivered'],
  delivered: [],
};
    
export default class LogisticsService {
  async create(role: Role, data: CreateLogisticsBody): Promise<CreateLogisticsResult> {
    if (role !== 'admin') throw createError('Forbidden', 403);

    const order = await Order.findOne({
      where: { id: data.order_id },
      include: [{ model: User, attributes: ['id', 'full_name'] }],
    });

    if (!order) throw createError('Order not found', 404);

    const invalidOrderStates = ['cancelled', 'rejected', 'delivered'];
    if (invalidOrderStates.includes(order.status)) throw createError('Cannot add logistics for cancelled or rejected order', 400);

    const existing = await getLogisticsByOrderId(data.order_id);
    if (existing) throw createError('Logistics already exists for this order', 400);

   
    const createdAt = new Date();
    const updatedAt = new Date();
    const payload = {
      id: crypto.randomUUID(),
      order_id: data.order_id,
      carrier: data.carrier,
      tracking_number: data.tracking_number,
      status: 'processing' as LogisticsStatus,
      origin: data.origin,
      destination: data.destination,
      estimated_eta: data.estimated_eta,
      created_at: createdAt,
      updated_at: updatedAt,
    };

    const cleanPayload = removeUndefined(payload);
    return await createLogistics(cleanPayload);
  }

  async getOne(id: string, user_id: string, role: Role): Promise<LogisticsResult> {
    const logistics = await getLogisticsById(id);
    if (!logistics) throw createError('Logistics record not found', 404);

    if (role !== 'admin' && logistics.order.user.id !== user_id) throw createError('Forbidden', 403);
    return logistics;
  }

  async getAll(user_id: string, role: Role, query: GetLogisticsQuery): Promise<PaginationResponse<LogisticsResult>> {
    const cleanQuery = removeUndefined(query);
    return await getLogisticsList(cleanQuery, role === 'admin' ? null : user_id);
  }

  async update(id: string, role: Role, data: UpdateLogisticsBody): Promise<LogisticsResult> {
    if (role !== 'admin') throw createError('Forbidden', 403);

    const logistics = await getLogisticsById(id);
    if (!logistics) throw createError('Logistics record not found', 404);

    if (logistics.status === 'delivered') throw createError('Delivered logistics cannot be updated', 400);

    const cleanData = removeUndefined(data);

    if (cleanData.status) {
      const allowed = validStatusTransitions[logistics.status as LogisticsStatus];
      if (cleanData.status !== logistics.status && !allowed.includes(cleanData.status)) {
        throw createError('Invalid logistics status transition', 400);
      }

      if ((cleanData.status === 'in_transit' || cleanData.status === 'out_for_delivery') && !cleanData.estimated_eta) {
        throw createError('Estimated ETA must be provided when logistics is in transit or out for delivery', 400);
      }
    }

    if (cleanData.tracking_number && cleanData.tracking_number !== logistics.tracking_number) {
      const duplicate = await Logistics.findOne({ where: { tracking_number: cleanData.tracking_number } });
      if (duplicate && duplicate.id !== id) {
        throw createError('Tracking number already in use', 400);
      }
    }

    const updated = await updateLogistics(id, cleanData as any);
    if (!updated) throw createError('Logistics record not found', 404);
    return updated;
  }
}
