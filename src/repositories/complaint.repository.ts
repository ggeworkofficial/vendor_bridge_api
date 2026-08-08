import { Order, User } from "../models"
import Complaint, { ComplaintPriority, ComplaintStatus } from "../models/complaint.model"
import { PaginationResponse } from "../types/pageination"
import { Op, WhereOptions } from "sequelize"


export type ComplaintBase = {
    id: string, 
    order_id: string,
    subject: string,
    description: string,
    status: ComplaintStatus,
    priority: ComplaintPriority,
    created_at: Date,
    updated_at: Date,
}
export type CreateComplaintResult = Omit<ComplaintBase, 'order_id'> & {
    order_id?: string,
}

export type ComplaintResult = Omit<ComplaintBase, "order_id"> & {
    user: { id: string, full_name: string }
}

type GetComplaintOptions = {
    page: number,
    limit: number,
    order_id: string,
    status?: ComplaintStatus,
    priority?: ComplaintPriority,
    search?: string,
    order: string
}

type UpdateComplaintOptions = Partial<{
    subject: string,
    description: string,
    status: ComplaintStatus,
    priority: ComplaintPriority
}>


const mapComplaint = (complaint: Complaint): ComplaintResult => {
    return {
        id: complaint.id,
        user: { 
            id: complaint.order?.user?.id || "",
            full_name: complaint.order?.user?.full_name || ""
        },
        subject: complaint.subject,
        description: complaint.description,
        status: complaint.status,
        priority: complaint.priority,
        created_at: complaint.created_at,
        updated_at: complaint.updated_at,
    }
}

export const createComplaint = async (data: ComplaintBase): Promise<CreateComplaintResult> => {
    const complaint = await Complaint.create(data);
    return complaint;
}

export const getComplaint = async (id: string): Promise<ComplaintResult | null> => {
    const complaint = await Complaint.findOne({
        where: { id },
        include: [
            {
                model: Order, 
                attributes: ['id'],
                include: [
                    { model: User, attributes: ['id', 'full_name']}
                ]
            }
        ]
    });
    if (!complaint) return null;
    return mapComplaint(complaint);
}

export const getComplaints = async (options: GetComplaintOptions, user_id: string | null): Promise<PaginationResponse<ComplaintResult>> => {
    const { page, limit, order_id, status, priority, search, order} = options;
    const where: WhereOptions<any> = {order_id};
    const orderFilter: WhereOptions<any> = {};

    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (user_id) orderFilter.user_id = user_id;

    const offset = (page - 1) * limit;

    if (search) {
        Object.assign(where, {
            [Op.or]: [
            { account: { [Op.iLike]: `%${search}%` } },
            { note: { [Op.iLike]: `%${search}%` } },
            ],
        });
    }

    const { rows, count } = await Complaint.findAndCountAll({
        where,
        offset,
        limit,
        order: [['created_at', order]],
        include: [
            {
                model: Order, 
                where: orderFilter,
                attributes: ['id'],
                include: [
                    { model: User, attributes: ['id', 'full_name']}
                ]
            }
        ]
    });

    const data = rows.map(mapComplaint);
    return {
        data,
        meta: {
            page, limit, total: count
        }
    }
}

export const updateComplaint = async (id: string, options: UpdateComplaintOptions): Promise<ComplaintResult | null> => {
    await Complaint.update(options, {where: {id}});
    return await getComplaint(id);
}

export const removeComplaint = async (id: string): Promise<boolean> => {
    return await Complaint.destroy({where: { id }}) > 0;
}

