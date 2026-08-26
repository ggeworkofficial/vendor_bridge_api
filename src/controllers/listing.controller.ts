import { NextFunction, Request, Response } from 'express';
import Postgres from '../connection/postgres';
import { ListingService } from '../service/listing.service';

const listingService = new ListingService();

export class ListingController {
  public async createListing(req: Request, res: Response, next: NextFunction): Promise<void> {
    const transaction = await Postgres.getInstance().transaction();
    let committed = false;
    try {
      const user_id = req.user!.id;
      const files = (req.files as Express.Multer.File[]) || [];

      const listing = await listingService.createListing(user_id, req.body, files, transaction);

      await transaction.commit();
      committed = true;

      const createdListing = await listingService.getListingDetailById(listing.id);

      res.status(201).json({ success: true, message: 'Listing submitted for review', data: createdListing });
    } catch (error) {
      if (!committed) await transaction.rollback();
      next(error);
    }
  }

  public async getListings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = Number(req.query.page ?? 1);
      const limit = Number(req.query.limit ?? 10);

      const result = await listingService.getListings({
        page,
        limit,
        kind: req.query.kind as string | undefined,
        status: req.query.status as string | undefined,
        search: req.query.search as string | undefined,
        category_id: req.query.category_id as string | undefined,
        user_id: req.query.user_id as string | undefined,
        seller_id: req.query.seller_id as string | undefined,
        bulk: req.query.bulk as string | undefined,
        commission: req.query.commission as string | undefined,
        sort: req.query.sort as string | undefined,
        order: req.query.order as string | undefined
      }, req.user?.role);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  public async getMyListings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user_id = req.user!.id;
      const page = Number(req.query.page ?? 1);
      const limit = Number(req.query.limit ?? 10);

      const result = await listingService.getMyListings(user_id, page, limit);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  public async getListing(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const listing = await listingService.getListing(id as string, req.user?.id, req.user?.role);

      res.status(200).json({ data: listing });
    } catch (error) {
      next(error);
    }
  }

  public async getListingByProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { productId } = req.params;

      const listing = await listingService.getListingByProduct(productId as string);

      res.status(200).json({ data: listing });
    } catch (error) {
      next(error);
    }
  }

  public async updateListing(req: Request, res: Response, next: NextFunction): Promise<void> {
    const transaction = await Postgres.getInstance().transaction();
    let committed = false;
    try {
      const { id } = req.params;
      const user_id = req.user!.id;
      const files = (req.files as Express.Multer.File[]) || [];

      await listingService.updateListing(id as string, user_id, req.user?.role, req.body, files, transaction);

      await transaction.commit();
      committed = true;

      const updatedListing = await listingService.getListingDetailById(id as string);

      res.status(200).json({ success: true, message: 'Listing updated and is under review', data: updatedListing });
    } catch (error) {
      if (!committed) await transaction.rollback();
      next(error);
    }
  }

  public async deleteListing(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      await listingService.deleteListing(id as string, req.user!.id, req.user?.role);

      res.status(200).json({ success: true, message: 'Listing deleted' });
    } catch (error) {
      next(error);
    }
  }

  public async moderateListing(req: Request, res: Response, next: NextFunction): Promise<void> {
    const transaction = await Postgres.getInstance().transaction();
    try {
      const { id } = req.params;
      const { action, note } = req.body;

      await listingService.moderateListing(id as string, req.user!.id, action, note, transaction);

      await transaction.commit();

      res.status(200).json({ success: true, message: `Listing ${action}d` });
    } catch (error) {
      await transaction.rollback();
      next(error);
    }
  }
}
