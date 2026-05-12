import { createError } from "../helpers/error";
import { invalidateCachedProducts } from "../repositories/inventory.repository";
import { createSeller, deleteSeller, getAllSellers, getSellerById, SellerCreateResult, SellerResult, updateSeller } from "../repositories/seller.repository";
import { findUserById } from "../repositories/user.repository";
import { removeUndefined } from "../utils/removeUndefined";
import { CreateSellerBody, GetOneSellerParams, UpdateSellerBody } from "../validators/seller.validator";


export default class SellerService {
    async createSeller(data: CreateSellerBody): Promise<SellerCreateResult> {
        const id = crypto.randomUUID();
        const created_at = new Date();
        const updated_at = new Date();
        const user = await findUserById(data.user_id);
        if (!user || user.role != 'contributor') throw createError('Invalid user type', 400);
        const cleanSeller = removeUndefined({ id, ...data, created_at, updated_at })
        return await createSeller(cleanSeller);
    }

    async getOneSeller(data: GetOneSellerParams): Promise<SellerResult> {
        const seller = await getSellerById(data.id);
        if (!seller) throw createError ("Seller not found", 404);
        return seller;
    }

    async getAllSellers(): Promise<SellerResult[]> {
        return await getAllSellers();
    }

    async updateSeller(data: GetOneSellerParams & UpdateSellerBody): Promise<SellerCreateResult> {
        const updated_at = new Date();
        const cleanData = removeUndefined({ ...data, updated_at });
        const result = await updateSeller(cleanData);
        if (!result) throw createError("Seller not found", 404);
        await invalidateCachedProducts();
        return result;
    }

    async deleteSeller(data: GetOneSellerParams): Promise<boolean> {
        const success = await deleteSeller(data.id);
        if (!success) throw createError("Seller not found", 404);
        await invalidateCachedProducts();
        return success;
    }
}