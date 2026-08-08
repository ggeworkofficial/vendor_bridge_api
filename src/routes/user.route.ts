import { Router } from "express";
import { authenticate } from "../middleware/authenticator";
import { checkRole } from "../middleware/roleChecker";
import { validate } from "../middleware/validator";
import {
  createUserSchema,
  updateSchema,
  getUserSchema,
  getOneUserSchema,
  deleteUserSchema,
} from "../validators/user.validator";
import {
  createUser,
  getUser,
  getUsers,
  updateUser,
  deleteUser,
} from "../controllers/user.controller";
import { checkOwnershipOrAdmin } from "../middleware/ownershipOrAdminChecker";

const router = Router();

router.post("/", authenticate, checkRole("admin"), validate({ body: createUserSchema }), createUser);
router.get("/", authenticate, checkRole("admin"), validate({ query: getUserSchema }), getUsers);
router.get("/:id", authenticate, validate({ params: getOneUserSchema }), getUser);
router.put("/:id", authenticate, validate({ params: getOneUserSchema, body: updateSchema }), updateUser);
router.put("/admin/:id", authenticate, checkRole("admin"), validate({ params: getOneUserSchema, body: updateSchema }), updateUser);
router.delete("/:id", authenticate, checkOwnershipOrAdmin("id", true), validate({ params: deleteUserSchema }), deleteUser);

export default router;
