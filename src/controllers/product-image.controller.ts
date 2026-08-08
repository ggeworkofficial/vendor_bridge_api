import { NextFunction, Request, Response } from "express";
import { deleteFiles } from "../utils/cleanUpFile";
import { ProductImageService } from "../service/product-image.service";
import { CreateProductImageBody, GetProductImageParam, GetProductImagesPatam, UpdateProductImageBody } from "../validators/product-image.validator";
import Postgres from "../connection/postgres";
import { createError } from "../helpers/error";

const productImageService = new ProductImageService();

export const createProductImage = async (req: Request<{}, any, CreateProductImageBody>, res: Response, next: NextFunction) => {
    const transaction = await Postgres.getInstance().transaction();
    const files = req.files as Express.Multer.File[] || [];
    const fileNames = files.map(file => file.filename);
    const body = req.body;
    try {
        if (fileNames.length > 0 && fileNames.length === 1) {
            const data = fileNames.map(fileName => ({
                product_id: body.product_id,
                image_url: fileName,
                is_primary: body.is_primary
            }));
            const productImage = await productImageService.create(data, transaction);
            res.status(200).json({
                sucess: true,
                message: "Product created",
                data: productImage
            });
        }

        if (fileNames.length === 0) throw createError("An image is required", 400);
        if (fileNames.length > 1) throw createError("Only one image allowed", 400);

        await transaction.commit();

    } catch(error) {
        await transaction.rollback();
        if (fileNames.length > 0) await deleteFiles(fileNames);
        next(error);
    }
}

export const getProductImage = async (req: Request<GetProductImageParam>, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        const productImage = await productImageService.getProductImage(id);

        res.status(200).json(productImage);

    } catch (error) {
        next(error);
    }
};

export const getProductImages = async (req: Request<{}, any, {}, any>, res: Response, next: NextFunction) => {
    try {
        const query = req.query as GetProductImagesPatam;
        const productImages = await productImageService.getProuctImages(query.product_id);

        res.status(200).json(productImages);

    } catch (error) {
        next(error);
    }
};

export const updateProductImage = async (
    req: Request<GetProductImageParam, any, UpdateProductImageBody>,
    res: Response,
    next: NextFunction
) => {
    try {
        const id = req.params.id;

        const updatedImage = await productImageService.update(id, {
            is_primary: req.body.is_primary
        });

        res.status(200).json({
            success: true,
            message: "Image updated",
            data: updatedImage
        });

    } catch (error) {
        next(error);
    }
};

export const deleteProductImage = async ( req: Request<GetProductImageParam>, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        const productImage = await productImageService.getProductImage(id);
        await deleteFiles([productImage.image_name]);
        await productImageService.deleteProductImage(id);

        res.status(200).json({
            success: true,
            message: "Image deleted"
        });

    } catch(error) {
        next(error);
    }
}