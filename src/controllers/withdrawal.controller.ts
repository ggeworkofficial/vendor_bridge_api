import { NextFunction, Request, Response } from 'express';
import Postgres from '../connection/postgres';
import { WithdrawalService } from '../service/withdrawal.service';

const withdrawalService = new WithdrawalService();

export class WithdrawalController {
  public async requestWithdrawal(req: Request, res: Response, next: NextFunction): Promise<void> {
    const transaction = await Postgres.getInstance().transaction();
    try {
      const user_id = req.user!.id;
      const { amount, method, account_name, account_number, note } = req.body;

      const withdrawal = await withdrawalService.requestWithdrawal(user_id, {
        amount,
        method,
        account_name,
        account_number,
        note
      }, transaction);

      await transaction.commit();

      res.status(201).json({ success: true, message: 'Withdrawal requested successfully', data: withdrawal });
    } catch (error) {
      await transaction.rollback();
      next(error);
    }
  }

  public async getMyWithdrawals(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user_id = req.user!.id;
      const page = Number(req.query.page ?? 1);
      const limit = Number(req.query.limit ?? 10);

      const result = await withdrawalService.getMyWithdrawals(user_id, page, limit);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  public async getWithdrawals(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = Number(req.query.page ?? 1);
      const limit = Number(req.query.limit ?? 10);

      const result = await withdrawalService.getWithdrawals(page, limit, req.query.status as string | undefined);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  public async processWithdrawal(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const admin_id = req.user!.id;

      const status = await withdrawalService.processWithdrawal(id as string, admin_id, req.body);

      res.status(200).json({ success: true, message: `Withdrawal ${status}` });
    } catch (error) {
      next(error);
    }
  }
}
