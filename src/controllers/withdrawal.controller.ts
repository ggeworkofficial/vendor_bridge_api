import { Request, Response } from 'express';
import { Withdrawal, Referral, User } from '../models';
import Postgres from '../connection/postgres';

export class WithdrawalController {
  public async requestWithdrawal(req: Request, res: Response): Promise<void> {
    const transaction = await Postgres.sequelize.transaction();
    try {
      const user_id = req.user!.id;
      const { amount, method, account_name, account_number, note } = req.body;

      if (!amount || amount <= 0) {
        res.status(422).json({ success: false, message: 'Amount must be greater than 0' });
        await transaction.rollback();
        return;
      }

      // Check for existing pending request
      const existingPending = await Withdrawal.findOne({ where: { user_id, status: 'pending' }, transaction });
      if (existingPending) {
        res.status(422).json({ success: false, message: 'You already have a pending withdrawal request' });
        await transaction.rollback();
        return;
      }

      // Calculate available balance
      const referrals = await Referral.findAll({ where: { reseller_id: user_id }, transaction });
      const withdrawals = await Withdrawal.findAll({ where: { user_id }, transaction });

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

      if (amount > available) {
        res.status(422).json({ success: false, message: 'Requested amount exceeds available balance' });
        await transaction.rollback();
        return;
      }

      const withdrawal = await Withdrawal.create({
        id: crypto.randomUUID(),
        user_id,
        amount,
        method,
        account_name,
        account_number,
        note
      }, { transaction });

      await transaction.commit();
      res.status(201).json({ success: true, message: 'Withdrawal requested successfully', data: withdrawal });
    } catch (error: any) {
      await transaction.rollback();
      res.status(500).json({ success: false, message: 'Error requesting withdrawal', errors: [error.message] });
    }
  }

  public async getMyWithdrawals(req: Request, res: Response): Promise<void> {
    try {
      const user_id = req.user!.id;
      const { page = 1, limit = 10 } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      const { rows, count } = await Withdrawal.findAndCountAll({
        where: { user_id },
        limit: Number(limit),
        offset,
        order: [['created_at', 'DESC']]
      });

      res.status(200).json({
        data: rows,
        meta: { page: Number(page), limit: Number(limit), total: count }
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Error fetching withdrawals', errors: [error.message] });
    }
  }

  public async getWithdrawals(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 10, status, search } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      const whereClause: any = {};
      if (status) {
        whereClause.status = status;
      }

      const { rows, count } = await Withdrawal.findAndCountAll({
        where: whereClause,
        include: [{ model: User, as: 'user', attributes: ['id', 'full_name', 'email'] }],
        limit: Number(limit),
        offset,
        order: [['created_at', 'DESC']]
      });

      res.status(200).json({
        data: rows,
        meta: { page: Number(page), limit: Number(limit), total: count }
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Error fetching withdrawals', errors: [error.message] });
    }
  }

  public async processWithdrawal(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status, note } = req.body;
      const admin_id = req.user!.id;

      if (!['approved', 'rejected', 'paid'].includes(status)) {
        res.status(400).json({ success: false, message: 'Invalid status' });
        return;
      }

      const withdrawal = await Withdrawal.findByPk(id as string);
      if (!withdrawal) {
        res.status(404).json({ success: false, message: 'Withdrawal not found' });
        return;
      }

      if (withdrawal.status !== 'pending') {
        res.status(422).json({ success: false, message: 'Can only process pending withdrawals' });
        return;
      }

      await withdrawal.update({
        status,
        note: note || withdrawal.note,
        processed_by: admin_id,
        processed_at: new Date()
      });

      res.status(200).json({ success: true, message: `Withdrawal ${status}` });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Error processing withdrawal', errors: [error.message] });
    }
  }
}
