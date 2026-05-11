import { createProduct, getProduct, getProducts, updateProduct, removeProduct, ProductResult, ProductBase } from '../repositories/inventory.repository';
import { CreateInventoryBody, GetProductParam, GetInventoryQuery, UpdateInventoryBody } from '../validators/inventory.validator';
import { PaginationResponse } from '../types/pageination';
import { randomUUID } from 'crypto';
import { removeUndefined } from '../utils/removeUndefined';
import { findCategoryById } from '../repositories/category.repository';
import { getSellerById } from '../repositories/seller.repository';
import { createError } from '../helpers/error';
import { Transaction } from 'sequelize';
import { getProductImages } from '../repositories/product-image.repository';

type ProductReturn = ProductResult;
type CreateProductResult = ProductBase;

export class InventoryService {
    async create(data: CreateInventoryBody, transaction: Transaction): Promise<CreateProductResult> {
        const category = await findCategoryById(data.category_id);
        const seller = await getSellerById(data.seller_id);

        if (!category) throw createError("Category not found", 404);
        if (!seller) throw createError("Seller not found", 404);

        const productData = {
            ...data,
            id: randomUUID(),
            created_at: new Date(),
            updated_at: new Date()
        };
        const cleanProduct = removeUndefined(productData);
        return await createProduct(cleanProduct, transaction);
    }

    async getOne(id: GetProductParam['id']): Promise<ProductReturn | null> {
        return await getProduct(id);
    }

    async getAll(query: GetInventoryQuery): Promise<PaginationResponse<ProductReturn>> {
        const queryData = {
            page: query.page,
            limit: query.limit,
            sort: query.sort,
            order: query.order,
            ...(query.quality_label && { quality_label: query.quality_label }),
            ...(query.verified !== undefined && { verified: query.verified }),
            ...(query.search && { search: query.search })
        };
        return await getProducts(queryData);
    }

    async update(id: GetProductParam['id'], data: UpdateInventoryBody): Promise<ProductReturn | null> {
        const updateData = {
            ...data,
            updated_at: new Date()
        };
        const cleanData = removeUndefined(updateData);
        return await updateProduct(id, cleanData);
    }

    async remove(id: GetProductParam['id']): Promise<string[]> {
        const productImages = await getProductImages(id);
        if (!productImages) throw createError("images not found", 404);
        const images = productImages.map(image => image.image_url);
        await removeProduct(id)
        return images;
    }
}