import { Router } from "express";
import { authenticate } from "../middleware/authenticator";
import { checkOwnershipOrAdmin } from "../middleware/ownershipOrAdminChecker";
import { validate } from "../middleware/validator";
import { createOrderSchema, getOrderSchema, getOrdersForAdminSchema, updateOrderSchema } from "../validators/order.validator";
import { createOrder, getMyOrders, getOrder, getOrders, updateOrder } from "../controllers/order.controller";

const router = Router();

router.post('/', authenticate, validate({body: createOrderSchema}), createOrder);

router.get('/my', authenticate, validate({query: getOrdersForAdminSchema}), getMyOrders);
router.get('/:id', authenticate, validate({params: getOrderSchema}), getOrder);
router.get('/', authenticate, validate({query: getOrdersForAdminSchema}), getOrders);

router.put('/:id', authenticate, validate({params: getOrderSchema, body: updateOrderSchema}), updateOrder);



export default router;