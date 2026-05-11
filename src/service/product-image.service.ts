import { Transaction } from "sequelize";
import { createProductImages, deleteProductImage, getProductImage, getProductImages, ProductImageBase, ProductImageResult, updateProductImage } from "../repositories/product-image.repository";
import { CreateProductImageBody, UpdateProductImageBody } from "../validators/product-image.validator";
import { removeUndefined } from "../utils/removeUndefined";
import { createError } from "../helpers/error";


type CreateProductImageOption = Omit<CreateProductImageBody, "is_primary"> & { 
    image_url: string,
    is_primary?: boolean
};
type CreateProductImageResult = ProductImageBase;
type ProductImageReuslt = ProductImageResult;
type UpdateProductImageOption = UpdateProductImageBody
export class ProductImageService {
    async create(data: CreateProductImageOption[], transaction: Transaction): Promise<CreateProductImageResult[]> {
        const properData = data.map(data => ({
            id: crypto.randomUUID(),
            created_at: new Date(),
            updated_at: new Date(),
            ... data
        }));
        return await createProductImages(properData, transaction);
    }

    async getProductImage(id: string): Promise<ProductImageReuslt> {
        const productImage = await getProductImage(id);
        if (!productImage) throw createError("Image not found", 404);
        return productImage;
    }

    async getProuctImages(product_id: string): Promise<ProductImageResult[]> {
        const productImages = await getProductImages(product_id);
        return productImages
    }

    async update(id: string, data: UpdateProductImageOption): Promise<void>  {
        const cleanData = removeUndefined({ ...data, updated_at: new Date()})
        await updateProductImage(id, cleanData);
    }

    async deleteProduct(id: string): Promise<void> {
        await deleteProductImage(id);
    }
}