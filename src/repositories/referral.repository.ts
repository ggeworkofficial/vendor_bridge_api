import { Listing, Order, Referral, User } from "../models";
import { Transaction } from "sequelize";
import { PaginationResponse } from "../types/pageination";

export interface ReferralListOptions {
    user_id: string;
    page: number;
    limit: number;
}

export const findAllReferralsByReseller = async (userId: string, transaction?: Transaction): Promise<Referral[]> => {
    return Referral.findAll({ where: { reseller_id: userId }, ...(transaction && { transaction }) });
};

export const findReferralsForList = async (options: ReferralListOptions): Promise<PaginationResponse<Referral>> => {
    const { rows, count } = await Referral.findAndCountAll({
        where: { reseller_id: options.user_id },
        include: [
            { model: Listing, attributes: ['id', 'title'] },
            { model: Order, include: [{ model: User, attributes: ['id', 'full_name'] }] }
        ],
        limit: options.limit,
        offset: (options.page - 1) * options.limit,
        order: [['created_at', 'DESC']]
    });

    return {
        data: rows,
        meta: { page: options.page, limit: options.limit, total: count }
    };
};
