import express from 'express';
import { authenticate, optionalAuthenticate } from '../middleware/authenticator';
import { checkRole, Role } from '../middleware/roleChecker';
import { upload } from '../middleware/imageSaver';
import { ListingController } from '../controllers/listing.controller';

const router = express.Router();
const listingController = new ListingController();

router.post('/', authenticate, upload.array('images', 8), listingController.createListing);
router.get('/', optionalAuthenticate, listingController.getListings);
router.get('/my', authenticate, listingController.getMyListings);
router.get('/:id', optionalAuthenticate, listingController.getListing);
router.get('/by-product/:productId', optionalAuthenticate, listingController.getListingByProduct);
router.put('/:id', authenticate, upload.array('images', 8), listingController.updateListing);
router.delete('/:id', authenticate, listingController.deleteListing);
router.put('/:id/moderate', authenticate, checkRole('admin'), listingController.moderateListing);

export default router;
