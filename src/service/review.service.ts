import { createReview, getReview, getReviews, updateReview, deleteReview } from '../repositories/review.repository';
import { CreateReviewBody, GetReviewParam, GetReviewsParam, UpdateReviewBody } from '../validators/review.validator';
import { PaginationResponse } from '../types/pageination';
import { randomUUID } from 'crypto';
import { removeUndefined } from '../utils/removeUndefined';
import { ReviewResult } from '../repositories/review.repository';
import { createError } from '../helpers/error';

type CreateReviewOption = CreateReviewBody & {
    user_id: string;
}

export class ReviewService {
    async create(data: CreateReviewOption): Promise<ReviewResult> {
        const reviewData = {
            ...data,
            id: randomUUID(),
            created_at: new Date(),
            updated_at: new Date()
        };
        const cleanData = removeUndefined(reviewData);
        return await createReview(cleanData);
    }

    async getOne(id: GetReviewParam['id']): Promise<ReviewResult> {
        const review = await getReview(id);
        if (!review) throw createError("Review not found", 404);
        return review;
    }

    async getAll(query: GetReviewsParam): Promise<PaginationResponse<ReviewResult>> {
        const cleanPayload = removeUndefined(query);
        return await getReviews(cleanPayload);
    }

    async update(id: GetReviewParam['id'], data: UpdateReviewBody): Promise<ReviewResult> {
        const updateData = {
            ...data,
            updated_at: new Date()
        };
        const cleanData = removeUndefined(updateData)
        const review = await updateReview(id, cleanData);
        if (!review) throw createError("Review not found", 404);
        return review;
    }

    async remove(id: GetReviewParam['id']): Promise<boolean> {
        const success = await deleteReview(id);
        if (!success) throw createError("Review not found", 404);
        return success;
    }
}