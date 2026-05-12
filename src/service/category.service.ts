import { createError } from "../helpers/error";
import { CategoryResult, CreateCategory, deleteCategory, findAllCategories, findCategoryById, updateCategory } from "../repositories/category.repository";
import { invalidateCachedProducts } from "../repositories/inventory.repository";
import { removeUndefined } from "../utils/removeUndefined";
import { CreateCategoryBody, GetOneCategoryParams, UpdateCategoryBody } from "../validators/category.validator";


export default class CategoryService {
    async createCategory(data: CreateCategoryBody): Promise<CategoryResult> {
        const id = crypto.randomUUID();
        const created_at = new Date();
        const updated_at = new Date();
        return await CreateCategory({ id, ...data, created_at, updated_at });
    }

    async getOneCategory(data: GetOneCategoryParams): Promise<CategoryResult | null> {
        const seller = await findCategoryById(data.id);
        if (!seller) throw createError("Category not found", 404);
        return seller;
    }

    async getAllCategories(): Promise<CategoryResult[]> {
        return await findAllCategories();
    }

    async updateCategory(data: GetOneCategoryParams & UpdateCategoryBody): Promise<CategoryResult> {
        const updated_at = new Date();
        const cleanData = removeUndefined({ ...data, updated_at });
        const result = await updateCategory(data.id, cleanData);
        if (!result) throw createError("Category not found", 404);
        await invalidateCachedProducts();
        return result;
    }

    async deleteCategory(data: GetOneCategoryParams): Promise<boolean> {
        const success = await deleteCategory(data.id);
        if (!success) throw createError('Category not found', 404);
        await invalidateCachedProducts();
        return success;
    }
}