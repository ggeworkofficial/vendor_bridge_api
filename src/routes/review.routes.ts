import { Router } from "express";
import { authenticate } from "../middleware/authenticator";
import { checkOwnershipOrAdmin } from "../middleware/ownershipOrAdminChecker";
import { validate } from "../middleware/validator";
import { createReviewSchema, getReviewSchema, getReviewsSchema, updateReviewSchema } from "../validators/review.validator";
import { createReview, deleteReview, getAllReviews, getReview, updateReview } from "../controllers/review.controller";

const router = Router();

router.post("/:id", authenticate, checkOwnershipOrAdmin("id", false), validate({params: getReviewSchema, body: createReviewSchema}), createReview);
router.get("/:id", authenticate, validate({params: getReviewSchema}), getReview);
router.get("/", authenticate, validate({query: getReviewsSchema}), getAllReviews);
router.put("/:id", authenticate, checkOwnershipOrAdmin("id", false), validate({params: getReviewSchema, body: updateReviewSchema, query: getReviewSchema}), updateReview);
router.delete("/:id", authenticate, checkOwnershipOrAdmin("id"), validate({params: getReviewSchema, query: getReviewSchema}), deleteReview);

export default router;