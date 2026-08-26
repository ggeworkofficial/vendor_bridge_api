import { Transaction } from "sequelize";
import { createError } from "../helpers/error";
import { Listing } from "../models";
import {
    CreateListingData,
    ListingFilter,
    ListingMediaData,
    ListingPriceTierData,
    createInventory,
    createListing,
    createListingMedia,
    createListingPriceTier,
    destroyListing,
    destroyListingPriceTiers,
    findInventoryById,
    findListingById,
    findListingWithDetails,
    findListingWithTiersByProduct,
    findListings,
    findListingsByUser,
    findPrimaryListingMedia,
    findSellerByIdRaw,
    findSellerByUserId,
    updateInventory,
    updateListing
} from "../repositories/listing.repository";
import { PaginationResponse } from "../types/pageination";

export interface UploadedFileRef {
    filename: string;
}

export interface CreateListingInput {
    kind: string;
    title: string;
    description: string;
    price: number;
    price_model?: string;
    quantity?: number;
    category_id?: string | null;
    location?: string | null;
    tags?: string | string[] | null;
    bulk_enabled?: boolean | string;
    bulk_only?: boolean | string;
    moq?: number;
    tiers?: string | any[];
    commission_enabled?: boolean | string;
    commission_percent?: number;
}

export type UpdateListingInput = Partial<CreateListingInput>;

export interface ListListingsInput {
    page: number;
    limit: number;
    kind?: string | undefined;
    status?: string | undefined;
    search?: string | undefined;
    category_id?: string | undefined;
    user_id?: string | undefined;
    seller_id?: string | undefined;
    bulk?: string | undefined;
    commission?: string | undefined;
    sort?: string | undefined;
    order?: string | undefined;
}

const toBool = (value: boolean | string | undefined): boolean => value === 'true' || value === true;

export class ListingService {
    async createListing(user_id: string, input: CreateListingInput, files: UploadedFileRef[], transaction: Transaction): Promise<Listing> {
        const listing = await createListing({
            id: crypto.randomUUID(),
            user_id,
            kind: input.kind,
            title: input.title,
            description: input.description,
            price: input.price,
            price_model: input.price_model || (input.kind === 'product' ? 'fixed' : 'hourly'),
            quantity: input.quantity || 0,
            category_id: input.category_id || null,
            location: input.location || null,
            tags: input.tags ? (typeof input.tags === 'string' ? JSON.parse(input.tags) : input.tags) : null,
            status: 'under_review',
            bulk_enabled: toBool(input.bulk_enabled),
            bulk_only: toBool(input.bulk_only),
            moq: input.moq || 1,
            commission_enabled: toBool(input.commission_enabled),
            commission_percent: input.commission_percent || 0,
        }, transaction);

        if (files && files.length > 0) {
            const mediaPromises = files.map((file, index) => {
                const media: ListingMediaData = {
                    id: crypto.randomUUID(),
                    listing_id: listing.id,
                    url: `/uploads/${file.filename}`,
                    file_name: file.filename,
                    kind: input.kind === 'product' ? 'image' : 'portfolio',
                    is_primary: index === 0,
                    position: index,
                };
                return createListingMedia(media, transaction);
            });
            await Promise.all(mediaPromises);
        }

        if (input.tiers) {
            const parsedTiers = typeof input.tiers === 'string' ? JSON.parse(input.tiers) : input.tiers;
            if (Array.isArray(parsedTiers)) {
                const tierPromises = parsedTiers.map(tier => {
                    const tierData: ListingPriceTierData = {
                        id: crypto.randomUUID(),
                        listing_id: listing.id,
                        min_qty: tier.min_qty,
                        unit_price: tier.unit_price,
                    };
                    return createListingPriceTier(tierData, transaction);
                });
                await Promise.all(tierPromises);
            }
        }

        return listing;
    }

    async getListingDetailById(id: string): Promise<Listing | null> {
        return findListingWithDetails(id);
    }

    async getListings(input: ListListingsInput, role?: string): Promise<PaginationResponse<Listing>> {
        const filter: ListingFilter = {};

        if (input.status) {
            if (role !== 'admin' && input.status !== 'published') {
                throw createError('Forbidden', 403);
            }
            filter.status = input.status;
        } else {
            if (role !== 'admin') {
                filter.status = 'published';
            }
        }

        if (input.kind) filter.kind = input.kind;
        if (input.category_id) filter.category_id = input.category_id;
        if (input.user_id) filter.user_id = input.user_id;
        if (input.bulk) filter.bulk_enabled = input.bulk === 'true';
        if (input.commission) filter.commission_enabled = input.commission === 'true';

        if (input.search) {
            filter.title_search = input.search;
        }

        if (input.seller_id) {
            const seller = await findSellerByIdRaw(input.seller_id);
            if (!seller) {
                throw createError('Seller not found', 404);
            }
            filter.user_id = seller.user_id;
        }

        return findListings({ filter, page: input.page, limit: input.limit, sort: input.sort, order: input.order });
    }

    async getMyListings(user_id: string, page: number, limit: number): Promise<PaginationResponse<Listing>> {
        return findListingsByUser(user_id, { page, limit });
    }

