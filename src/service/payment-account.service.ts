import { createError } from "../helpers/error";
import {
  createPaymentAccount,
  getPaymentAccountById,
  getPaymentAccountsList,
  updatePaymentAccount,
  deletePaymentAccount,
  findPaymentAccountByNumber,
  CreatePaymentAccountResult,
  PaymentAccountResult,
} from "../repositories/payment-account.repository";
import { removeUndefined } from "../utils/removeUndefined";
import { CreatePaymentAccountBody, GetPaymentAccountParams, GetPaymentAccountsQuery, UpdatePaymentAccountBody } from "../validators/payment-account.validator";
import { Role } from "../middleware/roleChecker";
import { PaginationResponse } from "../types/pageination";

export default class PaymentAccountService {
  async createPaymentAccount(role: Role, data: CreatePaymentAccountBody): Promise<CreatePaymentAccountResult> {
    if (role !== "admin") throw createError("Forbidden", 403);

    const existing = await findPaymentAccountByNumber(data.account_number);
    if (existing) throw createError("Account number already exists", 400);

    const id = crypto.randomUUID();
    const created_at = new Date();
    const updated_at = new Date();
    const cleanData = removeUndefined({ id, ...data, created_at, updated_at });
    return await createPaymentAccount(cleanData);
  }

  async getPaymentAccount(data: GetPaymentAccountParams): Promise<PaymentAccountResult> {
    const account = await getPaymentAccountById(data.id);
    if (!account) throw createError("Payment account not found", 404);
    return account;
  }

  async getPaymentAccounts(query: GetPaymentAccountsQuery): Promise<PaginationResponse<PaymentAccountResult>> {
    const cleanQuery = removeUndefined(query);
    return await getPaymentAccountsList(cleanQuery);
  }

  async updatePaymentAccount(role: Role, data: GetPaymentAccountParams & UpdatePaymentAccountBody): Promise<PaymentAccountResult> {
    if (role !== "admin") throw createError("Forbidden", 403);

    const account = await getPaymentAccountById(data.id);
    if (!account) throw createError("Payment account not found", 404);

    if (data.account_number && data.account_number !== account.account_number) {
      const existing = await findPaymentAccountByNumber(data.account_number, data.id);
      if (existing) throw createError("Account number already exists", 400);
    }

    const updated_at = new Date();
    const cleanData = removeUndefined({ ...data, updated_at });
    delete (cleanData as any).id;

    const result = await updatePaymentAccount(data.id, cleanData);
    if (!result) throw createError("Payment account not found", 404);
    return result;
  }

  async deletePaymentAccount(role: Role, data: GetPaymentAccountParams): Promise<boolean> {
    if (role !== "admin") throw createError("Forbidden", 403);

    const account = await getPaymentAccountById(data.id);
    if (!account) throw createError("Payment account not found", 404);

    const success = await deletePaymentAccount(data.id);
    if (!success) throw createError("Payment account not found", 404);
    return success;
  }
}
