import { Category } from "../models";

interface CreateCategory {
    id: string;
    name: string;
    created_at: Date;
    updated_at: Date;
}

interface UpdateCategory {
    id: string;
    name?: string;
    updated_at: Date;
}

export interface CategoryResult {
    id: string;
    name: string;
    created_at: Date;
    updated_at: Date;
}

export const CreateCategory = async (data: CreateCategory): Promise<CategoryResult> => {
    return Category.create(data);
}

export const findCategoryById = async (id: string): Promise<CategoryResult | null> => {
    return Category.findByPk(id);
}

export const findAllCategories = async (): Promise<CategoryResult[]> => {
    return Category.findAll();
}

export const updateCategory = async (id: string, data: UpdateCategory): Promise<CategoryResult | null> => {
    const category = await Category.findByPk(id);
    if (!category) {
        return null;
    }
    await category.update(data);
    return category;
}

export const deleteCategory = async (id: string): Promise<boolean> => {
    const deleted = await Category.destroy({ where: { id } });
    return deleted > 0;
}