    async getListing(id: string, user_id?: string, role?: string): Promise<Listing> {
        const listing = await findListingWithDetails(id);

        if (!listing) {
            throw createError('Listing not found', 404);
        }

        if (listing.status !== 'published' && role !== 'admin' && user_id !== listing.user_id) {
            throw createError('Listing not available', 403);
        }

        return listing;
    }

    async getListingByProduct(productId: string): Promise<Listing | null> {
        return findListingWithTiersByProduct(productId);
    }

    async updateListing(id: string, user_id: string, role: string | undefined, input: UpdateListingInput, files: UploadedFileRef[], transaction: Transaction): Promise<void> {
        const listing = await findListingById(id);
        if (!listing) {
            throw createError('Listing not found', 404);
        }

        if (listing.user_id !== user_id && role !== 'admin') {
            throw createError('Not authorized', 403);
        }

        if (listing.status === 'banned' && role !== 'admin') {
            throw createError('Cannot edit a banned listing', 403);
        }

        await updateListing(listing, {
            title: input.title || listing.title,
            description: input.description || listing.description,
            price: input.price || listing.price,
            price_model: input.price_model || listing.price_model,
            quantity: input.quantity !== undefined ? input.quantity : listing.quantity,
            category_id: input.category_id !== undefined ? input.category_id : listing.category_id,
            location: input.location !== undefined ? input.location : listing.location,
            tags: input.tags ? (typeof input.tags === 'string' ? JSON.parse(input.tags) : input.tags) : listing.tags,
            status: 'under_review',
            moderation_note: null as any,
            bulk_enabled: input.bulk_enabled !== undefined ? toBool(input.bulk_enabled) : listing.bulk_enabled,
            bulk_only: input.bulk_only !== undefined ? toBool(input.bulk_only) : listing.bulk_only,
            moq: input.moq !== undefined ? input.moq : listing.moq,
            commission_enabled: input.commission_enabled !== undefined ? toBool(input.commission_enabled) : listing.commission_enabled,
            commission_percent: input.commission_percent !== undefined ? input.commission_percent : listing.commission_percent,
        }, transaction);

        if (files && files.length > 0) {
            const mediaPromises = files.map(file => {
                const media: ListingMediaData = {
                    id: crypto.randomUUID(),
                    listing_id: listing.id,
                    url: `/uploads/${file.filename}`,
                    file_name: file.filename,
                    kind: listing.kind === 'product' ? 'image' : 'portfolio',
                    is_primary: false,
                    position: 99,
                };
                return createListingMedia(media, transaction);
            });
            await Promise.all(mediaPromises);
        }

        if (input.tiers) {
            const parsedTiers = typeof input.tiers === 'string' ? JSON.parse(input.tiers) : input.tiers;
            if (Array.isArray(parsedTiers)) {
                await destroyListingPriceTiers(listing.id, transaction);
                const tierPromises = parsedTiers.map(tier => {
                    const tierData: ListingPriceTierData = {
                        id: crypto.randomUUID(),
                        listing_id: listing.id,
                        min_qty: tier.min_qty,
                        unit_price: tier.unit_price,
                    };
                    return createListingPriceTier(tierData, transaction);
                });
                await Promise.all(tierPromises);
            }
        }
    }

    async deleteListing(id: string, user_id: string, role: string | undefined): Promise<void> {
        const listing = await findListingById(id);

        if (!listing) {
            throw createError('Listing not found', 404);
        }

        if (listing.user_id !== user_id && role !== 'admin') {
            throw createError('Not authorized', 403);
        }

        await destroyListing(listing);
    }

    async moderateListing(id: string, moderator_id: string, action: string, note: string | undefined, transaction: Transaction): Promise<string> {
        if (!['approve', 'flag', 'ban'].includes(action)) {
            throw createError('Invalid action', 400);
        }

        const listing = await findListingById(id);
        if (!listing) {
            throw createError('Listing not found', 404);
        }

        let status = listing.status;
        if (action === 'approve') status = 'published';
        if (action === 'flag') status = 'flagged';
        if (action === 'ban') status = 'banned';

        await updateListing(listing, {
            status,
            moderation_note: note || null,
            reviewed_by: moderator_id,
            reviewed_at: new Date()
        }, transaction);

        if (action === 'approve' && listing.kind === 'product') {
            await findPrimaryListingMedia(listing.id);

            let inventoryProduct = null as any;
            if (listing.product_id) {
                inventoryProduct = await findInventoryById(listing.product_id);
                if (inventoryProduct) {
                    await updateInventory(inventoryProduct, {
                        name: listing.title,
                        description: listing.description,
                        price: listing.price,
                        quantity: listing.quantity,
                        category_id: listing.category_id ?? null as any,
                        location: listing.location ?? null as any
                    }, transaction);
                }
            }

            if (!inventoryProduct) {
                const seller = await findSellerByUserId(listing.user_id);
                const sellerId = seller ? seller.id : null;

                inventoryProduct = await createInventory({
                    id: crypto.randomUUID(),
                    name: listing.title,
                    description: listing.description,
                    price: listing.price,
                    quantity: listing.quantity,
                    quality_label: 'high',
                    category_id: listing.category_id ?? null as any,
                    seller_id: sellerId ?? null as any,
                    location: listing.location ?? null as any,
                    verified: true,
                }, transaction);

                await updateListing(listing, { product_id: inventoryProduct.id }, transaction);
            }
        }

        return action;
    }
}
