import { createProduct, getProduct, getProducts, updateProduct, removeProduct, ProductResult, ProductBase, getCachedProduct, setCachedProduct, getCachedProducts, setCachedProducts, invalidateCachedProducts, deleteCachedProduct, getProductQuantities, getProductQuantity } from '../repositories/inventory.repository';
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
        const product = await createProduct(cleanProduct, transaction);
        await invalidateCachedProducts();
        return product;
    }

    async getOne(id: GetProductParam['id']): Promise<ProductReturn> {
        const cachedProduct = await getCachedProduct(id);
        if (cachedProduct) {
            const quantity = await getProductQuantity(cachedProduct.id);
            return {...cachedProduct, quantity: quantity || 0};
        }

        const product = await getProduct(id);
        if (!product) throw createError("Product not found", 404);
        const { quantity, ...rest} = product;
        await setCachedProduct(id, rest);
        return {...rest, quantity};
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
        const cachedProducts = await getCachedProducts(queryData);
        if (cachedProducts) {
            const quantities = await getProductQuantities(cachedProducts.data.map(product => product.id));
            const quantityMap = new Map(quantities.map(item => [item.id, item.quantity]));
            const data = cachedProducts.data.map(product => ({
                ...product,
                quantity: quantityMap.get(product.id) || 0,
            }))
            const meta = cachedProducts.meta;
            return {data, meta};
        };
        const products = await getProducts(queryData);
        const data = products.data.map(({quantity, ...rest}) => rest)
        const meta = products.meta;
        if (products) await setCachedProducts(queryData, {data, meta});
        return products;
    }

    async update(id: GetProductParam['id'], data: UpdateInventoryBody): Promise<ProductReturn | null> {
        const updateData = {
            ...data,
            updated_at: new Date()
        };
        const cleanData = removeUndefined(updateData);
        const product = await updateProduct(id, cleanData);
        await deleteCachedProduct(id);
        await invalidateCachedProducts();
        return product;
    }

    async remove(id: GetProductParam['id']): Promise<string[]> {
        const productImages = await getProductImages(id);
        if (!productImages) throw createError("images not found", 404);
        const images = productImages.map(image => image.image_url);
        await removeProduct(id);
        await deleteCachedProduct(id);
        await invalidateCachedProducts();
        return images;
    }
}