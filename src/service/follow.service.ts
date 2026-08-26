import { createError } from "../helpers/error";
import { Seller, User } from "../models";
import {
    countFollowers,
    countFollowingByUserId,
    createFollowIfNotExists,
    destroyFollow,
    findFollow,
    findFollowers,
    findFollowingSellers,
    findSellerByIdRaw
} from "../repositories/follow.repository";
import { PaginationResponse } from "../types/pageination";

export interface FollowState {
    followers: number;
    following: number;
    is_following: boolean;
}

export class FollowService {
    async getState(sellerId: string, currentUserId?: string): Promise<FollowState> {
        const followersCount = await countFollowers(sellerId);

        const seller = await findSellerByIdRaw(sellerId);
        let followingCount = 0;
        if (seller) {
            followingCount = await countFollowingByUserId(seller.user_id!);
        }

        let is_following = false;
        if (currentUserId) {
            const follow = await findFollow(currentUserId, sellerId);
            is_following = !!follow;
        }

        return {
            followers: followersCount,
            following: followingCount,
            is_following
        };
    }

    async follow(follower_id: string, seller_id: string): Promise<void> {
        const seller = await findSellerByIdRaw(seller_id);
        if (!seller) {
            throw createError('Seller not found', 404);
        }

        if (seller.user_id === follower_id) {
            throw createError('Cannot follow yourself', 422);
        }

        await createFollowIfNotExists(follower_id, seller_id);
    }

    async unfollow(follower_id: string, sellerId: string): Promise<void> {
        await destroyFollow(follower_id, sellerId);
    }

    async getFollowing(follower_id: string, page: number, limit: number): Promise<PaginationResponse<Seller>> {
        return findFollowingSellers(follower_id, { page, limit });
    }

    async getFollowers(sellerId: string, page: number, limit: number): Promise<PaginationResponse<User>> {
        return findFollowers(sellerId, { page, limit });
    }
}
