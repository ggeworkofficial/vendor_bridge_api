import { createError } from "../helpers/error";
import { Referral } from "../models";
import { findUserById } from "../repositories/user.repository";
import { findAllReferralsByReseller, findReferralsForList } from "../repositories/referral.repository";
import { findAllWithdrawalsByUser } from "../repositories/withdrawal.repository";
import { PaginationResponse } from "../types/pageination";

export interface WalletSummary {
    ref_code?: string | null;
    total_earnings: number;
    pending: number;
    available: number;
    withdrawn: number;
}

export interface ReferralListItem {
    id: string;
    listing_id: string;
    listing_title: string | undefined;
    buyer_masked: string;
    order_total: number;
    commission_percent: number;
    commission_amount: number;
    status: string;
    created_at: Date;
}

export class ReferralService {
    async getWallet(user_id: string): Promise<WalletSummary> {
        const user = await findUserById(user_id);
        if (!user) {
            throw createError('User not found', 404);
        }

        const referrals = await findAllReferralsByReseller(user_id);
        const withdrawals = await findAllWithdrawalsByUser(user_id);

        let total_earnings = 0;
        let pending = 0;
        let available = 0;
        let withdrawn = 0;

        for (const r of referrals) {
            const amount = Number(r.commission_amount);
            if (r.status === 'cleared' || r.status === 'paid') {
                available += amount;
                total_earnings += amount;
            } else if (r.status === 'pending') {
                pending += amount;
            }
        }

        for (const w of withdrawals) {
            const amount = Number(w.amount);
            if (w.status === 'paid' || w.status === 'approved' || w.status === 'pending') {
                available -= amount;
                if (w.status === 'paid') {
                    withdrawn += amount;
                }
            }
        }

        return {
            ref_code: user.ref_code,
            total_earnings,
            pending,
            available,
            withdrawn
        };
    }

    async getMyReferrals(user_id: string, page: number, limit: number): Promise<PaginationResponse<ReferralListItem>> {
        const result = await findReferralsForList({ user_id, page, limit });

        const data = result.data.map(r => this.mapReferralItem(r));

        return {
            data,
            meta: result.meta
        };
    }

    private mapReferralItem(r: Referral): ReferralListItem {
        let buyer_masked = 'Unknown';
        if (r.order && r.order.user) {
            const nameParts = r.order.user.full_name.split(' ');
            if (nameParts.length > 0) {
                const first = nameParts[0];
                const second = nameParts[1];
                buyer_masked = (first ? first[0] : '') + '**** ' + (second ? second[0] + '.' : '');
            }
        }

        return {
            id: r.id,
            listing_id: r.listing_id,
            listing_title: r.listing?.title,
            buyer_masked,
            order_total: r.order_total,
            commission_percent: r.commission_percent,
            commission_amount: r.commission_amount,
            status: r.status,
            created_at: r.created_at
        };
    }

    async trackClick(ref_code: string, listing_id: string): Promise<void> {
        console.log(`Click tracked: ref_code=${ref_code}, listing_id=${listing_id}`);
    }
}
