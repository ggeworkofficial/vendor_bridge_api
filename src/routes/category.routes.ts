import { Router } from "express";
import { createCategory, updateCategory, deleteCategory, getAllCategories, getOneCategory } from "../controllers/category.controller";
import { createCategorySchema, getOneCategorySchema, updateCategorySchema } from '../validators/category.validator'
import { authenticate } from "../middleware/authenticator";
import { checkRole } from "../middleware/roleChecker";
import { validate } from "../middleware/validator";

const router = Router();

router.post("/", authenticate, checkRole("admin"), validate({body: createCategorySchema}), createCategory);
router.get("/:id", authenticate, validate({params: getOneCategorySchema}), getOneCategory);
router.get("/", authenticate, getAllCategories);
router.put("/:id", authenticate, checkRole("admin"), validate({params: getOneCategorySchema, body: updateCategorySchema}), updateCategory);
router.delete("/:id", authenticate, checkRole("admin"), validate({params: getOneCategorySchema}), deleteCategory);

export default router;