import { Follow, Seller, User } from "../models";
import { PaginationResponse } from "../types/pageination";

export interface FollowListOptions {
    page: number;
    limit: number;
}

export const countFollowers = async (sellerId: string): Promise<number> => {
    return Follow.count({ where: { seller_id: sellerId } });
};

export const countFollowingByUserId = async (userId: string): Promise<number> => {
    return Follow.count({ where: { follower_id: userId } });
};

export const findFollow = async (followerId: string, sellerId: string): Promise<Follow | null> => {
    return Follow.findOne({ where: { follower_id: followerId, seller_id: sellerId } });
};

export const findSellerByIdRaw = async (id: string): Promise<Seller | null> => {
    return Seller.findByPk(id);
};

export const createFollowIfNotExists = async (followerId: string, sellerId: string): Promise<[Follow, boolean]> => {
    return Follow.findOrCreate({
        where: { follower_id: followerId, seller_id: sellerId }
    });
};

export const destroyFollow = async (followerId: string, sellerId: string): Promise<number> => {
    return Follow.destroy({
        where: { follower_id: followerId, seller_id: sellerId }
    });
};

export const findFollowingSellers = async (followerId: string, options: FollowListOptions): Promise<PaginationResponse<Seller>> => {
    const { rows, count } = await Follow.findAndCountAll({
        where: { follower_id: followerId },
        include: [{ model: Seller, include: [{ model: User, attributes: ['full_name', 'email'] }] }],
        limit: options.limit,
        offset: (options.page - 1) * options.limit,
        order: [['created_at', 'DESC']]
    });

    const sellers = rows.map(r => r.seller!);

    return {
        data: sellers,
        meta: { page: options.page, limit: options.limit, total: count }
    };
};

export const findFollowers = async (sellerId: string, options: FollowListOptions): Promise<PaginationResponse<User>> => {
    const { rows, count } = await Follow.findAndCountAll({
        where: { seller_id: sellerId },
        include: [{ model: User, as: 'follower', attributes: ['id', 'full_name'] }],
        limit: options.limit,
        offset: (options.page - 1) * options.limit,
        order: [['created_at', 'DESC']]
    });

    const followers = rows.map(r => r.follower!);

    return {
        data: followers,
        meta: { page: options.page, limit: options.limit, total: count }
    };
};
