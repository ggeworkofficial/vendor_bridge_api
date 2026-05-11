import { Request, Response, NextFunction } from 'express';
import { ReviewService } from '../service/review.service';
import { CreateReviewBody, GetReviewParam, GetReviewParamWithUser, GetReviewsParam, UpdateReviewBody } from '../validators/review.validator';
import { UniqueConstraintError } from "sequelize";

const reviewService = new ReviewService();

export const createReview = async (req: Request<GetReviewParam, any, CreateReviewBody>, res: Response, next: NextFunction) => {
    try {
        const data = req.body;
        const user_id = req.params.id;
        const result = await reviewService.create({...data, user_id});
        res.status(201).json({
            success: true,
            message: "Review created",
            data: result
        });
    } catch (error) {
        if (error instanceof UniqueConstraintError) {
        return res.status(409).json({
            success: false,
            message: "You already reviewed this product"
        });
    }
        next(error);
    }
};

export const getReview = async (req: Request<GetReviewParam>, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const result = await reviewService.getOne(id);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const getAllReviews = async (req: Request<{}, any, {}, any>, res: Response, next: NextFunction) => {
    try {
        const query = (req as any).validated?.query as GetReviewsParam;
        const result = await reviewService.getAll(query);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const updateReview = async (req: Request<{}, any, UpdateReviewBody, any>, res: Response, next: NextFunction) => {
    try {
        const data = req.body;
        const query = (req as any).validated?.query as GetReviewParam;
        const result = await reviewService.update(query.id, data);
        res.status(200).json({
            success: true,
            message: "Review updated",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteReview = async (req: Request<{}, any, {}, any>, res: Response, next: NextFunction) => {
    try {
        const query = (req as any).validated?.query as GetReviewParam;
        const result = await reviewService.remove(query.id);
        res.status(200).json({
            success: result,
            message: "Review deleted",
        });
    } catch (error) {
        next(error);
    }
};