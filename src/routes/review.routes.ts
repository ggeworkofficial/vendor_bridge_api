import { Router } from "express";
import { authenticate } from "../middleware/authenticator";
import { checkOwnershipOrAdmin } from "../middleware/ownershipOrAdminChecker";
import { validate } from "../middleware/validator";
import { createReviewSchema, getReviewSchema, getReviewsSchema, updateReviewSchema } from "../validators/review.validator";
import { createReview, deleteReview, getAllReviews, getReview, updateReview } from "../controllers/review.controller";

const router = Router();

router.post("/", authenticate, validate({body: createReviewSchema}), createReview);
router.get("/:id", authenticate, validate({params: getReviewSchema}), getReview);
router.get("/", authenticate, validate({query: getReviewsSchema}), getAllReviews);
router.put("/:id", authenticate, validate({params: getReviewSchema, body: updateReviewSchema}), updateReview);
router.delete("/:id", authenticate, validate({params: getReviewSchema}), deleteReview);

export default router;