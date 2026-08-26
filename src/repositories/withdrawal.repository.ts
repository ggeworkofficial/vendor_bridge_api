import { User, Withdrawal } from "../models";
import { Transaction } from "sequelize";
import { PaginationResponse } from "../types/pageination";

export interface CreateWithdrawalData {
    id: string;
    user_id: string;
    amount: number;
    method: string;
    account_name: string;
    account_number: string;
    note?: string | null;
}

export interface WithdrawalListOptions {
    page: number;
    limit: number;
    status?: string | undefined;
}

export const findAllWithdrawalsByUser = async (userId: string, transaction?: Transaction): Promise<Withdrawal[]> => {
    return Withdrawal.findAll({ where: { user_id: userId }, ...(transaction && { transaction }) });
};

export const findPendingWithdrawalByUser = async (userId: string, transaction?: Transaction): Promise<Withdrawal | null> => {
    return Withdrawal.findOne({ where: { user_id: userId, status: 'pending' }, ...(transaction && { transaction }) });
};

export const createWithdrawal = async (data: CreateWithdrawalData, transaction: Transaction): Promise<Withdrawal> => {
    return Withdrawal.create(data as any, { transaction });
};

export const findWithdrawalsByUser = async (userId: string, options: { page: number; limit: number }): Promise<PaginationResponse<Withdrawal>> => {
    const { rows, count } = await Withdrawal.findAndCountAll({
        where: { user_id: userId },
        limit: options.limit,
        offset: (options.page - 1) * options.limit,
        order: [['created_at', 'DESC']]
    });

    return {
        data: rows,
        meta: { page: options.page, limit: options.limit, total: count }
    };
};

export const findAllWithdrawals = async (options: WithdrawalListOptions): Promise<PaginationResponse<Withdrawal>> => {
    const whereClause: any = {};
    if (options.status) {
        whereClause.status = options.status;
    }

    const { rows, count } = await Withdrawal.findAndCountAll({
        where: whereClause,
        include: [{ model: User, as: 'user', attributes: ['id', 'full_name', 'email'] }],
        limit: options.limit,
        offset: (options.page - 1) * options.limit,
        order: [['created_at', 'DESC']]
    });

    return {
        data: rows,
        meta: { page: options.page, limit: options.limit, total: count }
    };
};

export const findWithdrawalById = async (id: string): Promise<Withdrawal | null> => {
    return Withdrawal.findByPk(id);
};

export const updateWithdrawal = async (withdrawal: Withdrawal, data: Record<string, any>): Promise<Withdrawal> => {
    return withdrawal.update(data);
};
