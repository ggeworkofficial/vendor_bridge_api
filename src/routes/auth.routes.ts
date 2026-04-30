import { Router } from "express";
import { validate } from "../middleware/validator";
import { loginSchema, registerSchema } from "../validators/auth.validator";
import { login, logout, register } from "../controllers/auth.controller";

const router = Router();

router.post("/register", validate({ body: registerSchema }), register);
router.post("/login", validate({ body: loginSchema }), login);
router.delete("/logout", logout);

export default router;
