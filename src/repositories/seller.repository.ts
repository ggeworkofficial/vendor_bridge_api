import { Sequelize } from "sequelize-typescript";
import { Inventory, Seller, User } from "../models";
import { WhereOptions } from "sequelize";
import { Op } from "sequelize";
import { PaginationResponse } from "../types/pageination";


interface CreateSeller {
    id: string;
    user_id: string;
    name?: string;
    location?: string;
    contact?: string;
    verified: boolean;
    created_at: Date;
    updated_at: Date;
}

interface UpdateSeller {
    id: string;
    user_id?: string;
    name?: string;
    location?: string;
    contact?: string;
    verified?: boolean;
    updated_at: Date;
}

export interface SellerCreateResult {
    id: string;
    user_id?: string;
    name?: string;
    location?: string;
    contact?: string;
    verified: boolean;
    created_at: Date;
    updated_at: Date;
}

export interface GetSellerOptions {
    page: number;
    limit: number;
    search?: string;
    sort: 'name' | 'created_at';
    order: 'asc' | 'desc';
}

export interface SellerResult {
    id: string;
    user: {id: string | undefined, name: string | undefined} | null;
    name?: string;
    location?: string;
    contact?: string;
    products?: number;
    verified: boolean;
    created_at: Date;
    updated_at: Date;
}

export const mapSellerData = (seller: any): SellerResult => {
    return {
    id: seller.id,
    name: seller.name || "",
    location: seller.location || "",
    contact: seller.contact || "",
    products: seller.products || 0,
    verified: seller.verified,
    created_at: seller.created_at,
    updated_at: seller.updated_at,
    user: seller.user
      ? {
          id: seller.user.id,
          name: seller.user.full_name
        }
      : null
  };
}

export const createSeller = async (input: CreateSeller): Promise<SellerCreateResult> => {
    return await Seller.create(input);
};

export const getSellerById = async (id: string): Promise<SellerResult | null> => {
    const seller =  await Seller.findByPk(id, {
        include: [
            {model: User, attributes: ["id", "full_name"],},
            {model: Inventory, as: "products", attributes: []},

        ],
        attributes: {
            include: [
                    [
                    Sequelize.fn("COUNT", Sequelize.col("products.id")),
                    "products",
                    ],
                ],
        },
        group: ["Seller.id", "user.id"],
    });
    if (!seller) return null;   
    console.log("Seller found:", seller.toJSON());
    return mapSellerData(seller);
};

export const getAllSellers = async (options: GetSellerOptions): Promise<PaginationResponse<SellerResult>> => {
    const { page, limit, search, sort, order } = options;

    const where: WhereOptions<any> = {};
    if (search) {
        where.name = { [Op.iLike]: `%${search}%` };
    } 

    const { rows, count } = await Seller.findAndCountAll({
        where,
        limit,
        offset: (page - 1) * limit,
        order: [[sort, order]],
        subQuery: false,
        include: [
            {model: User, attributes: ["id", "full_name"]}, 
            {model: Inventory, as: "products", attributes: []},
        ],
        attributes: {
            include: [
                    [
                    Sequelize.fn("COUNT", Sequelize.col("products.id")),
                    "products",
                    ],
                ],
        },
        group: ["Seller.id", "user.id"],
    });
    return {
        data: rows.map(seller => mapSellerData(seller)),
        meta: {
            total: count.length,
            page,
            limit,
        }
    } 
};

export const updateSeller = async (input: UpdateSeller): Promise<SellerCreateResult | null> => {
    const seller = await Seller.findByPk(input.id);
    if (!seller) {
        return null;
    }
    await seller.update(input);
    return seller;
};

export const deleteSeller = async (id: string): Promise<boolean> => {
    const deletedCount = await Seller.destroy({ where: { id } });
    return deletedCount > 0;
};