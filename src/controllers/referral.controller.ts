import { NextFunction, Request, Response } from 'express';
import { ReferralService } from '../service/referral.service';

const referralService = new ReferralService();

export class ReferralController {
  public async getWallet(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user_id = req.user!.id;

      const wallet = await referralService.getWallet(user_id);

      res.status(200).json({ data: wallet });
    } catch (error) {
      next(error);
    }
  }

  public async getMyReferrals(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user_id = req.user!.id;
      const page = Number(req.query.page ?? 1);
      const limit = Number(req.query.limit ?? 10);

      const result = await referralService.getMyReferrals(user_id, page, limit);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  public async trackClick(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { ref_code, listing_id } = req.body;

      await referralService.trackClick(ref_code, listing_id);

      res.status(200).json({ success: true });
    } catch (error) {
      next(error);
    }
  }
}
