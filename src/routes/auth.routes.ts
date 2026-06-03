import { Router } from "express";
import { validate } from "../middleware/validator";
import { loginSchema, registerSchema } from "../validators/auth.validator";
import { getMe, login, logout, register } from "../controllers/auth.controller";
import { authenticate } from "../middleware/authenticator";

const router = Router();

router.post("/register", validate({ body: registerSchema }), register);
router.post("/login", validate({ body: loginSchema }), login);
router.get("/me", authenticate, getMe);
router.delete("/logout", logout);

export default router;
