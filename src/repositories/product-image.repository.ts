import { Transaction, where } from "sequelize";
import { ProductImage } from "../models";
import { mapProductImage } from "../utils/imageMapper";
import Postgres from "../connection/postgres";

export type ProductImageBase = {
    id: string;
    product_id: string;
    image_url: string;
    is_primary?: boolean;
    created_at: Date;
    updated_at: Date;
}
export type ProductImageResult = ProductImageBase & {
    image_name: string;
}
type CreateProductImage = ProductImageBase;
type UpdateProductImage = Omit<ProductImageBase, "id" | "image_url" | "product_id"  | "created_at"> & {
    image_url?: string,
};


export const createProductImages = async (data: CreateProductImage[], transaction: Transaction): Promise<CreateProductImage[]> => {
    const productImages = await ProductImage.bulkCreate(
        data.map(image_data => ({
                id: image_data.id,
                product_id: image_data.product_id,
                image_url: image_data.image_url,
                is_primary: image_data.is_primary || false,
                created_at: image_data.created_at,
                updated_at: image_data.updated_at
        })),
        { transaction }
    );

    return productImages;
}

export const getProductImage = async (id: string): Promise<ProductImageResult | null> => {
    const image = await ProductImage.findByPk(id);
    if (!image) return null;
    return mapProductImage(image);
}

export const getProductImages = async (product_id: string): Promise<ProductImageResult[]> => {
    const images = await ProductImage.findAll({ 
        where: { product_id },
        limit: 20,
        order: [
            ["is_primary", "DESC"],
            ["created_at", "ASC"]
        ]
    });
    return images.map(mapProductImage);

}

export const updateProductImage = async (id: string, data: UpdateProductImage): Promise<ProductImageBase | null> => {
     const transaction = await Postgres.getInstance().transaction();

    try {

        const currentImage = await ProductImage.findByPk(id);

        if (!currentImage) {
            await transaction.rollback();
            return null;
        }

        if (data.is_primary === true) {

            await ProductImage.update(
                { is_primary: false },
                {
                    where: {
                        product_id: currentImage.product_id
                    },
                    transaction
                }
            );
        }

        await ProductImage.update(
            data,
            {
                where: { id },
                transaction
            }
        );

        await transaction.commit();

        return await getProductImage(id);

    } catch (error) {

        await transaction.rollback();
        throw error;
    }
} 

export const deleteProductImage = async (id: string): Promise<boolean> => {
    return await ProductImage.destroy({ where: { id }}) > 0;
}
