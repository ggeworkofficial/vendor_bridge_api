import { Transaction } from "sequelize";
import { createError } from "../../helpers/error";
import { ResellerApplicationStatus } from "../../models/reseller-application.model";
import { ResellerApplicationBase, createResellerApplication, getResellerApplicationById, getResellerApplications, updateResellerApplication } from "../../repositories/reseller-application.repository";
import { PaginationResponse } from "../../types/pageination";
import { removeUndefined } from "../../utils/removeUndefined";
import { UpdateReceiptsBody } from "../../validators/receipt.validator";
import { CreateResellerApplicationBody, GetResellerApplicationsQuery, UpdateResellerApplicationBody } from "../../validators/reseller-application.validator";
import { ResellerService } from "./reseller.service";
import { ResellerBase } from "../../repositories/reseller.repository";


export class ResellerApplicationService {
    private reseller: ResellerService;
    public constructor() {
        this.reseller = new ResellerService();
    }

    public async createResellerApplication(user_id: string, data: CreateResellerApplicationBody, transaction: Transaction): Promise<{application: ResellerApplicationBase, reseller: ResellerBase}> {
        const id = crypto.randomUUID();
        const status: ResellerApplicationStatus = "pending";
        const created_at = new Date();
        const updated_at = new Date();

        const cleanData = removeUndefined({id, user_id, status, created_at, updated_at, ...data});
        const application = await createResellerApplication(cleanData);
        const resellerPayload = {
            id: cleanData.id, 
            user_id: cleanData.user_id, 
            commission_rate: 0,
            joined_at: new Date(),
            is_active: true,
            current_balance: 0,
            total_paid: 0,
            created_at: new Date(),
            updated_at: new Date(),
        }
        const reseller = await this.reseller.createReseller(resellerPayload, transaction);
        return {application, reseller};
    }

    public async getResellerApplicationById(id: string): Promise<ResellerApplicationBase>  {
        const application = await getResellerApplicationById(id);
        if (!application) throw createError("Application not found", 404);
        return application;
    }

    public async getResellerApplications(payload: GetResellerApplicationsQuery): Promise<PaginationResponse<ResellerApplicationBase>> {
        const cleanPayload = removeUndefined(payload)
        const applications = await getResellerApplications(cleanPayload);
        return applications;
    }

    public async updateResellerrApplications(id: string, user_id: string, payload: UpdateResellerApplicationBody, transaction: Transaction): Promise<ResellerApplicationBase> {
        const updated_at = new Date();
        const cleanPayload = removeUndefined({updated_at, ...payload});
        const newApplication = await updateResellerApplication(id, cleanPayload, transaction);

        const resellerPayload = {
            id: crypto.randomUUID(), 
            user_id, 
            commission_rate: payload.commission_rate, 
            joined_at: new Date(), 
            is_active: true, 
            current_balance: 0, 
            total_paid: 0, 
            created_at: new Date(), 
            updated_at: new Date()
        }
        const cleanResellerPayload = removeUndefined(resellerPayload)
        const reseller = this.reseller.createReseller(cleanResellerPayload, transaction);
        
        if (!newApplication) throw createError("Application not found", 404);
        return newApplication;
    }
}