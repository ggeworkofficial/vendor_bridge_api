import express from 'express';
import { authenticate } from '../middleware/authenticator';
import { ReferralController } from '../controllers/referral.controller';

const router = express.Router();
const referralController = new ReferralController();

router.get('/wallet', authenticate, referralController.getWallet);
router.get('/referrals/my', authenticate, referralController.getMyReferrals);
router.post('/referrals/track', referralController.trackClick);

export default router;
