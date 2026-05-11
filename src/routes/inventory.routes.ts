import { Router } from "express";
import { authenticate } from "../middleware/authenticator";
import { checkRole } from "../middleware/roleChecker";
import { validate } from "../middleware/validator";
import { createProductSchema, getInventorySchema, getProductSchema, updateProductSchema } from "../validators/inventory.validator";
import { createProduct, getInventory, getProduct, removeProduct, updateProduct } from "../controllers/inventory.controller";
import { upload } from "../middleware/imageSaver";

const router = Router();


router.post('/', authenticate, checkRole('admin'), upload.array('images', 5), validate({body: createProductSchema}), createProduct);
router.get('/:id', authenticate, validate({params: getProductSchema}), getProduct);
router.get('/', authenticate, validate({query: getInventorySchema}), getInventory);
router.put('/:id', authenticate, checkRole('admin'), validate({params: getProductSchema, body: updateProductSchema}), updateProduct);
router.delete('/:id', authenticate, checkRole('admin'), validate({params: getProductSchema}), removeProduct);

export default router;

