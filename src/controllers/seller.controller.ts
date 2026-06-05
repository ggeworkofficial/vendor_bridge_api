import { Request, Response, NextFunction } from "express";
import { CreateSellerBody, GetOneSellerParams, GetAllSellersQuery, UpdateSellerBody } from "../validators/seller.validator";
import SellerService from "../service/seller.service";

export const createSeller = async (req: Request<{}, any, CreateSellerBody>, res: Response, next: NextFunction) => {
    try {
        const body = req.body;
        const seller = await new SellerService().createSeller(body);
        res.status(201).json({
            success: true,
            message: "category created",
            data: seller
        });
    } catch (error) {
        next(error);
    }
}

export const getOneSeller = async (req: Request<GetOneSellerParams>, res: Response, next: NextFunction) => {
    try {
        const params = req.params;
        const seller = await new SellerService().getOneSeller(params);
        res.status(200).json(seller);
    }
    catch (error) {
        next(error);
    }
}

export const getAllSellers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const query = (req as any).validated?.query as GetAllSellersQuery;
        const sellers = await new SellerService().getAllSellers(query);
        res.status(200).json(sellers);
    }
    catch (error) {
        next(error);
    }
}

export const updateSeller = async (req: Request<GetOneSellerParams, any, UpdateSellerBody>, res: Response, next: NextFunction) => {
    try {
        const params = req.params;
        const body = req.body;
        const seller = await new SellerService().updateSeller({ ...params, ...body });
        res.status(200).json({
            success: true,
            message: "category modified",
            data: seller
        });
    } catch (error) {
        next(error);
    }
}

export const deleteSeller = async (req: Request<GetOneSellerParams>, res: Response, next: NextFunction) => {
    try {
        const params = req.params;
        const success = await new SellerService().deleteSeller(params);
        res.status(204).send({
            success,
            message: "Seller removed"
        });
    } catch (error) {
        next(error);
    }
}