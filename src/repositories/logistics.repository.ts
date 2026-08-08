import { Op, WhereOptions } from "sequelize";
import Logistics, { LogisticsStatus } from "../models/logistics.model";
import { Order, User } from "../models";
import { PaginationResponse } from "../types/pageination";

    
export type LogisticsBase = {
  id: string;
  order_id: string;
  carrier: string;
  tracking_number: string;
  status: LogisticsStatus;
  origin: string;
  destination: string;
  estimated_eta?: Date;
  created_at: Date;
  updated_at: Date;
};

export type CreateLogisticsResult = LogisticsBase;

export type LogisticsResult = LogisticsBase & {
  order: {
    id: string;
    user: {
      id: string;
      full_name: string;
    };
  };
};

type GetLogisticsListOptions = {
  page: number;
  limit: number;
  order_id?: string;
  status?: LogisticsStatus;
  search?: string;
  order: string;
};

const mapLogistics = (logistics: Logistics): LogisticsResult => {
  return {
    id: logistics.id,
    order_id: logistics.order_id,
    carrier: logistics.carrier,
    tracking_number: logistics.tracking_number,
    status: logistics.status as LogisticsStatus,
    origin: logistics.origin,
    destination: logistics.destination,
    ...(logistics.estimated_eta && { estimated_eta: logistics.estimated_eta }),
    created_at: logistics.created_at,
    updated_at: logistics.updated_at,
    order: {
      id: logistics.order?.id || "",
      user: {
        id: logistics.order?.user?.id || "",
        full_name: logistics.order?.user?.full_name || "",
      },
    },
  };
};

export const createLogistics = async (data: LogisticsBase): Promise<CreateLogisticsResult> => {
  const logistics = await Logistics.create(data as any);
  return logistics;
};

export const getLogisticsByOrderId = async (order_id: string): Promise<Logistics | null> => {
  const logistics = await Logistics.findOne({
    where: { order_id },
    attributes: ['id'],
  });
  return logistics;
}

export const getLogisticsById = async (id: string): Promise<LogisticsResult | null> => {
  const logistics = await Logistics.findOne({
    where: { id },
    include: [
      {
        model: Order,
        attributes: ['id'],
        include: [{ model: User, attributes: ['id', 'full_name'] }],
      },
    ],
  });

  if (!logistics) return null;
  return mapLogistics(logistics);
};

export const getLogisticsList = async (
  options: GetLogisticsListOptions,
  user_id: string | null
): Promise<PaginationResponse<LogisticsResult>> => {
  const { page, limit, order_id, status, search, order } = options;
  const where: WhereOptions<any> = {};
  const orderWhere: WhereOptions<any> = {};

  if (order_id) where.order_id = order_id;
  if (status) where.status = status;
  if (search) {
    Object.assign(where, {
      [Op.or]: [
        { carrier: { [Op.iLike]: `%${search}%` } },
        { tracking_number: { [Op.iLike]: `%${search}%` } },
      ],
    });
  }

  if (user_id) {
    orderWhere.user_id = user_id;
  }

  const offset = (page - 1) * limit;

  const { rows, count } = await Logistics.findAndCountAll({
    where,
    limit,
    offset,
    order: [['created_at', order]],
    include: [
      {
        model: Order,
        where: orderWhere,
        attributes: ['id'],
        include: [{ model: User, attributes: ['id', 'full_name'] }],
      },
    ],
  });

  return {
    data: rows.map(mapLogistics),
    meta: {
      page,
      limit,
      total: count,
    },
  };
};

export const updateLogistics = async (
  id: string,
  payload: Partial<Omit<LogisticsBase, 'id' | 'order_id'>>
): Promise<LogisticsResult | null> => {
  await Logistics.update(payload, { where: { id } });
  return await getLogisticsById(id);
};
