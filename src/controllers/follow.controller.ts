import { NextFunction, Request, Response } from 'express';
import { FollowService } from '../service/follow.service';

const followService = new FollowService();

export class FollowController {
  public async getState(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { sellerId } = req.params;

      const state = await followService.getState(sellerId as string, req.user?.id);

      res.status(200).json({ data: state });
    } catch (error) {
      next(error);
    }
  }

  public async follow(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { seller_id } = req.body;
      const follower_id = req.user!.id;

      await followService.follow(follower_id, seller_id);

      res.status(200).json({ success: true, message: 'Successfully followed seller' });
    } catch (error) {
      next(error);
    }
  }

  public async unfollow(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { sellerId } = req.params;
      const follower_id = req.user!.id;

      await followService.unfollow(follower_id, sellerId as string);

      res.status(200).json({ success: true, message: 'Successfully unfollowed seller' });
    } catch (error) {
      next(error);
    }
  }

  public async getFollowing(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const follower_id = req.user!.id;
      const page = Number(req.query.page ?? 1);
      const limit = Number(req.query.limit ?? 10);

      const result = await followService.getFollowing(follower_id, page, limit);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  public async getFollowers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { sellerId } = req.params;
      const page = Number(req.query.page ?? 1);
      const limit = Number(req.query.limit ?? 10);

      const result = await followService.getFollowers(sellerId as string, page, limit);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
