import { Router } from 'express';
import { authenticate } from '../middleware/authenticator';
import { checkRole } from '../middleware/roleChecker';
import { upload } from '../middleware/imageSaver';
import { validate } from '../middleware/validator';
import { createProductImageSchema, getProductImageSchema, getProductImagesSchema, updateProductImageSchema } from '../validators/product-image.validator';
import { createProductImage, deleteProductImage, getProductImage, getProductImages, updateProductImage } from '../controllers/product-image.controller';

const router = Router();

router.post('/', authenticate, checkRole('admin'), upload.array('images', 1), validate({body: createProductImageSchema}), createProductImage);
router.get('/:id', authenticate, validate({params: getProductImageSchema}), getProductImage);
router.get('/', authenticate, validate({query: getProductImagesSchema}), getProductImages);
router.put('/:id', authenticate, checkRole('admin'), validate({params: getProductImageSchema, body: updateProductImageSchema}), updateProductImage);
router.delete('/:id', authenticate, checkRole('admin'), validate({params: getProductImageSchema}), deleteProductImage);


export default router