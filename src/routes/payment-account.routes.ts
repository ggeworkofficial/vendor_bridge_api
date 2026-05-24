import { Router } from "express";
import { authenticate } from "../middleware/authenticator";
import { checkRole } from "../middleware/roleChecker";
import { createPaymentAccount, deletePaymentAccount, getPaymentAccount, getPaymentAccounts, updatePaymentAccount } from "../controllers/payment-account.controller";
import { validate } from "../middleware/validator";
import { createPaymentAccountSchema, getPaymentAccountSchema, getPaymentAccountsSchema, updatePaymentAccountSchema } from "../validators/payment-account.validator";

const router = Router();

router.post("/", authenticate, checkRole("admin"), validate({body: createPaymentAccountSchema}), createPaymentAccount);
router.get("/", authenticate, validate({query: getPaymentAccountsSchema}), getPaymentAccounts);
router.get("/:id", authenticate, validate({params: getPaymentAccountSchema}), getPaymentAccount);
router.put("/:id", authenticate, checkRole("admin"), validate({params: getPaymentAccountSchema, body: updatePaymentAccountSchema}), updatePaymentAccount);
router.delete("/:id", authenticate, checkRole("admin"), validate({params: getPaymentAccountSchema}), deletePaymentAccount);

export default router;