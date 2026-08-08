import { Op, WhereOptions } from 'sequelize';
import ComplaintMessage from '../models/complaint-message.model';
import Complaint from '../models/complaint.model';
import { Order, User } from '../models';
import { PaginationResponse } from '../types/pageination';

export type ComplaintMessageBase = {
  id: string;
  complaint_id?: string;
  sender_id: string;
  message: string;
  created_at: Date;
};

export type CreateComplaintMessageResult = {
  id: string;
  sender: { id: string; full_name: string; role: string };
  message: string;
  created_at: Date;
};

export type ComplaintMessageResult = CreateComplaintMessageResult;

type GetComplaintMessagesOptions = {
  page: number;
  limit: number;
  complaint_id: string;
  search?: string;
  order: string;
};

const mapComplaintMessage = (m: ComplaintMessage): ComplaintMessageResult => {
  return {
    id: m.id,
    sender: {
      id: m.user?.id || '',
      full_name: m.user?.full_name || '',
      role: (m.user as any)?.role || '',
    },
    message: m.message,
    created_at: m.created_at,
  };
};

export const createComplaintMessage = async (data: ComplaintMessageBase): Promise<CreateComplaintMessageResult> => {
  const msg = await ComplaintMessage.create(data as any);
  const found = await ComplaintMessage.findOne({
    where: { id: msg.id },
    include: [{ model: User, attributes: ['id', 'full_name', 'role'] }],
  });
  if (!found) throw new Error('Failed to create complaint message');
  return mapComplaintMessage(found);
};

export const getComplaintMessage = async (id: string): Promise<{ data: ComplaintMessageResult; complaint_id?: string } | null> => {
  const msg = await ComplaintMessage.findOne({
    where: { id },
    include: [
      { model: User, attributes: ['id', 'full_name', 'role'] },
      {
        model: Complaint,
        attributes: ['id'],
        include: [
          {
            model: Order,
            attributes: ['id'],
            include: [{ model: User, attributes: ['id'] }],
          },
        ],
      },
    ],
  });

  if (!msg) return null;
  if (!msg.complaint_id) return null;

  return { data: mapComplaintMessage(msg), complaint_id: msg.complaint_id };
};

export const getComplaintMessages = async (
  options: GetComplaintMessagesOptions,
  user_id: string | null
): Promise<PaginationResponse<ComplaintMessageResult>> => {
  const { page, limit, complaint_id, search, order } = options;
  const where: WhereOptions<any> = { complaint_id };
  const orderFilter: WhereOptions<any> = {};

  if (user_id) orderFilter.user_id = user_id;

  const offset = (page - 1) * limit;

  if (search) {
    Object.assign(where, {
      [Op.or]: [{ message: { [Op.iLike]: `%${search}%` } }],
    });
  }

  const { rows, count } = await ComplaintMessage.findAndCountAll({
    where,
    offset,
    limit,
    order: [['created_at', order]],
    include: [
      { model: User, attributes: ['id', 'full_name', 'role'] },
      {
        model: Complaint,
        where: {},
        attributes: ['id'],
        include: [
          {
            model: Order,
            where: orderFilter,
            attributes: ['id'],
            include: [{ model: User, attributes: ['id'] }],
          },
        ],
      },
    ],
  });

  const data = rows.map(mapComplaintMessage);
  return {
    data,
    meta: { page, limit, total: count },
  };
};
