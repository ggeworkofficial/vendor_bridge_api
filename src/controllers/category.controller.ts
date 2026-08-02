import { NextFunction, Request, Response } from "express";
import { CreateCategoryBody, GetAllCategoriesQuery, GetOneCategoryParams, UpdateCategoryBody } from "../validators/category.validator";
import CategoryService from "../service/category.service";


export const createCategory = async (req: Request<{}, any, CreateCategoryBody>, res: Response, next: NextFunction) => {
    try {
        const body = req.body;
        const category = await new CategoryService().createCategory(body);
        return res.status(201).json({success: true, message: "Category created", data: category });

    } catch (error) {
        next(error);
    }
}

export const getOneCategory = async (req: Request<GetOneCategoryParams>, res: Response, next: NextFunction) => {
    try {
        const params = req.params;
        const category = await new CategoryService().getOneCategory(params);
        return res.status(200).json(category);
    } catch (error) {
        next(error);
    }
}

export const getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const query = (req as any).validated?.query as GetAllCategoriesQuery;
        const categories = await new CategoryService().getAllCategories(query);
        return res.status(200).json(categories);
    } catch (error) {
        next(error);
    }
}

export const updateCategory = async (req: Request<GetOneCategoryParams, any, UpdateCategoryBody>, res: Response, next: NextFunction) => {
    try {
        const params = req.params;
        const body = req.body;
        const category = await new CategoryService().updateCategory({ ...params, ...body });
        return res.status(200).json({success: true, message: "Category updated", data: category });
    } catch (error) {
        next(error);
    }
}

export const deleteCategory = async (req: Request<GetOneCategoryParams>, res: Response, next: NextFunction) => {
    try {
        const params = req.params;
        const success = await new CategoryService().deleteCategory(params);
        return res.status(200).send({
            success,
            message: "Category removed"
        });
    } catch (error) {
        next(error);
    }
}