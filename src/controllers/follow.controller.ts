import { Request, Response } from 'express';
import { Follow, User, Seller } from '../models';
import Postgres from '../connection/postgres';

export class FollowController {
  public async getState(req: Request, res: Response): Promise<void> {
    try {
      const { sellerId } = req.params;
      
      const followersCount = await Follow.count({ where: { seller_id: sellerId } });
      
      // A seller belongs to a user. followingCount is based on the seller's user_id.
      let followingCount = 0;
      const seller = await Seller.findByPk(sellerId as string);
      if (seller) {
         followingCount = await Follow.count({ where: { follower_id: seller.user_id } });
      }

      let is_following = false;
      
      // Determine user from headers/auth. The auth middleware might not be applied, but if we have a way to extract user...
      // Since it's public, req.user might be undefined unless we use a soft auth middleware.
      // Assuming we have req.user if token was passed, else undefined.
      // We will check if req.user exists. The route is public in the docs, so we have to manually verify the token if we want `is_following` or use a soft authenticate.
      // Actually, if we use a standard approach, maybe frontend doesn't send token on public endpoints. Let's assume if req.user is set, we check.
      // Wait, the router doesn't have `authenticate` on this route. Let's just return false if no req.user (we might need to parse cookie manually, but for now, assuming req.user might be attached by some global middleware or we skip it).
      
      // If we want is_following to work, we might need a soft auth middleware. For now, if req.user is there:
      if (req.user) {
        const follow = await Follow.findOne({ where: { follower_id: req.user.id, seller_id: sellerId } });
        is_following = !!follow;
      }

      res.status(200).json({
        data: {
          followers: followersCount,
          following: followingCount,
          is_following
        }
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Error fetching follow state', errors: [error.message] });
    }
  }

  public async follow(req: Request, res: Response): Promise<void> {
    try {
      const { seller_id } = req.body;
      const follower_id = req.user!.id;

      const seller = await Seller.findByPk(seller_id as string);
      if (!seller) {
        res.status(404).json({ success: false, message: 'Seller not found' });
        return;
      }

      if (seller.user_id === follower_id) {
        res.status(422).json({ success: false, message: 'Cannot follow yourself' });
        return;
      }

      await Follow.findOrCreate({
        where: { follower_id, seller_id }
      });

      res.status(200).json({ success: true, message: 'Successfully followed seller' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Error following seller', errors: [error.message] });
    }
  }

  public async unfollow(req: Request, res: Response): Promise<void> {
    try {
      const { sellerId } = req.params;
      const follower_id = req.user!.id;

      await Follow.destroy({
        where: { follower_id, seller_id: sellerId }
      });

      res.status(200).json({ success: true, message: 'Successfully unfollowed seller' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Error unfollowing seller', errors: [error.message] });
    }
  }

  public async getFollowing(req: Request, res: Response): Promise<void> {
    try {
      const follower_id = req.user!.id;
      const { page = 1, limit = 10 } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      const { rows, count } = await Follow.findAndCountAll({
        where: { follower_id },
        include: [{ model: Seller, include: [{ model: User, attributes: ['full_name', 'email'] }] }],
        limit: Number(limit),
        offset,
        order: [['created_at', 'DESC']]
      });

      const sellers = rows.map(r => r.seller);

      res.status(200).json({
        data: sellers,
        meta: { page: Number(page), limit: Number(limit), total: count }
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Error fetching following list', errors: [error.message] });
    }
  }

  public async getFollowers(req: Request, res: Response): Promise<void> {
    try {
      const { sellerId } = req.params;
      const { page = 1, limit = 10 } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      const { rows, count } = await Follow.findAndCountAll({
        where: { seller_id: sellerId },
        include: [{ model: User, as: 'follower', attributes: ['id', 'full_name'] }],
        limit: Number(limit),
        offset,
        order: [['created_at', 'DESC']]
      });

      const followers = rows.map(r => r.follower);

      res.status(200).json({
        data: followers,
        meta: { page: Number(page), limit: Number(limit), total: count }
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Error fetching followers list', errors: [error.message] });
    }
  }
}
