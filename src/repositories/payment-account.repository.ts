import { Op, WhereOptions } from "sequelize";
import { PaymentAccount } from "../models";
import { PaginationResponse } from "../types/pageination";

export interface PaymentAccountBase {
  id: string;
  type: string;
  label: string;
  account_name: string;
  account_number: string;
  details?: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreatePaymentAccountResult {
  id: string;
  type: string;
  label: string;
  account_name: string;
  account_number: string;
  details?: string;
  created_at: Date;
  updated_at: Date;
}

export interface PaymentAccountResult {
  id: string;
  type: string;
  label: string;
  account_name: string;
  account_number: string;
  details?: string;
  created_at: Date;
  updated_at: Date;
}

type GetPaymentAccountsPayload = {
  page: number;
  limit: number;
  search?: string;
  order: string;
};

export const createPaymentAccount = async (data: PaymentAccountBase): Promise<CreatePaymentAccountResult> => {
  const account = await PaymentAccount.create(data as any);
  return account;
};

export const getPaymentAccountById = async (id: string): Promise<PaymentAccountResult | null> => {
  const account = await PaymentAccount.findByPk(id);
  if (!account) return null;
  return account;
};

export const getPaymentAccountsList = async (payload: GetPaymentAccountsPayload): Promise<PaginationResponse<PaymentAccountResult>> => {
  const { page, limit, search, order } = payload;
  const where: WhereOptions<any> = {};
  const offset = (page - 1) * limit;

  if (search) {
    Object.assign(where, {
      [Op.or]: [
        { label: { [Op.iLike]: `%${search}%` } },
        { account_name: { [Op.iLike]: `%${search}%` } },
        { account_number: { [Op.iLike]: `%${search}%` } },
      ],
    });
  }

  const { rows, count } = await PaymentAccount.findAndCountAll({
    where,
    limit,
    offset,
    order: [["created_at", order]],
  });

  return {
    data: rows.map((row) => row),
    meta: {
      page,
      limit,
      total: count,
    },
  };
};

export const updatePaymentAccount = async (id: string, data: Partial<Omit<PaymentAccountBase, "id">>): Promise<PaymentAccountResult | null> => {
  const account = await PaymentAccount.findByPk(id);
  if (!account) {
    return null;
  }
  await account.update(data);
  return account;
};

export const deletePaymentAccount = async (id: string): Promise<boolean> => {
  const deleted = await PaymentAccount.destroy({ where: { id } });
  return deleted > 0;
};

export const findPaymentAccountByNumber = async (account_number: string, excludeId?: string): Promise<PaymentAccountResult | null> => {
  const where: WhereOptions<any> = { account_number };
  if (excludeId) {
    Object.assign(where, { id: { [Op.ne]: excludeId } });
  }
  const account = await PaymentAccount.findOne({ where });
  if (!account) return null;
  return account;
};
