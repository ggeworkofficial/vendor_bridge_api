import Reseller from "../models/reseller.model";
import { PaginationResponse } from "../types/pageination";
import { Op, Transaction, WhereOptions } from "sequelize";

export type ResellerBase = {
    id: string,
    user_id: string,
    commission_rate: number,
    joined_at: Date,
    is_active: boolean,
    current_balance: number,
    total_paid: number,
    created_at: Date,
    updated_at: Date,
}

export type GetResellersPayload = {
    page: number;
    limit: number;
    search?: string;
    sort: string;
    order: "asc" | "desc";
}

export type ResellerUpdatePayload = {
    commission_rate?: number;
    is_active?: boolean;
    current_balance?: number;
    total_paid?: number;
    updated_at: Date;
}

export const createReseller = async (data: ResellerBase, transaction: Transaction): Promise<ResellerBase> => {
    const reseller = await Reseller.create(data, { transaction });
    return reseller;
}

export const getResellerById = async (id: string): Promise<ResellerBase | null> => {
    const reseller = await Reseller.findByPk(id);
    return reseller;
}

export const getResellers = async (payload: GetResellersPayload): Promise<PaginationResponse<ResellerBase>> => {
    const { page, limit, search, sort, order } = payload;
    const offset = (page - 1) * limit;
    const where: WhereOptions<any> = {};

    if (search) {
        Object.assign(where, {
            [Op.or]: [
                { user_id: { [Op.iLike]: `%${search}%` } },
            ],
        });
    }

    const allowedSortFields = ["user_id", "commission_rate", "joined_at", "is_active", "current_balance", "total_paid", "created_at"];
    const safeSort = allowedSortFields.includes(sort)
        ? sort
        : "created_at";
    
    const allowedOrderFileds = ["asc", "desc"];
    const safeOrder = allowedOrderFileds.includes(order)
        ? order
        : "desc";
    
    const { rows, count } = await Reseller.findAndCountAll({
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
    }

}  

export const updateReseller = async (id: string, data: ResellerUpdatePayload, transaction: Transaction): Promise<ResellerBase | null> => {
    const reseller = await Reseller.findByPk(id);
    if (!reseller) return null;
    await reseller.update(data, { transaction });
    return reseller;
}