import { Router } from "express";
import { authenticate } from "../middleware/authenticator";
import { validate } from "../middleware/validator";
import { createReceiptController, getReceiptController, getReceipts, updateReceipt } from "../controllers/receipt.controller";
import { createReceiptSchema, getReceiptSchema, getReceiptsSchema, updateReceiptSchema } from "../validators/receipt.validator";
import { upload } from "../middleware/imageSaver";
import { checkRole } from "../middleware/roleChecker";

const router = Router();

router.post('/', authenticate, upload.array('images', 1), validate({body: createReceiptSchema}), createReceiptController);
router.get('/:id', authenticate, validate({params: getReceiptSchema}), getReceiptController);
router.get('/', authenticate, validate({query: getReceiptsSchema}), getReceipts);
router.put('/:id', authenticate, validate({params: getReceiptSchema, body: updateReceiptSchema}), updateReceipt);

export default router;