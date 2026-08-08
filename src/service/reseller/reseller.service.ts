import { Transaction } from "sequelize";
import { createReseller, getResellerById, getResellers, updateReseller, ResellerBase, GetResellersPayload, ResellerUpdatePayload } from "../../repositories/reseller.repository";
import { createError } from "../../helpers/error";
import { GetResellerApplicationsQuery } from "../../validators/reseller-application.validator";
import { PaginationResponse } from "../../types/pageination";


export class ResellerService {
    public async createReseller(payload: ResellerBase, trnasaction: Transaction): Promise<ResellerBase> {
        const reseller = await createReseller(payload, trnasaction);
        return reseller;
    }

    public async getResellerById(id: string): Promise<ResellerBase> {
        const reseller = await getResellerById(id);
        if (!reseller) throw createError("Reseller not founda", 404);

        return reseller;
    }

    public async getResellers(payload: GetResellersPayload): Promise<PaginationResponse<ResellerBase>> {
        const resellers = await getResellers(payload);
        return resellers;
    }

    public async updateReseller(id: string, payload: ResellerUpdatePayload, transaction: Transaction): Promise<ResellerBase> {
        const reseller = await updateReseller(id, payload, transaction);
        if (!reseller) throw createError("Reseller not found", 404);
        return reseller;
    }
}