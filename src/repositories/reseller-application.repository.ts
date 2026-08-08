import { Op, Transaction, WhereOptions } from "sequelize";
import ResellerApplication, { ResellerApplicationStatus } from "../models/reseller-application.model";
import { PaginationResponse } from "../types/pageination";

export type ResellerApplicationBase = {
    id: string,
    user_id: string,
    full_name: string,
    email: string,
    phone: string,
    social_media_accounts: Record<string, string>[],
    marketing_experience: string,
    preferred_categories: string[],
    status: ResellerApplicationStatus,
    rejection_reason?: string,
    admin_notes?: string,
    created_at: Date,
    updated_at: Date,
}

type GetResellerApplicationsPayload = {
    page: number;
    limit: number;
    status?: ResellerApplicationStatus;
    search?: string;
    sort: string;
    order: "asc" | "desc";
}

type ResellerApplicationUpdatePayload = {
    status?: ResellerApplicationStatus;
    rejection_reason?: string;
    admin_notes?: string;
    updated_at: Date;
}


export const createResellerApplication = async (data: ResellerApplicationBase): Promise<ResellerApplicationBase> => {
    const application = await ResellerApplication.create(data);
    return application;
}

export const getResellerApplicationById = async (id: string): Promise<ResellerApplicationBase | null> => {
    const application = await ResellerApplication.findByPk(id);
    return application;
}

export const getResellerApplications = async (payload: GetResellerApplicationsPayload): Promise<PaginationResponse<ResellerApplicationBase>> => {
    const { page, limit, status, search, sort, order } = payload;
    const offset = (page - 1) * limit;
    const where: WhereOptions<any> = {};

    if (status) where.status = status;
    if (search) {
        Object.assign(where, {
            [Op.or]: [
            { full_name: { [Op.iLike]: `%${search}%` } },
            { email: { [Op.iLike]: `%${search}%` } },
            { phone: { [Op.iLike]: `%${search}%` } },
            ],
        });
    }

    const allowedSortFields = ["full_name", "email", "phone", "status", "created_at"];
    const safeSort = allowedSortFields.includes(sort)
        ? sort
        : "created_at";
    
    const allowedOrderFields = ["asc", "desc"];
    const safeOrder = allowedOrderFields.includes(order)
        ? order
        : "desc";
    
    const { count, rows } = await ResellerApplication.findAndCountAll({
        where,
        limit,
        offset,
        order: [[safeSort, safeOrder]],
    });
    return {
        data: rows,
        meta: {
            total: count,
            page,
            limit,
        }
    };
}

export const updateResellerApplication = async (id: string, data: ResellerApplicationUpdatePayload, transaction: Transaction): Promise<ResellerApplicationBase | null> => {
    const application = await ResellerApplication.findByPk(id);
    if (!application) return null;
    await application.update(data, { transaction });
    return application;
}


