import { ProductImageBase, ProductImageResult } from "../repositories/product-image.repository";

const buildImageUrl = (fileName?: string): string => {
    if (!fileName) return "";

    return `${process.env.BASE_URL}/uploads/${fileName}`;
};

export const mapProductImage = (image: any): ProductImageResult => {
    return {
        ...image.toJSON(),
        image_name: image.image_url,
        image_url: buildImageUrl(image.image_url)
    };
};