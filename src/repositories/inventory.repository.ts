import { Op, Sequelize, Transaction, WhereOptions } from "sequelize";
import Postgres from "../connection/postgres";
import { createError } from "../helpers/error";
import { Category, Inventory, ProductImage, Review, Seller } from "../models";
import { QualityLable } from "../models/inventory.model";
import { PaginationResponse } from "../types/pageination";
import { mapProductImage } from "../utils/imageMapper";


export interface ProductBase {
    id: string,
    name: string,
    description?: string,
    price: number,
    quality_label: QualityLable,
    verified: boolean,
    category_id: string,
    seller_id: string,
    location?: string,
    created_at: Date,
    updated_at: Date,
}

interface GetInventoryOption {
    page: number,
    limit: number,
    quality_label?: QualityLable,
    verified?: boolean,
    search?: string
    sort: 'name' | 'price' | 'verified' | 'created_at',
    order: 'asc' | 'desc'
}

type UpdateProductInput = Partial<Omit<ProductBase, "id" | "created_at">>;
type UpdateOption = UpdateProductInput & {
    updated_at: Date
}
export type ProductResult = Omit<ProductBase, 'category_id' | 'seller_id'> & {
    category: {
        id: string,
        name: string,
    },
    seller: {
        id: string,
        name?: string
    },
    images: string[],
    rating: number,
    reviewCount: number
}

const mapInventory = (product: any): ProductResult => {
    return {
        id: product.id,
        name: product.name,
        description: product.description || "",
        price: product.price,
        quality_label: product.quality_label,
        verified: product.verified,
        images: (product.images || []).map(mapProductImage),
        category: { id: product.category?.id || "", name: product.category?.name || ""},
        seller: { id: product.seller?.id || "", name: product.seller?.name || ""},
        location: product.location || "",
        rating: Number(product.get("rating")) || 0,
        reviewCount: Number(product.get("reviewCount")) || 0,
        created_at: product.created_at,
        updated_at: product.updated_at,
    };
}

export const createProduct = async (data: ProductBase, transaction: Transaction): Promise<ProductBase> => {
    try {
        const create = await Inventory.create(data, { transaction });
        return create;
    } catch(error: any) {
        throw createError(error.message, 500);
    }  
}

export const getProduct = async (id: string): Promise<ProductResult | null> => {
    const product = await Inventory.findByPk(id, {
        include: [
            { model: Category, attributes: ['id', 'name'] }, 
            { model: Seller, attributes: ['id', 'name'] },
            { model: Review, attributes: []},
            { model: ProductImage, attributes: ['image_url'], separate: true, limit: 5, order: [["is_primary", "DESC"], ["created_at", "ASC"]]}
        ],
        attributes: {
            include: [
                [
                    Sequelize.fn("AVG", Sequelize.col("reviews.rating")),
                    "rating"
                ],
                [
                    Sequelize.fn("COUNT", Sequelize.col("reviews.id")),
                    "reviewCount"   
                ]
            ]
        },
        group: ["Inventory.id", "category.id", "seller.id"]
    });

    if (!product) return null;

    return mapInventory(product);
}

export const getProducts = async (payload: GetInventoryOption): Promise<PaginationResponse<ProductResult>> => {
     const {
        page,
        limit,
        quality_label,
        verified,
        search,
        sort,
        order,
    } = payload;
    const offset = (page - 1) * limit;
    const where: WhereOptions<any> = {};

    if (quality_label) where.quality_label = quality_label;

    if (typeof verified === "boolean") where.verified = verified;

    if (search) {
        Object.assign(where, {
            [Op.or]: [
            { name: { [Op.iLike]: `%${search}%` } },
            { description: { [Op.iLike]: `%${search}%` } },
            ],
        });
    }

    const allowedSortFields = ["name", "price", "verified", "created_at"];
    const safeSort = allowedSortFields.includes(sort)
    ? sort
    : "created_at";

    const allowedOrderFileds = ["asc", "desc"];
    const safeOrder = allowedOrderFileds.includes(order)
        ? order
        : "desc";

    const inventory = await Inventory.findAndCountAll({
        where,
        limit,
        offset,
        subQuery: false,
        order: [[Sequelize.col(`Inventory.${safeSort}`), safeOrder]],
        include: [
            { model: Category, attributes: ['id', 'name'] }, 
            { model: Seller, attributes: ['id', 'name'] },
            { model: Review, attributes: []},
            { model: ProductImage, attributes: ['image_url'], separate: true, limit: 1, order: [["is_primary", "DESC"], ["created_at", "ASC"]]}
        ],
        attributes: {
            include: [
                [
                    Sequelize.fn("AVG", Sequelize.col("reviews.rating")),
                    "rating"
                ],
                [
                    Sequelize.fn("COUNT", Sequelize.col("reviews.id")),
                    "reviewCount"   
                ]
            ]
        },
        group: ["Inventory.id", "category.id", "seller.id"]
    });

    return {
        data: inventory.rows.map(product => mapInventory(product)),
        meta: {
            page,
            limit,
            total: Array.isArray(inventory.count)
                ? inventory.count.length
                : inventory.count
        }
    }
}

export const updateProduct = async (id: string, payload: UpdateOption): Promise<ProductResult | null> => {
    await Inventory.update(payload, {where: { id }});
    const product = await getProduct(id);
    if (!product) return null;
    return product;
}

export const removeProduct = async (id: string): Promise<boolean> => {
    return await Inventory.destroy({ where: { id } }) > 0;
}

