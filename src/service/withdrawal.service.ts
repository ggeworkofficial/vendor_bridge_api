import { Transaction } from "sequelize";
import { createError } from "../helpers/error";
import { Withdrawal } from "../models";
import { findAllReferralsByReseller } from "../repositories/referral.repository";
import {
    CreateWithdrawalData,
    createWithdrawal,
    findAllWithdrawals,
    findAllWithdrawalsByUser,
    findPendingWithdrawalByUser,
    findWithdrawalById,
    findWithdrawalsByUser,
    updateWithdrawal
} from "../repositories/withdrawal.repository";
import { PaginationResponse } from "../types/pageination";

export interface RequestWithdrawalInput {
    amount: number;
    method: string;
    account_name: string;
    account_number: string;
    note?: string;
}

export interface ProcessWithdrawalInput {
    status: string;
    note?: string;
}

export class WithdrawalService {
    async requestWithdrawal(user_id: string, input: RequestWithdrawalInput, transaction: Transaction): Promise<Withdrawal> {
        const { amount, method, account_name, account_number, note } = input;

        if (!amount || amount <= 0) {
            throw createError('Amount must be greater than 0', 422);
        }

        const existingPending = await findPendingWithdrawalByUser(user_id, transaction);
        if (existingPending) {
            throw createError('You already have a pending withdrawal request', 422);
        }

        const available = await this.calculateAvailableBalance(user_id, transaction);

        if (amount > available) {
            throw createError('Requested amount exceeds available balance', 422);
        }

        const withdrawalData: CreateWithdrawalData = {
            id: crypto.randomUUID(),
            user_id,
            amount,
            method,
            account_name,
            account_number,
            ...(note !== undefined && { note })
        };

        return createWithdrawal(withdrawalData, transaction);
    }

    private async calculateAvailableBalance(user_id: string, transaction?: Transaction): Promise<number> {
        const referrals = await findAllReferralsByReseller(user_id, transaction);
        const withdrawals = await findAllWithdrawalsByUser(user_id, transaction);

        let available = 0;

        for (const r of referrals) {
            if (r.status === 'cleared' || r.status === 'paid') {
                available += Number(r.commission_amount);
            }
        }

        for (const w of withdrawals) {
            if (w.status === 'paid' || w.status === 'approved' || w.status === 'pending') {
                available -= Number(w.amount);
            }
        }

        return available;
    }

    async getMyWithdrawals(user_id: string, page: number, limit: number): Promise<PaginationResponse<Withdrawal>> {
        return findWithdrawalsByUser(user_id, { page, limit });
    }

    async getWithdrawals(page: number, limit: number, status?: string): Promise<PaginationResponse<Withdrawal>> {
        return findAllWithdrawals({ page, limit, status });
    }

    async processWithdrawal(id: string, admin_id: string, input: ProcessWithdrawalInput): Promise<string> {
        const { status, note } = input;

        if (!['approved', 'rejected', 'paid'].includes(status)) {
            throw createError('Invalid status', 400);
        }

        const withdrawal = await findWithdrawalById(id);
        if (!withdrawal) {
            throw createError('Withdrawal not found', 404);
        }

        if (withdrawal.status !== 'pending') {
            throw createError('Can only process pending withdrawals', 422);
        }

        await updateWithdrawal(withdrawal, {
            status,
            note: note || withdrawal.note,
            processed_by: admin_id,
            processed_at: new Date()
        });

        return status;
    }
}
