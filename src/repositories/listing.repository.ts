import { Listing, ListingMedia, ListingPriceTier, Inventory, Seller, User } from "../models";
import { ListingMediaKind } from "../models/listing-media.model";
import { Op, Transaction } from "sequelize";
import { PaginationResponse } from "../types/pageination";

export interface CreateListingData {
    id: string;
    user_id: string;
    kind: string;
    title: string;
    description: string;
    price: number;
    price_model: string;
    quantity: number;
    category_id?: string | null;
    location?: string | null;
    tags?: string[] | null;
    status: string;
    bulk_enabled: boolean;
    bulk_only: boolean;
    moq: number;
    commission_enabled: boolean;
    commission_percent: number;
}

export interface ListingMediaData {
    id: string;
    listing_id: string;
    url: string;
    file_name: string;
    kind: ListingMediaKind;
    is_primary: boolean;
    position: number;
}

export interface ListingPriceTierData {
    id: string;
    listing_id: string;
    min_qty: number;
    unit_price: number;
}

export interface ListingFilter {
    status?: string | undefined;
    kind?: string | undefined;
    category_id?: string | undefined;
    user_id?: string | undefined;
    bulk_enabled?: boolean | undefined;
    commission_enabled?: boolean | undefined;
    title_search?: string | undefined;
}

export interface ListListingsOptions {
    filter: ListingFilter;
    page: number;
    limit: number;
    sort?: string | undefined;
    order?: string | undefined;
}

export const createListing = async (data: CreateListingData, transaction: Transaction): Promise<Listing> => {
    return Listing.create(data as any, { transaction });
};

export const findListingById = async (id: string): Promise<Listing | null> => {
    return Listing.findByPk(id);
};

export const findListingWithDetails = async (id: string): Promise<Listing | null> => {
    return Listing.findByPk(id, {
        include: [
            { model: ListingMedia, separate: true, order: [['position', 'ASC']] },
            { model: ListingPriceTier, separate: true, order: [['min_qty', 'ASC']] },
            { model: User, as: 'owner', attributes: ['id', 'full_name'] }
        ]
    });
};

export const findListingWithTiersByProduct = async (productId: string): Promise<Listing | null> => {
    return Listing.findOne({
        where: { product_id: productId },
        include: [
            { model: ListingPriceTier, separate: true, order: [['min_qty', 'ASC']] }
        ]
    });
};

export const updateListing = async (listing: Listing, data: Record<string, any>, transaction?: Transaction): Promise<Listing> => {
    return listing.update(data as any, transaction ? { transaction } : undefined);
};

export const destroyListing = async (listing: Listing): Promise<void> => {
    await listing.destroy();
};

export const findListings = async (options: ListListingsOptions): Promise<PaginationResponse<Listing>> => {
    const { filter, page, limit, sort, order } = options;

    const whereClause: any = {};
    if (filter.status) whereClause.status = filter.status;
    if (filter.kind) whereClause.kind = filter.kind;
    if (filter.category_id) whereClause.category_id = filter.category_id;
    if (filter.user_id) whereClause.user_id = filter.user_id;
    if (filter.bulk_enabled !== undefined) whereClause.bulk_enabled = filter.bulk_enabled;
    if (filter.commission_enabled !== undefined) whereClause.commission_enabled = filter.commission_enabled;
    if (filter.title_search) {
        whereClause.title = { [Op.iLike]: `%${filter.title_search}%` };
    }

    let orderClause: any = [['created_at', 'DESC']];
    if (sort) {
        const sortOrder = order === 'asc' ? 'ASC' : 'DESC';
        if (sort === 'price') orderClause = [['price', sortOrder]];
        if (sort === 'title') orderClause = [['title', sortOrder]];
        if (sort === 'created_at') orderClause = [['created_at', sortOrder]];
    }

    const offset = (page - 1) * limit;

    const { rows, count } = await Listing.findAndCountAll({
        where: whereClause,
        include: [
            { model: ListingMedia, separate: true, order: [['position', 'ASC']] },
            { model: ListingPriceTier, separate: true, order: [['min_qty', 'ASC']] },
            { model: User, as: 'owner', attributes: ['id', 'full_name'] }
        ],
        limit,
        offset,
        order: orderClause
    });

    return {
        data: rows,
        meta: {
            page,
            limit,
            total: count
        }
    };
};

export const findListingsByUser = async (userId: string, options: { page: number; limit: number }): Promise<PaginationResponse<Listing>> => {
    const { rows, count } = await Listing.findAndCountAll({
        where: { user_id: userId },
        include: [
            { model: ListingMedia, separate: true, order: [['position', 'ASC']] },
            { model: ListingPriceTier, separate: true, order: [['min_qty', 'ASC']] }
        ],
        limit: options.limit,
        offset: (options.page - 1) * options.limit,
        order: [['created_at', 'DESC']]
    });

    return {
        data: rows,
        meta: {
            page: options.page,
            limit: options.limit,
            total: count
        }
    };
};

export const createListingMedia = async (data: ListingMediaData, transaction: Transaction): Promise<ListingMedia> => {
    return ListingMedia.create(data, { transaction });
};

export const destroyListingPriceTiers = async (listingId: string, transaction: Transaction): Promise<void> => {
    await ListingPriceTier.destroy({ where: { listing_id: listingId }, transaction });
};

export const createListingPriceTier = async (data: ListingPriceTierData, transaction: Transaction): Promise<ListingPriceTier> => {
    return ListingPriceTier.create(data, { transaction });
};

export const findPrimaryListingMedia = async (listingId: string): Promise<ListingMedia | null> => {
    return ListingMedia.findOne({ where: { listing_id: listingId, is_primary: true } });
};

export const findSellerByIdRaw = async (id: string): Promise<Seller | null> => {
    return Seller.findByPk(id);
};

export const findSellerByUserId = async (userId: string): Promise<Seller | null> => {
    return Seller.findOne({ where: { user_id: userId } });
};

export const findInventoryById = async (id: string): Promise<Inventory | null> => {
    return Inventory.findByPk(id);
};

export const updateInventory = async (inventory: Inventory, data: Record<string, any>, transaction: Transaction): Promise<Inventory> => {
    return inventory.update(data as any, { transaction });
};

export const createInventory = async (data: Record<string, any>, transaction: Transaction): Promise<Inventory> => {
    return Inventory.create(data as any, { transaction });
};
