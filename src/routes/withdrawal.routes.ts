import express from 'express';
import { authenticate } from '../middleware/authenticator';
import { checkRole, Role } from '../middleware/roleChecker';
import { WithdrawalController } from '../controllers/withdrawal.controller';

const router = express.Router();
const withdrawalController = new WithdrawalController();

router.post('/', authenticate, withdrawalController.requestWithdrawal);
router.get('/my', authenticate, withdrawalController.getMyWithdrawals);
router.get('/', authenticate, checkRole('admin'), withdrawalController.getWithdrawals);
router.put('/:id', authenticate, checkRole('admin'), withdrawalController.processWithdrawal);

export default router;
