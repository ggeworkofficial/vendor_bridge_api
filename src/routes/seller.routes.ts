import { Router } from "express";
import { authenticate } from "../middleware/authenticator";
import { checkRole } from "../middleware/roleChecker";
import { validate } from "../middleware/validator";
import { createSellerScehma, getOneSellerSchema, getAllSellersSchema, updateSellerSchema } from "../validators/seller.validator";
import { createSeller, deleteSeller, getAllSellers, getOneSeller, updateSeller } from "../controllers/seller.controller";

const router = Router();


router.post('/', authenticate, checkRole('admin'), validate({body: createSellerScehma}),  createSeller);
router.get('/:id', authenticate, validate({params: getOneSellerSchema}), getOneSeller);
router.get('/', authenticate, validate({query: getAllSellersSchema}), getAllSellers);
router.put('/:id', authenticate, checkRole('admin'), validate({params: getOneSellerSchema,  body: updateSellerSchema}), updateSeller);
router.delete('/:id', authenticate, checkRole('admin'), validate({params: getOneSellerSchema}), deleteSeller);

export default router;