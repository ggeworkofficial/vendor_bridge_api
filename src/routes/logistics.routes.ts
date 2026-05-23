import { Router } from "express";
import { authenticate } from "../middleware/authenticator";
import { checkRole } from "../middleware/roleChecker";
import { validate } from "../middleware/validator";
import { createLogistics, getLogistics, getLogisticsList, updateLogistics } from "../controllers/logistics.controller";
import { createLogisticsSchema, getLogisticsSchema, getLogisticsQuerySchema, updateLogisticsSchema } from "../validators/logistics.validator";

const router = Router();

router.post("/", authenticate, checkRole('admin'), validate({ body: createLogisticsSchema }), createLogistics);
router.get("/:id", authenticate, validate({ params: getLogisticsSchema }), getLogistics);
router.get("/", authenticate, validate({ query: getLogisticsQuerySchema }), getLogisticsList);
router.put("/:id", authenticate, checkRole('admin'), validate({ params: getLogisticsSchema, body: updateLogisticsSchema }), updateLogistics);

export default router;