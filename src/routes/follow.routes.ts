import express from 'express';
import { authenticate, optionalAuthenticate } from '../middleware/authenticator';
import { FollowController } from '../controllers/follow.controller';

const router = express.Router();
const followController = new FollowController();

router.get('/state/:sellerId', optionalAuthenticate, followController.getState);
router.post('/', authenticate, followController.follow);
router.delete('/:sellerId', authenticate, followController.unfollow);
router.get('/following', authenticate, followController.getFollowing);
router.get('/followers/:sellerId', followController.getFollowers);

export default router;
