import { Request, Response } from 'express';
import { Referral, Withdrawal, Listing, User, Order } from '../models';
import { Op } from 'sequelize';
import Postgres from '../connection/postgres';

export class ReferralController {
  public async getWallet(req: Request, res: Response): Promise<void> {
    try {
      const user_id = req.user!.id;
      
      const user = await User.findByPk(user_id);
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }

      // Calculate totals
      const referrals = await Referral.findAll({ where: { reseller_id: user_id } });
      const withdrawals = await Withdrawal.findAll({ where: { user_id } });

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

      res.status(200).json({
        data: {
          ref_code: user.ref_code,
          total_earnings,
          pending,
          available,
          withdrawn
        }
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Error fetching wallet', errors: [error.message] });
    }
  }

  public async getMyReferrals(req: Request, res: Response): Promise<void> {
    try {
      const user_id = req.user!.id;
      const { page = 1, limit = 10 } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      const { rows, count } = await Referral.findAndCountAll({
        where: { reseller_id: user_id },
        include: [
          { model: Listing, attributes: ['id', 'title'] },
          { model: Order, include: [{ model: User, attributes: ['id', 'full_name'] }] }
        ],
        limit: Number(limit),
        offset,
        order: [['created_at', 'DESC']]
      });

      const data = rows.map(r => {
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
      });

      res.status(200).json({
        data,
        meta: { page: Number(page), limit: Number(limit), total: count }
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Error fetching referrals', errors: [error.message] });
    }
  }

  public async trackClick(req: Request, res: Response): Promise<void> {
    try {
      // Just a stub for click tracking
      const { ref_code, listing_id } = req.body;
      console.log(`Click tracked: ref_code=${ref_code}, listing_id=${listing_id}`);
      res.status(200).json({ success: true });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Error tracking click', errors: [error.message] });
    }
  }
}
