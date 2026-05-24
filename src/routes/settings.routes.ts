import { Router } from 'express';
import { createSettings, getSetting, getSettings, updateSettings } from '../controllers/settings.controller';
import { authenticate } from '../middleware/authenticator';
import { checkRole, Role } from '../middleware/roleChecker';
import { validate } from '../middleware/validator';
import { createSettingsSchema, getSettingsSchema, updateSettingsSchema, getSettingsQuerySchema } from '../validators/settings.validator';

const router = Router();

router.post('/', authenticate, checkRole("admin"), validate({ body: createSettingsSchema }), createSettings);
router.get('/public/:key', authenticate, validate({ params: getSettingsSchema }), getSetting);
router.get('/public', authenticate, validate({ query:getSettingsQuerySchema }), getSettings);
router.put('/:key', authenticate, checkRole("admin"), validate({ params: getSettingsSchema, body: updateSettingsSchema }), updateSettings);

export default router;