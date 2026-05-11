import { Op, WhereOptions } from "sequelize";
import { Inventory, Review, User } from "../models";
import { PaginationResponse } from "../types/pageination";


export type ReviewBase = {
    id: string;
    product_id: string;
    user_id: string;
    rating: number;
    comment?: string;
    created_at: Date;
    updated_at: Date;
}
type GetReviewsOption = {
    product_id: string;
    page: number;
    limit: number;
    include_empty_comments: boolean;
    search?: string;
    sort: "rating" | "created_at";
    order: "asc" | "desc";
}
export type CreateReviewResult = Omit<ReviewBase, "product_id" | "user_id"> & {
    product_id?: string;
    user_id?: string;
}
export type ReviewResult = Omit<ReviewBase, "product_id" | "user_id"> & {
    product?: {id: string, name: string};
    user?: {id: string, name: string};
}
type UpdateReviewOptions = Partial<Omit<ReviewBase, "id" | "created_at">>

const mapReviewData = (review: any): ReviewResult => {
    return {
        id: review.id,
         ...(review.product && {
            product: {
                id: review.product.id,
                name: review.product.name
            }
        }),
        user: { id: review.user?.id || "", name: review.user?.full_name || "" },
        rating: review.rating,
        comment: review.comment || "",
        created_at: review.created_at,
        updated_at: review.updated_at,
    }
}

export const createReview = async (data: ReviewBase): Promise<CreateReviewResult> => {
    return await Review.create(data);
}

export const getReview = async (id: string): Promise<ReviewResult | null> => {
    const review = await Review.findByPk(id, { include: [
        {model: Inventory, attributes: ['id', 'name']},
        {model: User, attributes: ['id', 'full_name']},
    ]});
    if (!review) return null

    return mapReviewData(review);
}

export const getReviews = async (payload: GetReviewsOption): Promise<PaginationResponse<ReviewResult>> => {
    const { 
        product_id,
        page,
        limit,
        include_empty_comments,
        search,
        sort,
        order
    } = payload;

    const offset = (page - 1) * limit;
    const where: WhereOptions<any> = {
        product_id,
    };

    if (!include_empty_comments) {
        where.comment = {
            [Op.and]: [
                { [Op.not]: null },
                { [Op.ne]: "" }
            ]
        };
    }

    if (search) {
        Object.assign(where, {
            [Op.or]: [
            { comment: { [Op.iLike]: `%${search}%` } },
            ],
        });
    }

    const allowedSortFields = ["rating", "created_at"];
    const safeSort = allowedSortFields.includes(sort)
    ? sort
    : "created_at";

    const allowedOrderFileds = ["asc", "desc"];
    const safeOrder = allowedOrderFileds.includes(order)
        ? order
        : "desc";

    const reviews = await Review.findAndCountAll({
        where,
        limit,
        offset,
        include: [
            {model: User, attributes: ['id', 'full_name']},
        ],
        order: [[safeSort, safeOrder]]
    });

    return {
        data: reviews.rows.map(mapReviewData),
        meta: {
            page,
            limit,
            total: reviews.count
        }
    }
}

export const updateReview = async (id: string, data: UpdateReviewOptions): Promise<ReviewResult | null> => {
    await Review.update(data, { where: { id }});
    return await getReview(id);
}

export const deleteReview = async (id: string): Promise<boolean> => {
    return await Review.destroy({ where: { id }}) > 0;
}