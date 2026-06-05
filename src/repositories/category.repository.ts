import { Sequelize } from "sequelize-typescript";
import { Category } from "../models";
import { Op } from "sequelize";
import { PaginationResponse } from "../types/pageination";

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

interface GetCategoryOprion {
    page: number;
    limit: number;
    sort: 'name' | 'created_at';
    order: 'asc' | 'desc';
    search?: string;
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

export const findAllCategories = async (options: GetCategoryOprion): Promise<PaginationResponse<CategoryResult>> => {
   
    const { rows, count } = await Category.findAndCountAll({
        limit: options.limit,
        offset: (options.page - 1) * options.limit,
        order: [[options.sort, options.order]], 
        where: options.search ? { name: { [Op.like]: `%${options.search}%` } } : {}
    });
    return {
        data: rows,
        meta: {
            page: options.page,
            limit: options.limit,
            total: count
        }
    };
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