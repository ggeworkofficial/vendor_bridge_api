import { Request, Response, NextFunction } from 'express';
import { InventoryService } from '../service/inventory.service';
import { CreateInventoryBody, GetProductParam, GetInventoryQuery, UpdateInventoryBody } from '../validators/inventory.validator';
import Postgres from '../connection/postgres';
import { ProductImageService } from '../service/product-image.service';
import { deleteFiles } from '../utils/cleanUpFile';

const inventoryService = new InventoryService();
const productImageService = new ProductImageService();

export const createProduct = async (req: Request<{}, any, CreateInventoryBody>, res: Response, next: NextFunction) => {
    const transaction = await Postgres.getInstance().transaction();
    const files = req.files as Express.Multer.File[] || [];
    const fileNames = files.map(file => file.filename);
    try {
        const data = req.body;
        const product = await inventoryService.create(data, transaction);
        
        if (fileNames.length > 0) {
            await productImageService.create(
                fileNames.map(filename => ({
                    product_id: product.id,
                    image_url: filename,
                })), transaction
            );
        }

        await transaction.commit();
        res.status(201).json({
            success: true,
            message: "Product created",
            data: product
        });
    } catch (error) {
        await transaction.rollback();
        if (fileNames.length > 0) await deleteFiles(fileNames);

        next(error);
    }
};

export const getProduct = async (req: Request<GetProductParam>, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const result = await inventoryService.getOne(id);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const getInventory = async (req: Request<{}, any, any, any>, res: Response, next: NextFunction) => {
    try {
        const query = (req as any).validated?.query as GetInventoryQuery;
        const result = await inventoryService.getAll(query);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const updateProduct = async (req: Request<GetProductParam, any, UpdateInventoryBody>, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const result = await inventoryService.update(id, data);
        if (!result) {
            res.status(404).json({ message: 'Inventory not found' });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Product updated",
            data: result
        });
    } catch (error) {
        next(error);
    }
};

export const removeProduct = async (req: Request<GetProductParam>, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const images = await inventoryService.remove(id);
        if (!images) {
            res.status(404).json({ message: 'Inventory not found' });
            return;
        }

        await deleteFiles(images);
        res.status(200).send({
            success: !!images,
            message: "product removed"
        });
    } catch (error) {
        next(error);
    }
};