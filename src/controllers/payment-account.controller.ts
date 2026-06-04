import { NextFunction, Request, Response } from "express";
import { CreatePaymentAccountBody, GetPaymentAccountParams, GetPaymentAccountsQuery, UpdatePaymentAccountBody } from "../validators/payment-account.validator";
import PaymentAccountService from "../service/payment-account.service";
import { createError } from "../helpers/error";

const paymentAccountService = new PaymentAccountService();

export const createPaymentAccount = async (req: Request<{}, any, CreatePaymentAccountBody>, res: Response, next: NextFunction) => {
  try {
    const body = req.body;
    const user_role = req.user?.role;

    if (!user_role) throw createError("Forbidden", 403);

    const account = await paymentAccountService.createPaymentAccount(user_role, body);
    return res.status(201).json({ success: true, message: "Payment account created", data: account });
  } catch (error) {
    next(error);
  }
};

export const getPaymentAccount = async (req: Request<GetPaymentAccountParams>, res: Response, next: NextFunction) => {
  try {
    const params = req.params;
    const account = await paymentAccountService.getPaymentAccount(params);
    return res.status(200).json(account);
  } catch (error) {
    next(error);
  }
};

export const getPaymentAccounts = async (req: Request<{}, any, {}, any>, res: Response, next: NextFunction) => {
  try {
    const query = (req as any).validated?.query as GetPaymentAccountsQuery;
    const accounts = await paymentAccountService.getPaymentAccounts(query);
    return res.status(200).json(accounts);
  } catch (error) {
    next(error);
  }
};

export const updatePaymentAccount = async (req: Request<GetPaymentAccountParams, any, UpdatePaymentAccountBody>, res: Response, next: NextFunction) => {
  try {
    const params = req.params;
    const body = req.body;
    const user_role = req.user?.role;

    if (!user_role) throw createError("Forbidden", 403);

    const account = await paymentAccountService.updatePaymentAccount(user_role, { ...params, ...body });
    return res.status(200).json({ success: true, message: "Payment account updated", data: account });
  } catch (error) {
    next(error);
  }
};

export const deletePaymentAccount = async (req: Request<GetPaymentAccountParams>, res: Response, next: NextFunction) => {
  try {
    const params = req.params;
    const user_role = req.user?.role;

    if (!user_role) throw createError("Forbidden", 403);

    const success = await paymentAccountService.deletePaymentAccount(user_role, params);
    return res.status(204).send({ success, message: "Payment account deleted" });
  } catch (error) {
    next(error);
  }
};
